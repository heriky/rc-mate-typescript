const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const template = require('@babel/template').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;

/**
 * 1. traverse是针对树结构。traverse(ast)是针对所有代码, path.traverse()是针对当前path对应的域范围， 在这之间，需要明确父子节点的关系
 * 2. template只能生成一个单独类型的ast节点，如果是多个代码块，需要逐个分开，或者用大括号括起来
 * 3. path.parentPath是父路径，path.parent是父路径节点（相当于path.parentPath.node）
 * 4. find方法和findParent方法，find方法会搜索同级，而findParent不会
 * 5. 能使用对象取值的，就不要使用traverse，这个方法的代码特别大。
 * 6. 注意递归调用。
 */
module.exports = function (source) {
	// const options = getOptions(this);

	const ast = babylon.parse(source, { sourceType: 'module', plugins: [
		'jsx', 'asyncGenerators', 'classProperties', 'decorators-legacy', 
		'exportNamespaceFrom', 'objectRestSpread', 'throwExpressions', 'optionalChaining', 
		'nullishCoalescingOperator',
		'typescript'
	] });
	traverse(ast, {
		FunctionDeclaration: function (path) {
			handleAsync(path);
		},
		FunctionExpression: function (path) {
			handleAsync(path);
		},
		ClassMethod: function (path) {
			handleAsync(path);
		}
	});

	// console.log(generate(ast).code);
	return generate(ast).code;
};


function handleAsync (path) {
	const isAsync = path.node.async === true;
	if (!isAsync) return;
	path.traverse(expressionVisitor);
}

var expressionVisitor = {
	// const a = awati fetchUser() 处理这种情况
	VariableDeclarator: function (path) {
		if (t.isTryStatement(path.parentPath.parentPath.parent)) return;
		// 1.先找到await的表达式，记住它
		const expressNode = path.node.init;

		if (!t.isAwaitExpression(expressNode)) {
			return;
		}

		// 2。提取变量名称，提取表达式，生成新的ast
		const EXPRESSION = expressNode;
		const VAR_NAME = path.node.id.name;

		// 生成ast，替换
		const fn1 = template(`let ${VAR_NAME};`);
		const fn2 = template(`
		   try {
			${VAR_NAME} = EXPRESSION;
		   } catch (err) {
			   console.error(err);
		   }
		 `);
		const newAst1 = fn1();
		const newAst2 = fn2({
			EXPRESSION
		});

		// 3. 替换原有ast
		const targetPath = path.find(path => t.isVariableDeclaration(path.node));
		targetPath.replaceWithMultiple([newAst1, newAst2]);
	},
	ExpressionStatement: function (path) {
		const EXPRESSION = path.node.expression;
		if (t.isTryStatement(path.parentPath.parent)) return;

		let fn;

		// 情形一：await fetchUser()
		if (t.isAwaitExpression(EXPRESSION)) {
			fn = template(`
				try {
					EXPRESSION
				} catch (err) {
					console.error(err);
				}
			`);
			const ast = fn({
				EXPRESSION
			});

			path.replaceWith(ast);
			return;
		}

		// 情形二： this.user = await fetchUser();
		if (t.isAssignmentExpression(EXPRESSION) && t.isAwaitExpression(EXPRESSION.right)) {
			const fn = template(`
				try {
					LEFT = RIGHT;
				} catch (err) {
					console.error(err);
				}
			`);
			const ast = fn({
				LEFT: EXPRESSION.left,
				RIGHT: EXPRESSION.right
			});
			path.replaceWith(ast);
		}

	}
};
