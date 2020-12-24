import React from 'react'
import { Tabs } from 'antd'
import { Graphics, APSetting, APUpgrade, MACSetting, EDUpgrade } from './actions'

interface ActionViewProps {

}

const ActionView: React.FC<ActionViewProps> = props => {

	const callback = (val: any) => {
		console.log(val)
	}
	return <div>
		<Tabs defaultActiveKey="1" onChange={callback}>
			<Tabs.TabPane tab="图形操作" key="1">
				<Graphics />
			</Tabs.TabPane>
			<Tabs.TabPane tab="ED升级" key="2">
				<EDUpgrade />
			</Tabs.TabPane>
			<Tabs.TabPane tab="AP设置" key="3">
				<APSetting />
			</Tabs.TabPane>
			<Tabs.TabPane tab="AP升级" key="4">
				<APUpgrade />
			</Tabs.TabPane>
			<Tabs.TabPane tab="MAC设置" key="5">
				<MACSetting />
			</Tabs.TabPane>
		</Tabs>
	</div>
}

export default ActionView