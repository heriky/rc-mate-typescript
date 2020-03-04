const { expect } = require('chai');
// const { genLinkList } = require('../algorithm/link-list');

describe('链表的测试套件', () => {
    it('测试链表的生成', () => {
        expect(genLinkList(1, 10));
    });
});