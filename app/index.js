import React from 'react'
import { render } from 'react-dom'
import { AppContainer} from 'react-hot-loader'//网页刷新
import Hello from './root.js'

// var react=require('react');
render(
	<AppContainer>
		<Hello />
	</AppContainer>,
	document.getElementById('root')
);

if(module.hot){
	module.hot.accept('./root',()=>{
		const NewHello=require('./root').default;
		render(
			<AppContainer>
				<NewHello />
			</AppContainer>,
			document.getElementById('root')
		);
	});
}