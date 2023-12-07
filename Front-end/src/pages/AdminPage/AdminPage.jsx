import { Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getItem } from '../../util';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import MenuBarComponent from '../../components/MenuBarComponent/MenuBarComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import CollectionProduct from '../../components/CollectionProduct/CollectionProduct';

const AdminPage = () => {
	const AdminPageRef = useRef(null);
	const [marginTopAdminPage, setMarginTopAdminPage] = useState('');

	const items = [
		getItem('Quản lý người dùng', 'rootUser', <MailOutlined />, [getItem('Thông tin người dùng', 'user')]),
		getItem('Quản lý sản phẩm', 'rootProduct', <AppstoreOutlined />, [
			getItem('Thông tin sản phẩm', 'product'),
			getItem('Thông tin loại', 'productCollection'),
		]),
	];

	const [keySelected, setKeySelected] = useState('');

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
