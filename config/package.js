const path = require('path')
const fs = require('fs')
const { zip } = require('compressing')
const { name, version } = require('../package.json')

function deleteFile() {
	fs.readdir(path.join(__dirname, '../dist'), (err, file) => {
		if (err) throw err;
		file.forEach((val) => {
			if (val.indexOf('.tgz') > -1) {
				fs.unlink(path.join(__dirname, `../dist/${val}`), (err) => {
					if (err) throw err;
					console.log('删除成功');
				});
			}
		})
	})

}

function compressTest() {
	deleteFile()
	console.log('开始压缩');
	zip.compressDir(path.join(__dirname, '../dist/win-unpacked'), path.join(__dirname, `../dist/${name}-v${version}.tgz`));
}

compressTest()