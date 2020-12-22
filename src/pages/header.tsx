import React from 'react';
import { Layout, Button } from 'antd'
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
		<div>esl调式工具</div>
		<Button onClick={onClick}>打开新窗口</Button>
		<div>V{REACT_APP_VERSION}</div>
	</Layout.Header >
}

export default Header