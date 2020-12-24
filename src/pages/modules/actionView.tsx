import React from 'react'
import { Tabs } from 'antd'
import { APSetting, APUpgrade, MACSetting, EDUpgrade } from './actions'

interface ActionViewProps {

}
const TabMenus: any = {
	'ED升级': EDUpgrade,
	'AP设置': APSetting,
	'AP升级': APUpgrade,
	'MAC设置': MACSetting
}

const ActionView: React.FC<ActionViewProps> = props => {

	const callback = (val: any) => {
		console.log(val)
	}


	return <div>
		<Tabs defaultActiveKey="0" onChange={callback}>
			{Object.keys(TabMenus).map((o: string, index: number) => {
				const Com = TabMenus[o]
				return (
					<Tabs.TabPane tab={o} key={index}>
						<Com />
					</Tabs.TabPane>
				)
			})}
		</Tabs>
	</div>
}

export default ActionView