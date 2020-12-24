import React from 'react'
import { Form, Button, Input, Divider, Row, Col } from 'antd'
import styles from './index.module.less'

interface SendMsgProps {

}

const SendMsg: React.FC<SendMsgProps> = props => {

	const [form] = Form.useForm()

	const onFinish = (val: any) => {
		console.log(val)
	}
	return <div>
		<Divider orientation="left">发送自定义数据</Divider>
		<Form form={form} className={styles.send} onFinish={onFinish}>
			<Row>
				<Col span={20}>
					<Form.Item noStyle>
						<Input.TextArea />
					</Form.Item>
				</Col>
				<Col span={1} />
				<Col span={3}>
					<Form.Item noStyle>
						<Button>发送</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	</div>
}

export default SendMsg