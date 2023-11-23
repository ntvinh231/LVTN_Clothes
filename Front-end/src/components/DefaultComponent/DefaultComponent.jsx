import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import MenuBarComponent from '../MenuBarComponent/MenuBarComponent';
const DefaultComponent = ({ children }) => {
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<MenuBarComponent></MenuBarComponent>
			{children}
		</div>
	);
};

export default DefaultComponent;
