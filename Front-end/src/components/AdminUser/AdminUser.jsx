import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import { Button, Form, Select, Spin, message, Space } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import * as UserService from '../../service/UserService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { getBase64 } from '../../util';
import { useSelector } from 'react-redux';

const AdminUser = () => {
	const dataRole = ['user', 'admin'];

	const currentUser = useSelector((state) => state.user);
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const searchInput = useRef(null);
	const [stateUserDetails, setStateUserDetails] = useState({
		name: '',
		email: '',
		role: '',
		avatar: '',
		address: '',
		phone: '',
	});

	//Form
	const [form] = Form.useForm();

	const handleOnChangeDetails = (e) => {
		setStateUserDetails({
			...stateUserDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};

	const handleDeleteUser = () => {
		mutationDeleteUser.mutate(rowSelected, {
			onSettled: () => {
				queryUser.refetch();
			},
		});
	};

	//Update
	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};

	const handleOnChangeDetailsAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (file && !file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateUserDetails({
			...stateUserDetails,
			avatar: file ? file.preview : null,
		});
	};

	//GetAllUser
	const fetchAllUser = async () => {
		const res = await UserService.getAllUser();

		return res;
	};
	const queryUser = useQuery(['users'], fetchAllUser);
	const { isLoading, data: users } = queryUser;

	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const fetchDetailsUser = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await UserService.getDetailsUser(rowSelected);
		if (res?.data) {
			setStateUserDetails({
				name: res?.data?.name,
				email: res?.data?.email,
				role: res?.data?.role,
				address: res?.data?.address,
				phone: res?.data?.phone,
				avatar: res?.data?.avatar,
			});
		}
		setIsLoadingDetails(false);
	};

	//DataRole ['user','admin']
	const OPTIONS = dataRole
		? dataRole.map((item) => ({
				value: item,
				label: item,
		  }))
		: [];

	const onChange = (value) => {
		setStateUserDetails({
			...stateUserDetails,
			role: value,
		});
	};

	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	useEffect(() => {
		form.setFieldsValue(stateUserDetails);
	}, [form, stateUserDetails]);
	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsUser(rowSelected);
		}
	}, [rowSelected]);

	const handleDetailsUser = () => {
		setIsDrawerOpen(true);
	};
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsUser} />
			</div>
		);
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<InputComponent
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: 'block',
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters, selectedKeys, dataIndex, confirm)}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					fontSize: '16px',
					color: filtered ? '#1677ff' : undefined,
				}}
			/>
		),
		onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps('name'),
			sorter: (a, b) => a.name.length - b.name.length,
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Role',
			dataIndex: 'role',
			filters: [
				{
					text: 'admin',
					value: 'admin',
				},
				{
					text: 'user',
					value: 'user',
				},
			],
			onFilter: (value, record) => {
				if (value === 'admin') {
					return record.role === 'admin';
				}
				return record.role === 'user';
			},
		},
		{
			title: 'Address',
			dataIndex: 'address',
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
		users?.data
			?.filter((user) => user._id !== currentUser.id)
			.map((user) => ({
				key: user._id,
				...user,
			}));

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
	};
	const handleReset = (clearFilters, selectedKeys, dataIndex, confirm) => {
		clearFilters();
		confirm();
	};

	//updateUser
	const mutationUpdateUser = useMutation({
		mutationFn: async (data) => {
			try {
				const res = await UserService.updateUserForAdmin(data.id, data);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	//Delete
	const mutationDeleteUser = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await UserService.deleteUser(id);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = mutationUpdateUser;
	const { data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete } = mutationDeleteUser;

	useEffect(() => {
		if (dataUpdate?.statusCode === 200 && dataUpdate?.statusMessage === 'success') {
			message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusCode === 400 || dataUpdate?.statusMessage === 'failed') {
			message.error(dataUpdate?.message);
		}
	}, [isSuccessUpdate, dataDelete?.statusMessage]);

	useEffect(() => {
		if (dataUpdate?.statusCode === 200 && dataDelete?.statusMessage === 'success') {
			message.success('Xóa thành công');
			handleCancelDelete();
		} else if (dataUpdate?.statusCode === 400 || dataUpdate?.statusMessage === 'failed') {
			message.error('Xóa thất bại');
		}
	}, [isSuccessDelete, dataDelete?.statusMessage]);

	const onFinishUpdate = () => {
		mutationUpdateUser.mutate(
			{ id: rowSelected, ...stateUserDetails },
			{
				onSettled: () => {
					queryUser.refetch();
				},
			}
		);
	};

	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý người dùng</WrapperHeader>
			<div style={{ marginTop: '20px' }}>
				<TableComponent
					dataTable={dataTable}
					columns={columns}
					isLoading={isLoading}
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								setRowSelected(record._id);
							},
						};
					}}
				></TableComponent>
			</div>
			<DrawerComponent
				title="Chi tiết người dùng"
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				width="30%"
			>
				<Loading isLoading={isLoadingDetails || isLoadingUpdate}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 21,
						}}
						style={{
							maxWidth: 600,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinishUpdate}
						autoComplete="on"
						form={form}
					>
						<Form.Item
							label="Name"
							name="name"
							rules={[
								{
									required: true,
									message: 'Please input Name!',
								},
							]}
						>
							<InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
						</Form.Item>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{
									required: true,
									message: 'Please input email!',
								},
							]}
						>
							<InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
						</Form.Item>

						<Form.Item
							label="Role"
							name="role"
							rules={[
								{
									required: true,
									message: 'Please select role!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a role"
								optionFilterProp="children"
								onChange={onChange}
								filterOption={filterOption}
								options={OPTIONS}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={dataRole && dataRole.length !== 0 ? <Spin size="large" /> : null}
							/>
						</Form.Item>
						<Form.Item
							label="Address"
							name="address"
							rules={[
								{
									required: true,
									message: 'Please input address!',
								},
							]}
						>
							<InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
						</Form.Item>
						<Form.Item
							label="Phone"
							name="phone"
							rules={[
								{
									required: true,
									message: 'Please input phone!',
								},
							]}
						>
							<InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
						</Form.Item>
						<Form.Item
							label="Avatar"
							name="avatar"
							rules={[
								{
									required: true,
									message: 'Please input your avatar!',
								},
							]}
						>
							<WrapperUploadFile
								fileList={stateUserDetails.avatar ? [{ uid: '-1', url: stateUserDetails.avatar }] : []}
								onChange={handleOnChangeDetailsAvatar}
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Select Avatar</Button>
								{stateUserDetails?.avatar && (
									<img
										src={stateUserDetails?.avatar}
										style={{
											height: '60px',
											width: '60px',
											borderRadius: '50%',
											objectFit: 'cover',
											marginLeft: '30px',
										}}
										alt="avatar"
									/>
								)}
							</WrapperUploadFile>
						</Form.Item>

						<Form.Item wrapperCol={{ offset: 4, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponent>
			<ModalComponent
				forceRender
				style={{ textAlign: 'center' }}
				title="Xóa người dùng"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteUser}
			>
				<Loading isLoading={isLoadingDelete}>
					<div>Bạn có chắc xóa người dùng này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default AdminUser;
