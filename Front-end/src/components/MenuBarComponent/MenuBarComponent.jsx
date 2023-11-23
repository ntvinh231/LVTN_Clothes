import React, { useEffect, useState } from 'react';
import { WrapperMenuBar, WrapperTextMenuBar } from './style';
import logo from '../../assets/images/logo.png';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
const MenuBarComponent = () => {
	const [showMenuBar, setShowMenuBar] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);
	const navigate = useNavigate();
	const handleNavigateHome = () => {
		navigate('/');
	};
	useEffect(() => {
		const headerHeight = document.getElementById('header').offsetHeight;
		setHeaderHeight(headerHeight);
		const handleScroll = () => {
			const scrollY = window.scrollY || window.pageYOffset;

			if (scrollY > 62) {
				setShowMenuBar(true);
			} else {
				setShowMenuBar(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	return (
		<div>
			<WrapperMenuBar
				id="MenuBar"
				style={{ top: showMenuBar ? '0' : headerHeight, boxShadow: showMenuBar ? '0 0 5px 1px rgba(0,0,0,0.4)' : ' ' }}
			>
				<WrapperTextMenuBar onClick={handleNavigateHome} span={6}>
					<Image src={logo} alt="slider" preview={false} width="180px" height="20px" />
				</WrapperTextMenuBar>
				<WrapperTextMenuBar onClick={() => navigate('/type')} span={6}>
					Sản phẩm
				</WrapperTextMenuBar>
				<WrapperTextMenuBar span={6}>Sale</WrapperTextMenuBar>
				<WrapperTextMenuBar span={6}>AAAAAA</WrapperTextMenuBar>
			</WrapperMenuBar>
		</div>
	);
};

export default MenuBarComponent;
