const path = require('path')
const fs = require('fs')
const { zip } = require('compressing')

function deleteFile() {
	fs.unlink(path.join(__dirname, '../dist/afd-tool.tgz'), (err) => {
		if (err) throw err;
		console.log('删除成功');
	});
}

function compressTest() {
	deleteFile()
	console.log('开始压缩');
	zip.compressDir(path.join(__dirname, '../dist/win-unpacked'), path.join(__dirname, '../dist/afd-tool.tgz'));
}

compressTest()