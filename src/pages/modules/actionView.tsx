import React from 'react'
import { Tabs } from 'antd'
import { APSetting, APUpgrade, MACSetting } from './actions'

interface ActionViewProps {
	socket?: any;
}
const TabMenus: any = {
	// 'ED升级': EDUpgrade,
	'AP设置': APSetting,
	'AP升级': APUpgrade,
	'MAC设置': MACSetting
}


const ActionView: React.FC<ActionViewProps> = props => {
	const { socket } = props

	return <div>
		<Tabs defaultActiveKey="0">
			{Object.keys(TabMenus).map((o: string, index: number) => {
				const Com = TabMenus[o]
				return (
					<Tabs.TabPane tab={o} key={index}>
						<Com socket={socket} />
					</Tabs.TabPane>
				)
			})}
		</Tabs>
	</div>
}

export default ActionView