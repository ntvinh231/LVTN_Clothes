import React, { useEffect, useState } from 'react';
import { WrapperNavbar } from './style';
import { Col } from 'antd';

const NavbarComponent = () => {
	const [showNavbar, setShowNavbar] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);
	useEffect(() => {
		const headerHeight = document.getElementById('header').offsetHeight;
		setHeaderHeight(headerHeight);
		const handleScroll = () => {
			const scrollY = window.scrollY || window.pageYOffset;

			if (scrollY > 62) {
				setShowNavbar(true);
			} else {
				setShowNavbar(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	return (
		<div>
			<WrapperNavbar
				id="navbar"
				style={{ top: showNavbar ? '0' : headerHeight, boxShadow: showNavbar ? '0 0 5px 1px rgba(0,0,0,0.4)' : ' ' }}
			>
				<Col span={6}>col-6</Col>
				<Col span={6}>Trang Chủ</Col>
				<Col span={6}>Sản phẩm</Col>
				<Col span={6}>Sale</Col>
			</WrapperNavbar>
		</div>
	);
};

export default NavbarComponent;
