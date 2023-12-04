import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Select, Spin, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../service/ProductService';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../util';
import { WrapperUploadFile } from './style';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';

const AdminProduct = () => {
	const [isModalOpen, setIsModelOpen] = useState(false);
	const [stateProduct, setStateProduct] = useState({
		name: '',
		price: '',
		size: '',
		description: '',
		quantity: '',
		image: '',
	});
	const [collections_id, setCollections_id] = useState('');
	const [form] = Form.useForm();
	const renderAction = () => {
		return (
			<div style={{ fontSize: '18px', display: 'flex', gap: '10px' }}>
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
				<EditOutlined style={{ color: 'green', cursor: 'pointer' }} />
			</div>
		);
	};

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
			retryDelay: 1000,
		}
	);
	const dataCollection = collectionProduct?.data;
	const OPTIONS = dataCollection
		? dataCollection.map((item) => ({
				value: item._id,
				label: item.collections_name,
		  }))
		: [];
	const onChange = (value) => {
		setCollections_id(value);
	};

	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	const mutationProduct = useMutation({
		mutationFn: async (data) => {
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
		},
	});

	//Form
	const { data, isLoadingCreate, isSuccess } = mutationProduct;
	useEffect(() => {
		if (isSuccess && data?.statusMessage === 'success') {
			message.success('Thêm thành công');
		} else if (data?.status === 400 && data?.data.statusMessage !== 'success') {
			message.error('Thêm thất bại');
		}
	}, [isSuccess]);

	const handleOnChange = (e) => {
		setStateProduct({
			...stateProduct,
			[e.target.name]: e.target.value,
		});
	};

	const handleCancel = () => {
		setIsModelOpen(false);
		form.resetFields();
	};

	const onFinish = () => {
		const configData = {
			...stateProduct,
			collections_id: collections_id,
		};
		mutationProduct.mutate(configData);
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

	//GetAllProduct
	const fetchAllProduct = async () => {
		const res = await ProductService.getProduct();
		return res;
	};
	const { isLoading, data: products } = useQuery(['products'], fetchAllProduct, {
		retry: 3,
		retryDelay: 1000,
	});

	//Chuyển collection.value thành key
	const collectionMap = OPTIONS.reduce((acc, collection) => {
		acc[collection.value] = collection.label;
		return acc;
	}, {});
	// Cập nhật dữ liệu products với collection name thành vì collections_id
	const updatedProducts = products?.data?.map((product) => ({
		...product,
		collections_name: collectionMap[product.collections_id],
	}));

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Collection',
			dataIndex: 'collections_name',
		},
		{
			title: 'Price',
			dataIndex: 'price',
		},
		{
			title: 'Size',
			dataIndex: 'size',
		},
		{
			title: 'Description',
			dataIndex: 'description',
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
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

	return (
		<div style={{ padding: '20px' }}>
			<WrapperHeader>Quản lý sản phẩm</WrapperHeader>
			<div style={{ marginTop: '10px' }}>
				<Button
					style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
					onClick={() => setIsModelOpen(true)}
				>
					<PlusOutlined style={{ fontSize: '60px' }}></PlusOutlined>
				</Button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<TableComponent dataTable={dataTable} columns={columns} isLoading={isLoading}></TableComponent>
			</div>
			<Modal
				style={{ textAlign: 'center' }}
				title="Tạo sản phẩm"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<Loading isLoading={isLoadingCreate}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 18,
						}}
						style={{
							maxWidth: 600,
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
							<InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
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
										const validSizes = ['s', 'm', 'l', 'xl', 'xxl'];
										if (validSizes.includes(value.toLowerCase()) || /^\d+$/.test(value)) {
											return Promise.resolve();
										}
										return Promise.reject('Please enter a Size (S, M, L, XL, XXL, or a number)!');
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
			</Modal>
		</div>
	);
};

export default AdminProduct;
