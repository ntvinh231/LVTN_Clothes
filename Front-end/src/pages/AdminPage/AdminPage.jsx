import { Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getItem } from '../../util';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import MenuBarComponent from '../../components/MenuBarComponent/MenuBarComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import CollectionProduct from '../../components/CollectionProduct/CollectionProduct';
import { useSelector } from 'react-redux';
import * as Message from '../../components/Message/Message';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminPage = () => {
	const AdminPageRef = useRef(null);
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [keySelected, setKeySelected] = useState('');
	console.log(keySelected);
	const permission = ['admin', 'superadmin'];
	// useEffect(() => {
	// 	if (keySelected) {
	// 		if (permission.includes(user?.role)) {
	// 			Message.error('Bạn không có quyền thực hiện hành động');
	// 			navigate('/');
	// 		}
	// 	}
	// }, [keySelected]);

	const items = [
		getItem('Quản lý người dùng', 'rootUser', <MailOutlined />, [getItem('Thông tin người dùng', 'user')]),
		getItem('Quản lý sản phẩm', 'rootProduct', <AppstoreOutlined />, [
			getItem('Thông tin sản phẩm', 'product'),
			getItem('Thông tin loại', 'productCollection'),
			getItem('Đơn hàng', 'productOrder'),
		]),
	];

	const renderPage = (key) => {
		switch (key) {
			case 'user':
				return <AdminUser></AdminUser>;
			case 'product':
				return <AdminProduct></AdminProduct>;
			case 'productCollection':
				return <CollectionProduct></CollectionProduct>;
			default:
				return <></>;
		}
	};

	const handleOnClick = ({ key }) => {
		setKeySelected(key);
	};

	return (
		<>
			<HeaderComponent isHiddentSearch isHiddenCart />
			<MenuBarComponent />
			<div ref={AdminPageRef} style={{ marginTop: '70px' }}>
				<div style={{ display: 'flex' }}>
					<Menu
						mode="inline"
						style={{
							width: 256,
							boxShadow: '1px 1px 2px #ccc',
							height: '100vh',
						}}
						items={items}
						onClick={handleOnClick}
					/>
					<div style={{ flex: '1', padding: '0px' }}>{renderPage(keySelected)}</div>
				</div>
			</div>
		</>
	);
};

export default AdminPage;
