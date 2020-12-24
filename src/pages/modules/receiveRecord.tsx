import React, { useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import { Divider, Col } from 'antd'

interface ReceiveRecordProps {
	title: string;
	textArea?: string;
}
const sideWidth = 220
const ReceiveRecord: React.FC<ReceiveRecordProps> = props => {
	const { title, textArea = '' } = props
	const codeRef: any = useRef()
	const pauseRef: any = useRef(false)

	const onChange = (instance: any) => {
		// codeRef.current.editor
		// const { cm } = instance.doc
		const { top, height } = instance.getScrollInfo()
		instance.scrollTo(0, pauseRef.current ? top : height)
	}
	const onScroll = (instance: any) => {
		// console.log(instance)
		// const { cm } = instance.doc
		const { clientHeight, height, top } = instance.getScrollInfo()
		if ((clientHeight + top) === height) {
			pauseRef.current = false
		} else {
			pauseRef.current = true
		}
	}
	// 255
	return <Col span={6} style={{ height: '100%' }}>
		<Divider orientation="left" style={{ fontSize: 14 }}>{title}</Divider>
		<div style={{ overflowY: 'auto', height: '100%' }}>
			<CodeMirror
				ref={codeRef}
				value={textArea}
				width={sideWidth}
				options={{
					readOnly: true,
					keyMap: 'sublime',
					tabSize: 0,
					mode: 'jsx',
					lineWrapping: true,
					cursorBlinkRate: -1,
					onKeyEvent: true, // 是否允许拖拽事件和键盘事件
				}}
				onChange={onChange}
				onScroll={onScroll}
			/>
		</div>
	</Col>
}

export default ReceiveRecord