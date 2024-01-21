import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import * as Message from '../../components/Message/Message';

import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../service/ProductService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';

const CollectionProduct = () => {
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isModalOpen, setIsModelOpen] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const searchInput = useRef(null);
	const inittial = () => ({
		collections_name: '',
		quantity: '',
	});
	const [stateCollection, setStateCollection] = useState(inittial());

	const [stateCollectionDetails, setStateCollectionDetails] = useState(inittial());

	//Form
	const [form] = Form.useForm();
	const mutationCollection = useMutation({
		mutationFn: (data) => {
			const res = ProductService.createCollection({ collections_name: data.collections_name });
			return res;
		},
	});

	const { data, isLoading: isLoadingCreate, isSuccess, isError } = mutationCollection;

	//GetAllCollections
	const fetchAllCollections = async () => {
		const res = await ProductService.getAllCollections();

		return res;
	};
	const queryCollections = useQuery(['collections'], fetchAllCollections);
	const { isLoading, data: collections } = queryCollections;

	//Delete
	const mutationDeleteCollection = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await ProductService.deleteCollection(id);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDelete, isLoading: isLoadingDelete } = mutationDeleteCollection;

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
	const handleDeleteCollection = () => {
		mutationDeleteCollection.mutate(rowSelected, {
			onSettled: () => {
				queryCollections.refetch();
			},
		});
	};

	//updateCollection
	const mutationUpdateCollection = useMutation({
		mutationFn: async (data) => {
			try {
				const { collections_name } = data;
				const res = await ProductService.updateCollection(data.id, {
					collections_name,
				});
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = mutationUpdateCollection;

	//Update
	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};

	const fetchDetailsCollection = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await ProductService.getAllCollections(rowSelected);
		if (res?.data) {
			setStateCollectionDetails({
				collections_name: res.data[0].collections_name,
			});
		}
		setIsLoadingDetails(false);
	};

	const onFinishUpdate = () => {
		mutationUpdateCollection.mutate(
			{ id: rowSelected, ...stateCollectionDetails },
			{
				onSettled: () => {
					queryCollections.refetch();
				},
			}
		);
	};
	useEffect(() => {
		if (!isModalOpen) {
			form.setFieldsValue(stateCollectionDetails);
		} else {
			form.setFieldsValue(inittial());
		}
	}, [form, stateCollectionDetails, isModalOpen]);
	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsCollection(rowSelected);
		}
	}, [rowSelected]);

	useEffect(() => {
		if (dataUpdate?.statusMessage === 'success') {
			Message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusMessage === 'failed') {
			Message.error(dataUpdate?.message);
		}
	}, [dataUpdate?.statusMessage]);

	const handleDetailsCollections = () => {
		setIsDrawerOpen(true);
	};
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsCollections} />
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
					placeholder={`Search collection name`}
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
			title: 'Collection Name',
			dataIndex: 'collections_name',
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps('collections_name'),
			sorter: (a, b) => a.collections_name.length - b.collections_name.length,
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
		collections?.data?.length &&
		collections?.data?.map((collection) => {
			const totalQuantity = collection?.list_product.reduce((sum, product) => sum + (product?.quantity || 0), 0);

			return {
				key: collection._id,
				quantity: totalQuantity,
				...collection,
			};
		});

	useEffect(() => {
		if (isSuccess && data?.statusMessage === 'success') {
			Message.success('Thêm thành công');
			handleCancel();
		} else if (data?.statusCode === 400 || data?.statusMessage === 'failed') {
			Message.error(data?.message);
		}
	}, [isSuccess, isError]);

	const handleOnChange = (e) => {
		setStateCollection({
			...stateCollection,
			[e.target.name]: e.target.value,
		});
	};

	const handleOnChangeDetails = (e) => {
		setStateCollectionDetails({
			...stateCollectionDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleCancel = () => {
		setIsModelOpen(false);
	};

	const onFinish = () => {
		mutationCollection.mutate(stateCollection, {
			onSettled: () => {
				queryCollections.refetch();
			},
		});
		setStateCollection({
			...stateCollection,
		});
	};

	//Delete-many
	const mutationDeleteManyCollection = useMutation({
		mutationFn: async (ids) => {
			try {
				const res = await ProductService.deleteManyCollection(ids);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data: dataDeleteMany, isLoading: isLoadingDeleteMany } = mutationDeleteManyCollection;
	const handleDeleteManyCollection = (ids) => {
		mutationDeleteManyCollection.mutate(
			{ ids },
			{
				onSettled: () => {
					queryCollections.refetch();
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
			<WrapperHeader>Quản lý loại</WrapperHeader>
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
					handleDeleteMany={handleDeleteManyCollection}
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
				<Modal title="Tạo loại sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
							label="Collection"
							name="collections_name"
							rules={[
								{
									required: true,
									message: 'Please input Collection!',
								},
								{
									pattern: /^[a-zA-Z0-9\s]+$/,
									message: 'Collection chỉ được đặt chữ hoặc số, không có kí tự',
								},
							]}
						>
							<InputComponent value={stateCollection.collection} onChange={handleOnChange} name="collections_name" />
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</Loading>
			<DrawerComponent title="Chi tiết loại" isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width="30%">
				<Loading isLoading={isLoadingDetails || isLoadingUpdate}>
					<Form
						name="CollectionProduct"
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
							label="Collection Name"
							name="collections_name"
							rules={[
								{
									required: true,
									message: 'Please input Collection Name!',
								},
								{
									pattern: /^[a-zA-Z0-9\s]+$/,
									message: 'Collection chỉ được đặt chữ hoặc số, không có kí tự',
								},
							]}
						>
							<InputComponent
								value={stateCollectionDetails.collections_name}
								onChange={handleOnChangeDetails}
								name="collections_name"
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
			<ModalComponent
				style={{ textAlign: 'center' }}
				title="Xóa collection"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteCollection}
			>
				<Loading isLoading={isLoadingDelete}>
					<div>Bạn có chắc xóa Collection này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default CollectionProduct;
