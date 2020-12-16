import React from 'react'
import { Button, Tooltip } from 'antd'

const { remote: { app } } = window.require('electron')
const xlsx = window.require('node-xlsx')
const fs = window.require('fs')

interface ImportBtnProps {
	onClick: (val: any) => void;
}

const ImportBtn: React.FC<ImportBtnProps> = props => {
	const { onClick } = props
	const importFile = (info: any) => {
		const file = fs.readFileSync(app.getAppPath() + '/config/index.xlsx')
		const [{ data }] = xlsx.parse(file)
		onClick(data.filter((o: any, i: number) => i > 0).map((o: any) => o[0]))
		// console.log(info.file.status)
		// if (info.file.status === 'error') {
		// 	const { originFileObj: { path } } = info.file
		// 	console.log(path)
		// 	if (!path) return
		// 	const file = fs.readFileSync(path)
		// 	const workSheetsFromBuffer = xlsx.parse(file)
		// 	console.log(workSheetsFromBuffer)
		// }
	}

	return <Tooltip placement="top" title="目录:  /resources/app/config/index.xlsx">
		<Button onClick={importFile}>导入标签</Button>
	</Tooltip>

	{/* <Upload name="file" action=""
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					beforeUpload={beforeUpload}
					onChange={importFile} showUploadList={false}>
					<Button >导入标签</Button>
					<span>目录:~/resources/app/config/index.xlsx</span>
				</Upload> */}
}

export default ImportBtn