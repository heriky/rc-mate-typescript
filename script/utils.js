const fs = require('fs');
const path = require('path');

function findSync(startPath) {
    let result = [];
	let files = fs.readdirSync(startPath);

	files.forEach(val => {
		let file = path.join(startPath, val);
		let stats = fs.statSync(file);

		if(stats.isDirectory()) {
			result.push(...findSync(file))
		} else if(stats.isFile()) {
			result.push(file);
		}
	});

    return result;
}

const ALLOWED_METHOD = ['get', 'post', 'put', 'delete', 'patch'];

function to(raw, req, res) {
	if (typeof raw === 'function') {
		raw(req, res);
	} else {
		res.send(raw);
	}
}

function analyze(result, app) {
	Object.entries(result).forEach(([url, data]) => {
		// 简单类型，直接使用get注册
		if (Object.prototype.toString.apply(data) !== '[object Object]' || ALLOWED_METHOD.every(m => !(m in data))) {
			app.get(url, (req, res) => {
				to(data, req, res);
			});
			return;
		}

		// 复杂类型需要区分
		Object.entries(data).forEach(([method, raw]) => {
			app[method](url, (req, res) => {
				to(raw, req, res);
			});
		});
	});
}

function dir2Prefix(dir, rootDir) {
	const prefixDir = dir.replace(rootDir, '');
	const serviceList = prefixDir.split(path.sep).map(item => path.basename(item, path.extname(item)));
	const pathPrefix = serviceList.join('/'); // 全路径生成的前缀
	const dirPrefix = serviceList.slice(0, -1).join('/'); // 纯目录生成的前缀
	return { pathPrefix, dirPrefix };
}

function prefixer(prefix, obj) {
	return Object.entries(obj).reduce((acc, entry) => {
		const [url, config] = entry;
		const newUrl = url.startsWith(prefix) ? url : prefix + url;
		return { ...acc, [newUrl]: config }
	}, {});
};

const log = (msg, color = '32m') => {
	console.log('-'.repeat(msg.length + 2));
	console.log('\033[40;'+ color +' '+ msg +' \033[0m');;
	console.log('-'.repeat(msg.length + 2));
};

const mockServer = (mockFolder, app, config = {}) => {
	findSync(mockFolder).forEach(dir => {
		let result = require(dir);

		const { usePathPrefix, useDirPrefix, apiPrefix = '' } = config;
		const { pathPrefix, dirPrefix } = dir2Prefix(dir, mockFolder);

		let prefix = apiPrefix;
		if (usePathPrefix) {
			prefix = prefix + pathPrefix; // 只有设置了pathPrefix才和apiPrefix相加，防止apiPrefix写成正则的方式
		} else if (useDirPrefix) {
			prefix = prefix + dirPrefix; // 只有设置了pathPrefix才和apiPrefix相加，防止apiPrefix写成正则的方式
		}
		prefix = typeof prefix === 'string' ? prefix.trim() : prefix;

		const basename = path.basename(dir);

		// 这里是留了一个hack，以便于在pathPrefix的模式中，混合使用普通模式，避开文件和目录引起的前缀
		result = prefix && !(basename.startsWith('_')) ? prefixer(prefix, result) : result;

		analyze(result, app);
	});

	log('Mock: service started successfully ✔', '32m');
};

module.exports = {
	mockServer
};
