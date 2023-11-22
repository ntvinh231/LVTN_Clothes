import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
const DefaultComponent = ({ children }) => {
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<NavbarComponent></NavbarComponent>
			{children}
		</div>
	);
};

export default DefaultComponent;
