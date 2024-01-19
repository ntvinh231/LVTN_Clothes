import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import MenuBarComponent from '../MenuBarComponent/MenuBarComponent';
import BreadCrumbComponent from '../BreadCrumbComponent/BreadCrumbComponent';
import { useLocation } from 'react-router-dom';
import FooterComponent from '../FooterComponent/FooterComponent';

const DefaultComponent = ({ children }) => {
	// Sử dụng useLocation để lấy thông tin về địa chỉ hiện tại
	const location = useLocation();

	// Kiểm tra nếu địa chỉ hiện tại là '/'
	const isHomePage = location.pathname === '/';
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<MenuBarComponent></MenuBarComponent>
			{isHomePage ? null : <BreadCrumbComponent></BreadCrumbComponent>}
			{children}
		</div>
	);
};

export default DefaultComponent;
