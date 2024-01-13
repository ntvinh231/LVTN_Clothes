import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../service/ProductService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';

const ColorProduct = () => {
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isModalOpen, setIsModelOpen] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const searchInput = useRef(null);
	const inittial = () => ({
		color: '',
		quantity: '',
	});
	const [stateColors, setStateColors] = useState(inittial());

	const [stateColorsDetails, setStateColorsDetails] = useState(inittial());

	//Form
	const [form] = Form.useForm();
	const mutationColor = useMutation({
		mutationFn: (data) => {
			const res = ProductService.createColor({ color: data.color });
			return res;
		},
	});

	const { data, isLoading: isLoadingCreate, isSuccess, isError } = mutationColor;

	const fetchAllColor = async () => {
		const res = await ProductService.getAllColors();
		return res;
	};
	const queryColors = useQuery(['colors'], fetchAllColor);
	const { isLoading, data: colors } = queryColors;

	console.log(colors);
	//Delete
	const mutationDeleteColor = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await ProductService.deleteColor(id);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDelete, isLoading: isLoadingDelete } = mutationDeleteColor;

	useEffect(() => {
		if (dataDelete?.statusMessage === 'success') {
			message.success('Xóa thành công');
			handleCancelDelete();
		} else if (dataDelete?.statusMessage === 'failed' || dataDelete?.statusCode === 400) {
			message.error(dataDelete?.message);
		}
	}, [dataDelete?.statusMessage, dataDelete?.message, dataDelete?.statusCode]);

	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};
	const handleDeleteColor = () => {
		mutationDeleteColor.mutate(rowSelected, {
			onSettled: () => {
				queryColors.refetch();
			},
		});
	};

	const mutationUpdateColor = useMutation({
		mutationFn: async (data) => {
			try {
				const { color } = data;
				const res = await ProductService.updateColor(data.id, {
					color,
				});
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = mutationUpdateColor;

	//Update
	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};

	const fetchDetailsColor = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await ProductService.getAllColors(rowSelected);
		if (res?.data) {
			setStateColorsDetails({
				color: res.data[0].color,
			});
		}
		setIsLoadingDetails(false);
	};

	const onFinishUpdate = () => {
		mutationUpdateColor.mutate(
			{ id: rowSelected, ...stateColorsDetails },
			{
				onSettled: () => {
					queryColors.refetch();
				},
			}
		);
	};
	useEffect(() => {
		if (!isModalOpen) {
			form.setFieldsValue(stateColorsDetails);
		} else {
			form.setFieldsValue(inittial());
		}
	}, [form, stateColorsDetails, isModalOpen]);
	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsColor(rowSelected);
		}
	}, [rowSelected]);

	useEffect(() => {
		if (dataUpdate?.statusMessage === 'success') {
			message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusMessage === 'failed') {
			message.error(dataUpdate?.message);
		}
	}, [dataUpdate?.statusMessage]);

	const handleDetailsColors = () => {
		setIsDrawerOpen(true);
	};
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsColors} />
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
			title: 'Color',
			dataIndex: 'color',
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps('color'),
			sorter: (a, b) => a.color.length - b.color.length,
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
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
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction,
		},
	];

	const dataTable =
		colors?.data?.length &&
		colors?.data?.map((color) => {
			const totalQuantity = color?.list_product.reduce((sum, product) => sum + (product?.quantity || 0), 0);

			return {
				key: color._id,
				quantity: totalQuantity,
				...color,
			};
		});

	useEffect(() => {
		if (isSuccess && data?.statusMessage === 'success') {
			message.success('Thêm thành công');
			handleCancel();
		} else if (data?.statusCode === 400 || data?.statusMessage === 'failed') {
			message.error(data?.message);
		}
	}, [isSuccess, isError]);

	const handleOnChange = (e) => {
		setStateColors({
			...stateColors,
			[e.target.name]: e.target.value,
		});
	};

	const handleOnChangeDetails = (e) => {
		setStateColorsDetails({
			...stateColorsDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleCancel = () => {
		setIsModelOpen(false);
	};

	const onFinish = () => {
		mutationColor.mutate(stateColors, {
			onSettled: () => {
				queryColors.refetch();
			},
		});
		setStateColors({
			...stateColors,
		});
	};

	//Delete-many
	const mutationDeleteManyColor = useMutation({
		mutationFn: async (ids) => {
			try {
				const res = await ProductService.deleteManyColor(ids);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDeleteMany, isLoading: isLoadingDeleteMany } = mutationDeleteManyColor;
	const handleDeleteManyColor = (ids) => {
		mutationDeleteManyColor.mutate(
			{ ids },
			{
				onSettled: () => {
					queryColors.refetch();
				},
			}
		);
	};
	useEffect(() => {
		if (dataDeleteMany?.statusMessage === 'success') {
			message.success('Xóa thành công');
		} else if (dataDeleteMany?.statusMessage === 'failed' || dataDeleteMany?.statusCode === 400) {
			message.error(dataDeleteMany?.message);
		}
	}, [dataDeleteMany?.statusMessage]);
	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý màu sắc</WrapperHeader>
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
					handleDeleteMany={handleDeleteManyColor}
					isLoadingDeleteMany={isLoadingDeleteMany}
					dataTable={dataTable}
					columns={columns}
					isLoading={isLoadingCreate || isLoading}
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
				<Modal title="Tạo màu" open={isModalOpen} onCancel={handleCancel} footer={null}>
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
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
							label="Color"
							name="color"
							rules={[
								{
									required: true,
									message: 'Please input color!',
								},
								{
									pattern: /^[a-zA-Z\s]+$/,
									message: 'Màu chỉ được đặt chữ cái, không có ký tự đặc biệt.',
								},
							]}
						>
							<InputComponent value={stateColors.color} onChange={handleOnChange} name="color" />
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</Loading>
			<DrawerComponent title="Chi tiết màu" isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width="30%">
				<Loading isLoading={isLoadingDetails || isLoadingUpdate}>
					<Form
						name="ColorProduct"
						labelCol={{
							span: 8,
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
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="Color"
							name="color"
							rules={[
								{
									required: true,
									message: 'Please input Color Name!',
								},
								{
									pattern: /^[a-zA-Z\s]+$/,
									message: 'Color chỉ được đặt chữ hoặc số, không có kí tự',
								},
							]}
						>
							<InputComponent value={stateColorsDetails.color} onChange={handleOnChangeDetails} name="color" />
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
				style={{ textAlign: 'center' }}
				title="Xóa màu"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteColor}
			>
				<Loading isLoading={isLoadingDelete}>
					<div>Bạn có chắc xóa màu này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default ColorProduct;
