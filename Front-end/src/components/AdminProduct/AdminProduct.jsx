import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Select, Spin, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../service/ProductService';

import { getBase64 } from '../../util';
import { WrapperUploadFile } from './style';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';

const AdminProduct = () => {
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [stateProduct, setStateProduct] = useState({
		name: '',
		newName: '',
		price: '',
		size: '',
		description: '',
		quantity: '',
		image: '',
	});
	const [collections_id, setCollections_id] = useState('');
	const [stateProductDetails, setStateProductDetails] = useState({
		name: '',
		newName: '',
		price: '',
		size: '',
		description: '',
		quantity: '',
		image: '',
		collections_id: '',
	});
	//Form
	const [form] = Form.useForm();
	//Select
	const fetchCollectionProduct = async () => {
		const res = await ProductService.getCollectionProduct();
		return res;
	};
	const { isLoadingCollectionProduct, data: collectionProduct } = useQuery(
		['collectionProduct'],
		fetchCollectionProduct,
		{
			retry: 3,
			retryDelay: 500,
		}
	);
	const dataCollection = collectionProduct?.data;
	const OPTIONS = Array.isArray(dataCollection)
		? dataCollection.map((item) => ({
				value: item._id,
				label: item.collections_name,
		  }))
		: [];
	const handleSelectChange = (value) => {
		setStateProduct({
			...stateProduct,
			name: value,
		});
	};

	const onChange = (value) => {
		setCollections_id(value);
	};

	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	const mutationProduct = useMutation({
		mutationFn: async (data) => {
			try {
				const { name, price, size, description, quantity, image, collections_id } = data;
				const res = await ProductService.createProduct({
					name: name,
					price: price,
					size: size,
					description: description,
					quantity: quantity,
					image: image,
					collections_id: collections_id,
				});

				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});
	const { data, isLoading: isLoadingCreate } = mutationProduct;

	useEffect(() => {
		if (data?.statusMessage === 'success' && data?.statusCode === 200) {
			message.success('Thêm thành công');
			handleCancel();
		} else if (data?.data && data?.data?.statusCode === 400) {
			message.error(data?.data?.message);
		}
	}, [data?.statusCode, data?.data?.statusCode]);

	const handleOnChange = (e) => {
		setStateProduct({
			...stateProduct,
			[e.target.name]: e.target.value,
		});
	};
	const handleOnChangeDetails = (e) => {
		setStateProductDetails({
			...stateProductDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};

	const handleDeleteProduct = () => {
		mutationDeleteProduct.mutate(rowSelected, {
			onSettled: () => {
				queryProduct.refetch();
			},
		});
	};

	const handleDeleteManyProduct = (ids) => {
		mutationDeleteManyProduct.mutate(
			{ ids },
			{
				onSettled: () => {
					queryProduct.refetch();
				},
			}
		);
	};

	//Create
	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
		setStateProduct({
			name: '',
			newName: '',
			price: '',
			size: '',
			description: '',
			quantity: '',
			image: '',
		}); // Reset state values
	};

	//Update
	const handleCancelDrawer = () => {
		setIsDrawerOpen(false);
	};
	const onFinish = () => {
		const configData = {
			name: stateProduct.name === 'add_name' ? stateProduct.newName : stateProduct.name,
			price: stateProduct.price,
			size: stateProduct.size,
			description: stateProduct.description,
			quantity: stateProduct.quantity,
			image: stateProduct.image,
			collections_id: collections_id,
		};
		console.log('configData', configData);

		mutationProduct.mutate(configData, {
			onSettled: () => {
				queryProduct.refetch();
			},
		});
		setStateProduct({
			...stateProduct,
			image: '',
		});
	};

	const handleOnchangeAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (file && !file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProduct({
			...stateProduct,
			image: file ? file.preview : null,
		});
	};
	const handleOnChangeDetailsAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (file && !file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProductDetails({
			...stateProductDetails,
			image: file ? file.preview : null,
		});
	};

	//GetAllProduct
	const fetchAllProduct = async () => {
		const res = await ProductService.getProduct();
		return res;
	};
	const queryProduct = useQuery(['products'], fetchAllProduct);
	const { isLoading, data: products } = queryProduct;
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const fetchDetailsProduct = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await ProductService.getProduct(rowSelected);
		const resCollectionSelect = await ProductService.getCollectionProduct(res?.data[0]?.collections_id);
		setCollections_id(res?.data[0]?.collections_id);
		if (res?.data) {
			setStateProductDetails({
				name: res?.data[0]?.name,
				price: res?.data[0]?.price,
				size: res?.data[0]?.size,
				description: res?.data[0]?.description,
				quantity: res?.data[0]?.quantity,
				image: res?.data[0]?.image,
				collections_name: resCollectionSelect.data[0]?.collections_name,
			});
		}
		setIsLoadingDetails(false);
	};

	console.log(products?.data);
	const OPTIONSName = Array.isArray(products?.data)
		? [...new Set(products?.data.map((item) => item.name))].map((name) => ({
				value: name,
				label: name,
		  }))
		: [];
	useEffect(() => {
		form.setFieldsValue(stateProductDetails);
	}, [form, stateProductDetails]);
	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsProduct(rowSelected);
		}
	}, [rowSelected]);

	const handleDetailsProduct = () => {
		setIsDrawerOpen(true);
	};
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={handleDetailsProduct} />
			</div>
		);
	};
	//Chuyển collection.value thành key
	const collectionMap = OPTIONS.reduce((acc, collection) => {
		acc[collection.value] = collection.label;
		return acc;
	}, {});
	// Cập nhật dữ liệu products với collection name thành vì collections_id
	const updatedProducts = Array.isArray(products?.data)
		? products.data.map((product) => ({
				...product,
				collections_name: collectionMap[product.collections_id],
		  }))
		: [];

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

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps('name'),
			sorter: (a, b) => a.name.length - b.name.length,
		},
		{
			title: 'Collection',
			dataIndex: 'collections_name',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			sorter: (a, b) => a.price - b.price,
		},
		{
			title: 'Size',
			dataIndex: 'size',
			filters: [
				{
					text: 'S',
					value: 'S',
				},
				{
					text: 'L',
					value: 'L',
				},
				{
					text: 'X',
					value: 'X',
				},
				{
					text: 'XL',
					value: 'XL',
				},
			],
		},
		{
			title: 'Description',
			dataIndex: 'description',
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
		updatedProducts?.length &&
		updatedProducts.map((product) => {
			return {
				key: product._id,
				...product,
			};
		});

	//updateProduct
	const mutationUpdateProduct = useMutation({
		mutationFn: async (data) => {
			try {
				const { name, price, size, description, quantity, image, collections_id } = data.configData;
				const res = await ProductService.updateProduct(data.id, {
					name: name,
					price: price,
					size: size,
					description: description,
					quantity: quantity,
					image: image,
					collections_id: collections_id,
				});
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	//Delete
	const mutationDeleteProduct = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await ProductService.deleteProduct(id);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	//Delete-many
	const mutationDeleteManyProduct = useMutation({
		mutationFn: async (ids) => {
			try {
				const res = await ProductService.deleteManyProduct(ids);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = mutationUpdateProduct;
	const { data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete } = mutationDeleteProduct;
	const { data: dataDeleteMany, isLoading: isLoadingDeleteMany } = mutationDeleteManyProduct;

	useEffect(() => {
		if (dataDeleteMany?.statusMessage === 'success') {
			message.success('Xóa thành công');
		} else if (dataDeleteMany?.statusMessage === 'failed' || dataDeleteMany?.statusCode === 400) {
			message.error(dataDeleteMany?.message);
		}
	}, [dataDeleteMany?.statusMessage]);
	useEffect(() => {
		if (dataUpdate?.statusMessage === 'success') {
			message.success('Cập nhật thành công');
			handleCancelDrawer();
		} else if (dataUpdate?.statusMessage === 'failed' && dataUpdate?.data.statusMessage !== 'success') {
			message.error('Cập nhật thất bại');
		}
	}, [isSuccessUpdate]);

	useEffect(() => {
		if (isSuccessDelete && dataDelete?.statusMessage === 'success') {
			message.success('Xóa thành công');
			handleCancelDelete();
		} else if (dataDelete?.data.statusMessage === 'failed') {
			message.error('Xóa thất bại');
		}
	}, [isSuccessDelete]);

	const onFinishUpdate = () => {
		const configData = {
			...stateProductDetails,
			collections_id: collections_id,
		};
		mutationUpdateProduct.mutate(
			{ id: rowSelected, configData },
			{
				onSettled: () => {
					queryProduct.refetch();
				},
			}
		);
	};

	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý sản phẩm</WrapperHeader>
			<div style={{ marginTop: '10px' }}>
				<Button
					style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
					onClick={() => setIsModalOpen(true)}
				>
					<PlusOutlined style={{ fontSize: '60px' }}></PlusOutlined>
				</Button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<TableComponent
					handleDeleteMany={handleDeleteManyProduct}
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
			<ModalComponent
				forceRender
				style={{ textAlign: 'center' }}
				title="Tạo sản phẩm"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<Loading isLoading={isLoadingCreate}>
					<Form
						name="AdminProduct"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 18,
						}}
						style={{
							maxWidth: 800,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinish}
						autoComplete="off"
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
							{/* <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" /> */}
							<Select
								name="name"
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a name"
								optionFilterProp="children"
								onChange={handleSelectChange}
								filterOption={filterOption}
								options={OPTIONSName.concat([
									{
										value: 'add_name',
										label: 'Thêm tên sản phẩm mới',
									},
								])}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={isLoadingCollectionProduct ? <Spin size="large" /> : null}
							/>
						</Form.Item>
						{stateProduct.name && stateProduct.name === 'add_name' ? (
							<Form.Item
								label="New name"
								name="newName"
								rules={[{ required: true, message: 'Please input your name!' }]}
							>
								<InputComponent value={stateProduct.newName} onChange={handleOnChange} name="newName" />
							</Form.Item>
						) : (
							''
						)}

						<Form.Item
							label="Collection"
							name="collections_name"
							rules={[
								{
									required: true,
									message: 'Please input Collection!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a collection"
								optionFilterProp="children"
								onChange={onChange}
								filterOption={filterOption}
								options={OPTIONS}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={isLoadingCollectionProduct ? <Spin size="large" /> : null}
							/>
						</Form.Item>
						<Form.Item
							label="Size"
							name="size"
							rules={[
								{
									required: true,
									message: 'Please input Size!',
								},
								{
									validator: (_, value) => {
										const validSizes = ['s', 'm', 'l', 'xl'];
										const lowerCaseValue = value.toLowerCase();

										if (validSizes.includes(lowerCaseValue)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a Size (S, M, L, XL)!');
									},
								},
							]}
						>
							<InputComponent value={stateProduct.size} onChange={handleOnChange} name="size" />
						</Form.Item>
						<Form.Item
							label="Quatity"
							name="quantity"
							rules={[
								{
									required: true,
									message: 'Please input Quatity!',
								},
								{
									validator: (_, value) => {
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a valid number!');
									},
								},
							]}
						>
							<InputComponent value={stateProduct.quantity} onChange={handleOnChange} name="quantity" />
						</Form.Item>
						<Form.Item
							label="Price"
							name="price"
							rules={[
								{
									required: true,
									message: 'Please input Price!',
								},
								{
									validator: (_, value) => {
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a valid number for Price!');
									},
								},
							]}
						>
							<InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
						</Form.Item>
						<Form.Item
							label="Description"
							name="description"
							rules={[
								{
									required: true,
									message: 'Please input Description!',
								},
							]}
						>
							<InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
						</Form.Item>
						<Form.Item
							label="Image"
							name="image"
							rules={[
								{
									required: true,
									message: 'Please input your image!',
								},
							]}
						>
							<WrapperUploadFile
								fileList={stateProduct.image ? [{ uid: '-1', url: stateProduct.image }] : []}
								onChange={handleOnchangeAvatar}
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Select Image</Button>
								{stateProduct?.image && (
									<img
										src={stateProduct?.image}
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
			</ModalComponent>
			<DrawerComponent
				title="Chi tiết sản phẩm"
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				width="30%"
			>
				<Loading isLoading={isLoadingDetails || isLoadingUpdate}>
					<Form
						name="AdminProduct2"
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
						autoComplete="off"
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
							<InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name" />
						</Form.Item>

						<Form.Item
							label="Collection"
							name="collections_name"
							rules={[
								{
									required: true,
									message: 'Please input Collection!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a collection"
								optionFilterProp="children"
								onChange={onChange}
								filterOption={filterOption}
								options={OPTIONS}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={isLoadingCollectionProduct ? <Spin size="large" /> : null}
							/>
						</Form.Item>
						<Form.Item
							label="Size"
							name="size"
							rules={[
								{
									required: true,
									message: 'Please input Size!',
								},
								{
									validator: (_, value) => {
										const validSizes = ['s', 'm', 'l', 'xl'];
										const lowerCaseValue = value.toLowerCase();

										if (validSizes.includes(lowerCaseValue)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a Size (S, M, L, XL)!');
									},
								},
							]}
						>
							<InputComponent value={stateProductDetails.size} onChange={handleOnChangeDetails} name="size" />
						</Form.Item>
						<Form.Item
							label="Quatity"
							name="quantity"
							rules={[
								{
									required: true,
									message: 'Please input Quatity!',
								},
								{
									validator: (_, value) => {
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a valid number!');
									},
								},
							]}
						>
							<InputComponent value={stateProductDetails.quantity} onChange={handleOnChangeDetails} name="quantity" />
						</Form.Item>
						<Form.Item
							label="Price"
							name="price"
							rules={[
								{
									required: true,
									message: 'Please input Price!',
								},
								{
									validator: (_, value) => {
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a valid number for Price!');
									},
								},
							]}
						>
							<InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />
						</Form.Item>
						<Form.Item
							label="Description"
							name="description"
							rules={[
								{
									required: true,
									message: 'Please input Description!',
								},
							]}
						>
							<InputComponent
								value={stateProductDetails.description}
								onChange={handleOnChangeDetails}
								name="description"
							/>
						</Form.Item>
						<Form.Item
							label="Image"
							name="image"
							rules={[
								{
									required: true,
									message: 'Please input your image!',
								},
							]}
						>
							<WrapperUploadFile
								fileList={stateProductDetails.image ? [{ uid: '-1', url: stateProductDetails.image }] : []}
								onChange={handleOnChangeDetailsAvatar}
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Select Image</Button>
								{stateProductDetails?.image && (
									<img
										src={stateProductDetails?.image}
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
				style={{ textAlign: 'center' }}
				title="Xóa sản phẩm"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteProduct}
			>
				<Loading isLoading={isLoadingDelete}>
					<div>Bạn có chắc xóa sản phẩm này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default AdminProduct;
