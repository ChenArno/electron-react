import React from 'react'
import BasicLayouts from '@/Layouts/BasicLayouts'

interface MainProps { }

const Main: React.FC<MainProps> = props => {
	return <BasicLayouts>
		<div>main</div>
	</BasicLayouts>
}

export default Main