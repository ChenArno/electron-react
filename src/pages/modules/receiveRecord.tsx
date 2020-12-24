import React, { useState, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import { Divider } from 'antd'

interface ReceiveRecordProps {
	title: string;
}
const sideWidth = 400
const ReceiveRecord: React.FC<ReceiveRecordProps> = props => {
	const { title } = props
	const codeRef: any = useRef()
	const [textArea] = useState<string>(``)
	// const [pause, setPause] = useState(false)
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
	return <div style={{ height: '100%' }}>
		<Divider orientation="left" style={{ fontSize: 14 }}>{title}</Divider>
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
}

export default ReceiveRecord