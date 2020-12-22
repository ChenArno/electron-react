import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Main from '@/pages/main'
import ConfigView from '@/pages/configView'
import { createHashHistory } from 'history';

interface RoutersRrops { }

const Routes: React.FC<RoutersRrops> = props => {
	return <Router history={createHashHistory({ basename: '' })}>
		<Switch>
			<Route exact path="/index" component={Main}></Route>
			<Route exact path="/config" component={ConfigView}></Route>
			<Redirect from="/" to="/index" />
		</Switch>
	</Router>
}

export default Routes