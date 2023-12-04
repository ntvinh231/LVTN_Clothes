import React from 'react';
import { WrapperHeader } from './style';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import * as UserService from '../../service/UserService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
const AdminUser = () => {
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} />
			</div>
		);
	};
	const fetchAllUser = async () => {
		const res = await UserService.getAllUser();
		return res;
	};
	const { isLoading, data: users } = useQuery(['users'], fetchAllUser, {
		retry: 3,
		retryDelay: 1000,
	});
	console.log(users);
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Role',
			dataIndex: 'role',
		},
		{
			title: 'Address',
			dataIndex: 'address',
		},
		{
			title: 'Avatar',
			dataIndex: 'A',
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction,
		},
	];

	const dataTable =
		users?.data?.length &&
		users?.data?.map((user) => {
			return {
				key: user._id,
				...user,
			};
		});
	console.log(dataTable);

	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý người dùng</WrapperHeader>
			<div style={{ marginTop: '10px' }}>
				<Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}>
					<PlusOutlined style={{ fontSize: '60px' }}></PlusOutlined>
				</Button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<TableComponent dataTable={dataTable} columns={columns} isLoading={isLoading}></TableComponent>
			</div>
		</div>
	);
};

export default AdminUser;
