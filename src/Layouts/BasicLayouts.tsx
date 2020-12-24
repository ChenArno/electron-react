import React from 'react'
import { Layout } from 'antd';
import Header from '@/pages/header'
import styles from './index.module.less'

interface BasicLayoutsProps { }

const BasicLayouts: React.FC<BasicLayoutsProps> = props => {
	const { children } = props
	return <Layout className={styles.lay}>
		<Header></Header>
		<Layout>
			<Layout.Content style={{ overflowY: 'auto' }}>
				{children}
			</Layout.Content>
		</Layout>
		<div>服务器连接状态</div>
	</Layout>
}

export default BasicLayouts