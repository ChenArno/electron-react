import React, { useEffect, useRef } from 'react'
import { InputNumber, Row, Col, Button, Form, Input } from 'antd'
import styles from './index.module.less'

interface MainViewProps {
	status: boolean;
	onClick: (value: number) => void;
	clear?: () => void;
}
const MainView: React.FC<MainViewProps> = (props) => {
	const { onClick, status, clear } = props
	const inputRef: any = useRef(null)

	useEffect(() => {

	}, [])

	const onFinish = (values: any) => {
		console.log(values)
	}

	return <div className={styles.main}>
		<Row gutter={16} className={styles['main-cell']}>
			<Col span={6}><span>服务器端口</span></Col>
			<Col span={12}>
				<InputNumber
					ref={inputRef}
					placeholder="请输入服务器端口"
					defaultValue={2000}
				/>
				<Button type="primary" onClick={() => {
					onClick(inputRef.current.getInputDisplayValue())
				}}>{status ? '关闭' : '打开'}</Button>
			</Col>
			<Col span={6}>
				<Button onClick={clear}>清除日志</Button>
			</Col>
		</Row>
		<div className={styles.exp}><Button>导入标签</Button></div>
		<div style={{ marginTop: '10px' }}>
			<Form onFinish={onFinish} initialValues={{ ids: [] }}>
				<Form.Item label="控制盒ID" name="ids">
					<Input.TextArea />
				</Form.Item>
			</Form>
		</div>
	</div>
}

export default MainView

