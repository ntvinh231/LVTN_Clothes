import React, { useEffect, useState } from 'react';
import { WrapperMenuBar, WrapperTextMenuBar } from './style';
import logo from '../../assets/images/logo.png';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import TypeProduct from '../TypeProduct/TypeProduct';
const MenuBarComponent = () => {
	const [showMenuBar, setShowMenuBar] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);
	const navigate = useNavigate();
	const handleNavigateHome = () => {
		navigate('/');
	};
	useEffect(() => {
		const headerHeight = document.getElementById('header').offsetHeight;
		setHeaderHeight(headerHeight + 8);
		const handleScroll = () => {
			const scrollY = window.scrollY || window.pageYOffset;
			if (scrollY > 1) {
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
				<WrapperTextMenuBar span={6}>
					<TypeProduct name={'Sản Phẩm'} />
				</WrapperTextMenuBar>
				<WrapperTextMenuBar span={6}>Sale</WrapperTextMenuBar>
				<WrapperTextMenuBar span={6}>CONTACT</WrapperTextMenuBar>
			</WrapperMenuBar>
		</div>
	);
};

export default MenuBarComponent;
