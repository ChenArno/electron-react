import React from 'react';
import { Layout, Button, Space } from 'antd'
import styles from './index.module.less'

const { ipcRenderer } = window.require(('electron'))

const { REACT_APP_VERSION } = process.env

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = props => {
	const onClick = () => {
		ipcRenderer.send('openCale')
	}

	return <Layout.Header className={styles.head}>
		<Space>
			<Button onClick={onClick}>连接</Button>
			<Button onClick={onClick}>断开连接</Button>
			<Button onClick={onClick}>图形通知</Button>
			<Button onClick={onClick}>发送测试</Button>
			<Button onClick={onClick}>清空记录</Button>
		</Space>
		<div>V{REACT_APP_VERSION}</div>
	</Layout.Header >
}

export default Header