import React from 'react'
import BasicLayouts from '@/Layouts/BasicLayouts'
import { Row, Col } from 'antd'
import SendMsg from './modules/sendMsg'
import ReceiveRecord from './modules/receiveRecord'
import ActionView from './modules/actionView'

interface MainProps { }

const Main: React.FC<MainProps> = props => {
	return <BasicLayouts>
		<SendMsg />
		<Row style={{ height: 'calc(100% - 168px)' }}>
			<Col span={6}>
				<ReceiveRecord title='发送记录' />
			</Col>
			<Col span={6}>
				<ReceiveRecord title='接收记录' />
			</Col>
			<Col span={12}>
				<ActionView />
			</Col>
		</Row>
	</BasicLayouts>
}

export default Main