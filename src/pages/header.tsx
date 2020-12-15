import React, { useState } from 'react';
import { Layout, Menu } from 'antd'
import store from '@/store'
import { MENUITEM } from '@/store/reducers/info'
import styles from './index.module.less'

const { REACT_APP_VERSION } = process.env

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = props => {
	const [current, setCurrent] = useState('contal')

	const handleClick = (e: any) => {
		setCurrent(e.key)
		store.dispatch({ type: MENUITEM, value: e.key })
	}
	return <Layout.Header className={styles.head}>
		<div>智能灯调式工具</div>
		<Menu style={{ lineHeight: '30px' }} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
			<Menu.Item key="contal" >
				控制
        </Menu.Item>
			<Menu.Item key="frequency" >
				频率
        </Menu.Item>
		</Menu>
		<div>V{REACT_APP_VERSION}</div>
	</Layout.Header >
}

export default Header