import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Select, Spin, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import * as message from '../../components/Message/Message';
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
	const searchInput = useRef(null);
	const isUpdate = useRef(false);
	const [collections_id, setCollections_id] = useState('');
	const [colors_id, setColors_id] = useState('');
	const [tempImagePath, setTempImagePath] = useState(null);
	const [tempImagePathDetails, setTempImagePathDetails] = useState(null);

	const inittial = () => ({
		name: '',
		newName: '',
		price: '',
		size: '',
		description: '',
		quantity: '',
		image: '',
		discount: '',
	});
	const [stateProduct, setStateProduct] = useState(inittial());
	const [stateProductDetails, setStateProductDetails] = useState(inittial());
	//Form
	const [form] = Form.useForm();
	//Select Collection
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

	//Select Color
	const fetchColorProduct = async () => {
		const res = await ProductService.getColorProduct();
		return res;
	};
	const { isLoadingColorProduct, data: colorProduct } = useQuery(['colorProduct'], fetchColorProduct, {
		retry: 3,
		retryDelay: 500,
	});
	const dataColor = colorProduct?.data;
	const OPTIONSColor = Array.isArray(dataColor)
		? dataColor.map((item) => ({
				value: item._id,
				label: item.color,
		  }))
		: [];
	const handleSelectChange = (value) => {
		const existingProduct = products?.data.find((product) => product.name === value);
		if (value === 'add_name') {
			setStateProduct({
				...existingProduct,
				name: value,
			});
		} else {
			setStateProduct({
				...existingProduct,
				name: value,
			});
			setIsLoadingDetails1(true);
			fetchDetailsProductCreate(existingProduct?._id);
		}
	};

	const onChange = async (value) => {
		setCollections_id(value);

		// Fetch thông tin collection dựa trên collections_id
		const resCollectionSelect = await ProductService.getCollectionProduct(value);

		if (resCollectionSelect?.data) {
			setCollectionName(resCollectionSelect.data[0]?.collections_name);
		}
	};
	const [colorName, setColorName] = useState('');
	const onChangeColor = async (value) => {
		setColors_id(value);

		// Fetch thông tin color dựa trên colors_id
		const resColorSelect = await ProductService.getColorProduct(value);

		if (resColorSelect?.data) {
			setColorName(resColorSelect.data[0]?.color);
		}
	};

	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	const mutationProduct = useMutation({
		mutationFn: async (data) => {
			let response;
			try {
				const { name, price, size, colors_id, description, quantity, image, collections_id, discount } = data;
				if (!image) {
					const formData = new FormData();
					formData.append('images', tempImagePath);
					response = await ProductService.uploadImageCloudinary(formData);
				}
				const res = await ProductService.createProduct({
					name: name,
					price: price,
					size: size,
					colors_id: colors_id,
					description: description,
					quantity: quantity,
					image: response?.path || image,
					collections_id: collections_id,
					discount,
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
		} else if (data?.statusCode === 400) {
			message.error(data?.message);
			handleCancel();
		}
	}, [data?.statusCode]);

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

	//Delete-many
	const handleDeleteMany = (ids) => {
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
	useEffect(() => {
		if (isModalOpen) {
			form.resetFields();
			form.setFieldsValue(inittial());
			isUpdate.current = false;
		} else {
			form.resetFields();
			form.setFieldsValue(stateProductDetails);
		}
		form.resetFields();
	}, [stateProductDetails, isModalOpen, form]);
	const handleCancel = () => {
		setIsModalOpen(false);
		setStateProduct({
			name: '',
			price: '',
			description: '',
			discount: '',
			color: '',
			collections_name: '',
			image: '',
		});
		setCollectionName('');
		form.resetFields();
	};

	//Update
	const handleCancelDrawer = () => {
		setStateProductDetails({
			name: '',
			newName: '',
			price: '',
			size: '',
			description: '',
			quantity: '',
			image: '',
			discount: '',
		});
		setIsDrawerOpen(false);
		form.resetFields();
	};

	const onFinish = () => {
		if (isUpdate.current) {
			// Xử lý logic cho update
			onFinishUpdate();
		} else {
			// Xử lý logic cho create
			onFinishCreate();
		}
	};
	const onFinishCreate = () => {
		const configData = {
			name: stateProduct.name === 'add_name' ? stateProduct.newName : stateProduct.name,
			price: stateProduct.price,
			size: stateProduct.size,
			colors_id: colors_id,
			description: stateProduct.description,
			quantity: stateProduct.quantity,
			image: stateProduct.image,
			discount: stateProduct?.discount,
			collections_id: collections_id,
		};

		mutationProduct.mutate(configData, {
			onSettled: () => {
				queryProduct.refetch();
			},
		});
		setStateProduct({
			...stateProduct,
		});
	};

	const handleOnchangeAvatar = async ({ fileList }) => {
		try {
			const file = fileList[0];
			if (file && file.originFileObj) {
				setTempImagePath(file.originFileObj);
				file.preview = await getBase64(file.originFileObj);
			}

			setStateProduct({
				...stateProduct,
				image: file ? file.preview : null,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleOnChangeDetailsAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (file && file.originFileObj) {
			setTempImagePathDetails(file.originFileObj);
			file.preview = await getBase64(file.originFileObj);
		}

		setStateProductDetails({
			...stateProductDetails,
			image: file ? file.preview : null,
		});
	};

	//GetAllProduct
	const fetchAllProduct = async () => {
		const res = await ProductService.getProductAdmin();
		return res;
	};
	const queryProduct = useQuery(['products'], fetchAllProduct);
	const { isLoading, data: products } = queryProduct;

	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isLoadingDetails1, setIsLoadingDetails1] = useState(false);
	const fetchDetailsProduct = async (rowSelected) => {
		setIsLoadingDetails(true);
		const res = await ProductService.getProduct(rowSelected);

		//Get name collection
		const resCollectionSelect = await ProductService.getCollectionProduct(res?.data[0]?.collections_id);
		//Get name color
		const resColorSelect = await ProductService.getColorProduct(res?.data[0]?.colors_id);
		setCollections_id(res?.data[0]?.collections_id ? res?.data[0]?.collections_id : '');
		setColors_id(res?.data[0]?.colors_id ? res?.data[0]?.colors_id : '');
		setCollectionName(resCollectionSelect.data[0]?.collections_name);
		setColorName(resColorSelect.data[0]?.color);
		if (res?.data) {
			setStateProductDetails({
				name: res?.data[0]?.name,
				price: res?.data[0]?.price,
				size: res?.data[0]?.size,
				color: res?.data[0].colors_id ? resColorSelect.data[0]?.color : '',
				description: res?.data[0]?.description,
				quantity: res?.data[0]?.quantity,
				image: res?.data[0]?.image,
				collections_name: res?.data[0].collections_id ? resCollectionSelect.data[0]?.collections_name : '',
				discount: res?.data[0].discount,
			});
			form.setFieldsValue({
				name: stateProductDetails?.name,
				collections_name: resCollectionSelect.data[0]?.collections_name,
				size: stateProductDetails?.size,
				quantity: stateProductDetails?.quantity,
				price: stateProductDetails?.price,
				discount: stateProductDetails?.discount,
				description: stateProductDetails?.description,
				image: stateProductDetails?.image,
			});
		}
		setIsLoadingDetails(false);
	};
	const [collectionName, setCollectionName] = useState('');
	const fetchDetailsProductCreate = async (rowSelected) => {
		setIsLoadingDetails1(true);
		const res = await ProductService.getProduct(rowSelected);
		const resCollectionSelect = await ProductService.getCollectionProduct(res?.data[0]?.collections_id);
		setCollections_id(res?.data[0]?.collections_id);
		setCollectionName(resCollectionSelect.data[0]?.collections_name);
		const resColorSelect = await ProductService.getCollectionProduct(res?.data[0]?.colors_id);
		setColors_id(res?.data[0]?.colors_id);
		if (res?.data) {
			setStateProduct({
				name: res?.data[0]?.name,
				price: res?.data[0]?.price,
				size: '',
				color: resColorSelect.data[0]?.color,
				description: res?.data[0]?.description,
				quantity: '',
				image: res?.data[0]?.image,
				collections_name: resCollectionSelect.data[0]?.collections_name,
				discount: res?.data[0].discount,
			});
		}
		setIsLoadingDetails1(false);
	};

	const OPTIONSName = Array.isArray(products?.data)
		? [...new Set(products?.data.map((item) => item.name))].map((name) => ({
				value: name,
				label: name,
		  }))
		: [];

	//Create
	useEffect(() => {
		setCollections_id(stateProduct?.collections_id);
		form.setFieldsValue({
			name: stateProduct?.name,
			size: '',
			color: '',
			collections_name: collectionName,
			quantity: stateProduct?.quantity,
			price: stateProduct?.price,
			discount: stateProduct?.discount,
			description: stateProduct?.description,
			image: stateProduct?.image,
		});
	}, [form, stateProduct.name]);

	useEffect(() => {
		if (isModalOpen) {
			form.setFieldsValue({
				collections_name: collectionName,
				name: stateProduct?.name,
				quantity: stateProduct?.quantity,
				price: stateProduct?.price,
				discount: stateProduct?.discount,
				description: stateProduct?.description,
				image: stateProduct?.image,
			});
		}
	}, [form, stateProduct]);

	//Lấy thong tin product hiển thị lên drawer

	useEffect(() => {
		form.setFieldsValue({
			collections_name: collectionName,
			color: colorName,
			name: stateProductDetails?.name,
			quantity: stateProductDetails?.quantity,
			price: stateProductDetails?.price,
			size: stateProductDetails?.size,
			discount: stateProductDetails?.discount,
			description: stateProductDetails?.description,
			image: stateProductDetails?.image,
		});
	}, [stateProductDetails]);

	useEffect(() => {
		if (rowSelected) {
			setIsLoadingDetails(true);
			fetchDetailsProduct(rowSelected);
		}
	}, [isDrawerOpen]);
	const handleDetailsProduct = () => {
		isUpdate.current = true;
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

	//Chuyển collection.value thành key
	const colorMap = OPTIONSColor.reduce((acc, color) => {
		acc[color.value] = color.label;
		return acc;
	}, {});
	// Cập nhật dữ liệu products với collection name thành vì collections_id
	const updatedProducts = Array.isArray(products?.data)
		? products.data.map((product) => ({
				...product,
				collections_name: collectionMap[product.collections_id],
				color: colorMap[product.colors_id],
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
			width: 300,
		},
		{
			title: 'Collection',
			dataIndex: 'collections_name',
			width: 200,
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
					text: 'M',
					value: 'M',
				},
				{
					text: 'L',
					value: 'L',
				},
				{
					text: 'XL',
					value: 'XL',
				},
			],
			onFilter: (value, record) => {
				return record.size === value;
			},
		},
		{
			title: 'Color',
			dataIndex: 'color',
			...getColumnSearchProps('color'),
		},
		{
			title: 'Discount',
			dataIndex: 'discount',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: 200,
		},
		{
			title: 'Selled',
			dataIndex: 'selled',
			sorter: (a, b) => a.selled - b.selled,
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
				const { name, price, size, colors_id, description, quantity, image, collections_id, discount } =
					data.configData;
				const formData = new FormData();
				formData.append('images', tempImagePathDetails);
				const response = await ProductService.uploadImageCloudinary(formData);
				const res = await ProductService.updateProduct(data.id, {
					name: name,
					price: price,
					size: size,
					colors_id: colors_id,
					description: description,
					quantity: quantity,
					image: response?.path,
					collections_id: collections_id,
					discount,
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
			form.resetFields();
		} else if (dataUpdate?.statusMessage === 'failed') {
			message.error(dataUpdate?.message);
		}
	}, [dataUpdate?.statusMessage]);

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
			colors_id: colors_id,
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
					onClickOpenModal={() => setIsModalOpenDelete(true)}
					handleDeleteMany={handleDeleteMany}
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
			<ModalComponent
				forceRender
				style={{ textAlign: 'center' }}
				title="Tạo sản phẩm"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<Loading isLoading={isLoadingCreate || isLoadingDetails1}>
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
										const lowerCaseValue = value && value.toLowerCase();

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
							label="Color"
							name="color"
							rules={[
								{
									required: true,
									message: 'Please input color!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a color"
								optionFilterProp="children"
								onChange={onChangeColor}
								filterOption={filterOption}
								options={OPTIONSColor}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={isLoadingColorProduct ? <Spin size="large" /> : null}
							/>
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
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value) && value > 0) {
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
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value) && value > 0) {
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
							label="Discount(%)"
							name="discount"
							rules={[
								{
									required: true,
									message: 'Please input discount!',
								},
							]}
						>
							<InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount" />
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
							<Button type="primary" htmlType="create">
								Create
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</ModalComponent>
			<DrawerComponent title="Chi tiết sản phẩm" isOpen={isDrawerOpen} onClose={handleCancelDrawer} width="30%">
				<Loading isLoading={isLoadingDetails || isLoadingUpdate}>
					<Form
						name="AdminProduct2"
						labelCol={{
							span: 6,
						}}
						wrapperCol={{
							span: 16,
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
										return Promise.reject('Chỉ được nhập size cho phép (S, M, L, XL)!');
									},
								},
							]}
						>
							<InputComponent value={stateProductDetails.size} onChange={handleOnChangeDetails} name="size" />
						</Form.Item>
						<Form.Item
							label="Color"
							name="color"
							rules={[
								{
									required: true,
									message: 'Please input color!',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: '300px' }}
								showSearch
								placeholder="Select a color"
								optionFilterProp="children"
								onChange={onChangeColor}
								filterOption={filterOption}
								options={OPTIONSColor}
								dropdownRender={(menu) => <div style={{ width: '100%' }}>{menu}</div>}
								notFoundContent={isLoadingColorProduct ? <Spin size="large" /> : null}
							/>
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
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value) && value > 0) {
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
										if (!isNaN(value) && parseInt(value, 10) === parseFloat(value) && value > 0) {
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
							label="Discount(%)"
							name="discount"
							rules={[
								{
									required: true,
									message: 'Please input Discount of product!',
								},
							]}
						>
							<InputComponent value={stateProductDetails?.discount} onChange={handleOnChangeDetails} name="discount" />
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
