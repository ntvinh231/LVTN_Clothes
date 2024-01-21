import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import * as Message from '../../components/Message/Message';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as VoucherService from '../../service/VoucherService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { convertPrice } from '../../util';

const VoucherProduct = () => {
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isModalOpen, setIsModelOpen] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const searchInput = useRef(null);
	const inittial = () => ({
		voucherCode: '',
		totalAmount: 0,
		discountAmount: 0,
	});
	const [stateVoucher, setStateVoucher] = useState(inittial());

	const [stateVoucherDetails, setStateVoucherDetails] = useState(inittial());

	//Form
	const [form] = Form.useForm();
	const mutationVoucher = useMutation({
		mutationFn: (data) => {
			const res = VoucherService.createVoucher(data);
			return res;
		},
	});

	const { data, isLoading: isLoadingCreate, isSuccess, isError } = mutationVoucher;

	const fetchAllVoucher = async () => {
		const res = await VoucherService.getVoucher();
		return res;
	};
	const queryVoucher = useQuery(['vouchers'], fetchAllVoucher);
	const { isLoading, data: vouchers } = queryVoucher;

	//Delete
	const mutationDeleteVoucher = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await VoucherService.deleteVoucher(id);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDelete, isLoading: isLoadingDelete } = mutationDeleteVoucher;

	useEffect(() => {
		if (dataDelete?.statusMessage === 'success') {
			Message.success('Xóa thành công');
			handleCancelDelete();
		} else if (dataDelete?.statusMessage === 'failed' || dataDelete?.statusCode === 400) {
			Message.error(dataDelete?.message);
		}
	}, [dataDelete?.statusMessage, dataDelete?.message, dataDelete?.statusCode]);

	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};
	const handleDeleteVoucher = () => {
		mutationDeleteVoucher.mutate(rowSelected, {
			onSettled: () => {
				queryVoucher.refetch();
			},
		});
	};

	const mutationUpdateVoucher = useMutation({
		mutationFn: async (data) => {
			try {
				const { discountAmount, totalAmount, voucherCode } = data;
				const res = await VoucherService.updateVoucher(data.id, {
					discountAmount,
					totalAmount,
					voucherCode,
				});
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = mutationUpdateVoucher;

	//Update
	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};

	const fetchDetailsVoucher = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await VoucherService.getVoucherByAdmin(rowSelected);
		if (res?.data) {
			setStateVoucherDetails(res?.data);
		}
		setIsLoadingDetails(false);
	};

	const onFinishUpdate = () => {
		mutationUpdateVoucher.mutate(
			{ id: rowSelected, ...stateVoucherDetails },
			{
				onSettled: () => {
					queryVoucher.refetch();
				},
			}
		);
	};

	useEffect(() => {
		if (!isModalOpen) {
			form.setFieldsValue(stateVoucherDetails);
		} else {
			form.setFieldsValue(inittial());
		}
	}, [form, stateVoucherDetails, isModalOpen]);

	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsVoucher(rowSelected);
		}
	}, [rowSelected]);

	useEffect(() => {
		if (dataUpdate?.statusMessage === 'success') {
			Message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusCode === 400 || dataUpdate?.statusMessage === 'failed') {
			Message.error(dataUpdate?.message);
		}
	}, [dataUpdate?.statusMessage]);

	const handleDetailsVoucher = () => {
		setIsDrawerOpen(true);
	};
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsVoucher} />
			</div>
		);
	};

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
					placeholder={`Search color`}
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
			title: 'Voucher Code',
			dataIndex: 'voucherCode',
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps('color'),
			sorter: (a, b) => a.color.length - b.color.length,
		},
		{
			title: 'Giảm giá',
			dataIndex: 'discountAmount',
			sorter: (a, b) => a.quantity - b.quantity,
			filters: [
				{
					text: '>= 10',
					value: '>=',
				},
				{
					text: '<= 10',
					value: '<=',
				},
			],
			render: (text) => convertPrice(text),
			onFilter: (value, record) => {
				if (value === '>=') {
					return record.quantity >= 10;
				}
				return record.quantity <= 10;
			},
		},
		{
			title: 'Tổng giá trị đơn',
			dataIndex: 'totalAmount',
			sorter: (a, b) => a.quantity - b.quantity,
			filters: [
				{
					text: '>= 10',
					value: '>=',
				},
				{
					text: '<= 10',
					value: '<=',
				},
			],
			onFilter: (value, record) => {
				if (value === '>=') {
					return record.quantity >= 10;
				}
				return record.quantity <= 10;
			},
			render: (text) => convertPrice(text),
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction,
		},
	];

	const dataTable =
		vouchers?.data?.length &&
		vouchers?.data?.map((voucher) => {
			return {
				key: voucher._id,
				...voucher,
			};
		});

	console.log(data?.statusMessage);
	useEffect(() => {
		if (data?.statusMessage === 'success') {
			Message.success('Thêm thành công');
			handleCancel();
		} else if (data?.statusCode === 400 || data?.statusMessage === 'failed') {
			Message.error(data?.message);
		}
	}, [data?.statusMessage]);

	const handleOnChange = (e) => {
		setStateVoucher({
			...stateVoucher,
			[e.target.name]: e.target.value,
		});
	};

	const handleOnChangeDetails = (e) => {
		setStateVoucherDetails({
			...stateVoucherDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleCancel = () => {
		form.resetFields();
		setStateVoucher(inittial());
		setIsModelOpen(false);
	};

	const onFinish = () => {
		mutationVoucher.mutate(stateVoucher, {
			onSettled: () => {
				queryVoucher.refetch();
			},
		});
		setStateVoucher({
			...stateVoucher,
		});
	};

	//Delete-many
	const mutationDeleteManyVoucher = useMutation({
		mutationFn: async (ids) => {
			try {
				const res = await VoucherService.deleteManyVoucher(ids);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDeleteMany, isLoading: isLoadingDeleteManyVoucher } = mutationDeleteManyVoucher;

	const handleDeleteMany = (ids) => {
		mutationDeleteManyVoucher.mutate(
			{ ids },
			{
				onSettled: () => {
					queryVoucher.refetch();
				},
			}
		);
	};
	useEffect(() => {
		if (dataDeleteMany?.statusMessage === 'success') {
			Message.success('Xóa thành công');
		} else if (dataDeleteMany?.statusMessage === 'failed' || dataDeleteMany?.statusCode === 400) {
			Message.error(dataDeleteMany?.message);
		}
	}, [dataDeleteMany?.statusMessage]);
	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý mã giảm giá</WrapperHeader>
			<div style={{ marginTop: '10px' }}>
				<Button
					style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
					onClick={() => setIsModelOpen(true)}
				>
					<PlusOutlined style={{ fontSize: '60px' }}></PlusOutlined>
				</Button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<TableComponent
					handleDeleteMany={handleDeleteMany}
					isLoadingDeleteMany={isLoadingDeleteManyVoucher}
					dataTable={dataTable}
					columns={columns}
					isLoading={isLoadingDelete || isLoadingUpdate || isLoadingCreate || isLoading}
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								setRowSelected(record._id);
							},
						};
					}}
				></TableComponent>
			</div>
			<Loading isLoading={isLoadingCreate}>
				<Modal title="Tạo mã giảm giá" open={isModalOpen} onCancel={handleCancel} footer={null}>
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 14,
						}}
						style={{
							maxWidth: 600,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinish}
						autoComplete="off"
					>
						<Form.Item
							label="Mã giảm giá"
							name="voucherCode"
							rules={[
								{
									required: true,
									message: 'Please input voucher code!',
								},
								{
									pattern: /^[a-zA-Z0-9]+$/,
									message: 'Mã giảm giá chỉ được chứa chữ cái từ A-Z và số.',
								},
							]}
						>
							<InputComponent value={stateVoucher.voucherCode} onChange={handleOnChange} name="voucherCode" />
						</Form.Item>
						<Form.Item
							label="Số tiền giảm giá"
							name="discountAmount"
							rules={[
								{
									required: true,
									message: 'Please input discount amount!',
								},
								{
									pattern: /^\d+$/,
									message: 'Số tiền giảm giá chỉ phép nhập số.',
								},
							]}
						>
							<InputComponent value={stateVoucher.discountAmount} onChange={handleOnChange} name="discountAmount" />
						</Form.Item>
						<Form.Item
							label="Tổng tiền đơn hàng"
							name="totalAmount"
							rules={[
								{
									required: true,
									message: 'Please input total amount!',
								},
								{
									pattern: /^\d+$/,
									message: 'Số tiền tổng đơn chỉ được phép nhập số.',
								},
							]}
						>
							<InputComponent value={stateVoucher.totalAmount} onChange={handleOnChange} name="totalAmount" />
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</Loading>
			<DrawerComponent
				title="Chi tiết giảm giá"
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				width="30%"
			>
				<Loading isLoading={isLoadingDetails}>
					<Form
						name="VoucherProduct"
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 14,
						}}
						style={{
							maxWidth: 600,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinishUpdate}
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="Mã giảm giá"
							name="voucherCode"
							rules={[
								{
									required: true,
									message: 'Please input voucher code!',
								},
								{
									pattern: /^[a-zA-Z0-9]+$/,
									message: 'Mã giảm giá chỉ được chứa chữ cái từ A-Z và số.',
								},
							]}
						>
							<InputComponent
								value={stateVoucherDetails.voucherCode}
								onChange={handleOnChangeDetails}
								name="voucherCode"
							/>
						</Form.Item>
						<Form.Item
							label="Số tiền giảm giá"
							name="discountAmount"
							rules={[
								{
									required: true,
									message: 'Please input discount amount!',
								},
								{
									pattern: /^\d+$/,
									message: 'Số tiền giảm giá chỉ phép nhập số.',
								},
							]}
						>
							<InputComponent
								value={stateVoucherDetails.discountAmount}
								onChange={handleOnChangeDetails}
								name="discountAmount"
							/>
						</Form.Item>
						<Form.Item
							label="Tổng tiền đơn hàng"
							name="totalAmount"
							rules={[
								{
									required: true,
									message: 'Please input total amount!',
								},
								{
									pattern: /^\d+$/,
									message: 'Số tiền tổng đơn chỉ được phép nhập số.',
								},
							]}
						>
							<InputComponent
								value={stateVoucherDetails.totalAmount}
								onChange={handleOnChangeDetails}
								name="totalAmount"
							/>
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 12, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponent>
			<ModalComponent
				style={{ textAlign: 'center' }}
				title="Xóa giảm giá"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteVoucher}
			>
				<Loading isLoading={isLoadingDelete}>
					<div>Bạn có chắc xóa mã giảm giá này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default VoucherProduct;
