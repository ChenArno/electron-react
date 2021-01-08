import React from 'react'
import { Layout } from 'antd';
import styles from './index.module.less'

interface BasicLayoutsProps {
}

const BasicLayouts: React.FC<BasicLayoutsProps> = props => {
	const { children } = props

	return <Layout className={styles.lay}>
		<Layout>
			<Layout.Content >
				{children}
			</Layout.Content>
		</Layout>
	</Layout>
}

export default BasicLayouts