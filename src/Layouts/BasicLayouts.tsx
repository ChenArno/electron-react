import React, { useEffect, useState } from 'react'
import { Layout } from 'antd';
import Header from '@/pages/header'
import styles from './index.module.less'

interface BasicLayoutsProps {
	onConnect: (val: any) => void;
	onClose?: () => void;
	onClear?: () => void;
	socket?: any;
}

const BasicLayouts: React.FC<BasicLayoutsProps> = props => {
	const { children, socket = null } = props
	const [status, setStatus] = useState(false)
	useEffect(() => {
		setStatus(socket !== null)
	}, [socket])

	return <Layout className={styles.lay}>
		<Header {...props}></Header>
		<Layout>
			<Layout.Content >
				{children}
			</Layout.Content>
		</Layout>
		<div>服务器连接状态:{status ? '成功' : '失败'}</div>
	</Layout>
}

export default BasicLayouts