import React from 'react'
import BasicLayouts from '@/Layouts/BasicLayouts'
import { connect } from 'react-redux'

interface MainProps {
}

const Main: React.FC<MainProps> = props => {

	return <BasicLayouts>
		主页
	</BasicLayouts>
}

export default connect(({ info }: any) => ({ sendCode: info.sendCode }))(Main)