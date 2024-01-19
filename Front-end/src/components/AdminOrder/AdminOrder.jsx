import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import { EditOutlined } from '@ant-design/icons';
import { getOrderByAdmin, updateDetailsOrderByAdmin } from '../../service/OrderService';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as message from '../../components/Message/Message';
import { orderContant } from '../../contant';
import { convertPrice } from '../../util';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import PieChartComponent from '../PieChartComponent/PieChartComponent';
import BarChartComponent from '../BarChartComponent/BarChartComponent';
const AdminOrder = () => {
	const searchInput = useRef(null);
	const [rowSelected, setRowSelected] = useState('');
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isDelivered, setIsDeliverd] = useState(false);
	const [isPaid, setIsPaid] = useState(false);
	const OPTIONS1 = [
		{ value: 'TRUE', label: 'Đã giao hàng' },
		{ value: 'FALSE', label: 'Chưa giao hàng' },
	];
	const OPTIONS = [
		{ value: 'TRUE', label: 'Đã thanh toán' },
		{ value: 'FALSE', label: 'Chưa thanh toán' },
	];
	const [form] = Form.useForm();

	const getAllOrder = async () => {
		const res = await getOrderByAdmin();
		return res;
	};
	const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder });
	const { isLoading: isLoadingOrders, data: orders } = queryOrder;

	const getAllOrderDetails = async (id) => {
		try {
			const res = await getOrderByAdmin(id);

			if (res?.data && res.data.length > 0) {
				return res.data[0];
			} else {
				throw new Error('No data or empty array in response');
			}
		} catch (error) {
			console.error('Error in getAllOrderDetails:', error);

			return null;
		}
	};

	const queryOrderDetails = useQuery({ queryKey: ['orders-details'], queryFn: getAllOrderDetails });
	const { isLoading: isLoadingOrdersDetails, data: ordersDetails } = queryOrderDetails;

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
	};
	const handleReset = (clearFilters, selectedKeys, dataIndex, confirm) => {
		clearFilters();
		confirm();
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

	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsProduct} />
			</div>
		);
	};
	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	const columns = [
		{
			title: 'User name',
			dataIndex: 'userName',
			width: 160,
			sorter: (a, b) => a.userName.length - b.userName.length,
			...getColumnSearchProps('userName'),
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			sorter: (a, b) => a.phone.length - b.phone.length,
			...getColumnSearchProps('phone'),
		},
		{
			title: 'Address',
			dataIndex: 'address',
			sorter: (a, b) => a.address.length - b.address.length,
			...getColumnSearchProps('address'),
		},
		{
			title: 'Paided',
			dataIndex: 'isPaid',
			width: 100,
			sorter: (a, b) => a.isPaid.length - b.isPaid.length,
			filters: [
				{
					text: 'Đã thanh toán',
					value: 'TRUE',
				},
				{
					text: 'Chưa thanh toán',
					value: 'FALSE',
				},
			],
			onFilter: (value, record) => {
				if (record.isPaid === value) return record;
			},
		},
		{
			title: 'Shipped',
			dataIndex: 'isDelivered',
			width: 100,
			sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
			filters: [
				{
					text: 'Đã giao hàng',
					value: 'TRUE',
				},
				{
					text: 'Chưa giao hàng',
					value: 'FALSE',
				},
			],
			onFilter: (value, record) => {
				if (record.isDelivered === value) return record;
			},
		},
		{
			title: 'Payment method',
			dataIndex: 'paymentMethod',
			width: 200,
			sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
			...getColumnSearchProps('paymentMethod'),
		},
		{
			title: 'Total price',
			dataIndex: 'totalPrice',
			sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
			...getColumnSearchProps('totalPrice'),
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction,
		},
	];

	const handleDetailsProduct = () => {
		setIsDrawerOpen(true);
	};

	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};

	const mutationUpdate = useMutation({
		mutationFn: async (data) => {
			try {
				const res = updateDetailsOrderByAdmin(data.rowSelected, data.isDelivered, data.isPaid);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	const { data: dataUpdate, isLoading: isLoadingUpdate } = mutationUpdate;

	const onFinish = () => {
		mutationUpdate.mutate(
			{
				rowSelected,
				isDelivered,
				isPaid,
			},
			{
				onSettled: () => {
					queryOrder.refetch();
				},
			}
		);
	};

	const onChange = (value) => {
		setIsDeliverd(value === 'TRUE');
	};

	const onChange1 = (value) => {
		setIsPaid(value === 'TRUE');
	};

	useEffect(() => {
		if (dataUpdate?.statusCode === 200 || dataUpdate?.statusMessage === 'success') {
			message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusMessage === 'failed') {
			message.error(dataUpdate?.message);
		}
	}, [dataUpdate?.statusCode, dataUpdate?.statusMessage]);

	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			getAllOrderDetails(rowSelected)
				.then((res) => {
					setIsDeliverd(res?.isDelivered);
					setIsPaid(res?.isPaid);
					return res;
				})
				.finally(() => {
					setIsLoadingDetails(false);
				});
		}
	}, [rowSelected]);

	useEffect(() => {
		form.setFieldsValue({ isDelivered: isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng' });
	}, [form, isDelivered]);
	useEffect(() => {
		form.setFieldsValue({ isPaid: isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' });
	}, [form, isPaid]);
	const dataTable =
		orders?.data?.length &&
		orders?.data?.map((order) => {
			return {
				...order,
				key: order._id,
				userName: order?.shippingAddress?.fullName,
				phone: order?.shippingAddress?.phone,
				address: order?.shippingAddress?.address,
				paymentMethod: orderContant.payment[order?.paymentMethod],
				isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
				isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
				totalPrice: convertPrice(order?.totalPrice),
			};
		});

	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý đơn hàng</WrapperHeader>
			<div style={{ display: 'flex' }}>
				<div style={{ height: 200, width: 200 }}>
					<PieChartComponent data={orders?.data} />
				</div>
				<div style={{ height: 220, width: 500 }}>
					<BarChartComponent data={orders?.data} />
				</div>
			</div>
			<div style={{ marginTop: '20px' }}>
				<TableComponent
					columns={columns}
					isLoading={isLoadingOrders}
					dataTable={dataTable}
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								setRowSelected(record._id);
							},
						};
					}}
				/>
			</div>
			<DrawerComponent title="Chi tiết đơn hàng" isOpen={isDrawerOpen} onClose={handleCancelDrawer} width="30%">
				<Loading isLoading={isLoadingUpdate || isLoadingDetails}>
					<Form
						name="AdminOrder"
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 15,
						}}
						style={{
							maxWidth: 660,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinish}
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="Trạng thái thanh toán"
							name="isPaid"
							rules={[
								{
									required: true,
									message: 'Please input Paid!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Chọn trạng thái thanh toán"
								optionFilterProp="children"
								onChange={onChange1}
								filterOption={filterOption}
								options={OPTIONS}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
							/>
						</Form.Item>
						<Form.Item
							label="Trạng thái giao hàng"
							name="isDelivered"
							rules={[
								{
									required: true,
									message: 'Please input shipped!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Chọn trạng thái giao hàng"
								optionFilterProp="children"
								onChange={onChange}
								filterOption={filterOption}
								options={OPTIONS1}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
							/>
						</Form.Item>

						<Form.Item wrapperCol={{ offset: 4, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponent>
		</div>
	);
};

export default AdminOrder;
