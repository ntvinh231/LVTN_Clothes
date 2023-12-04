import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminUser/style';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../service/ProductService';
import { useMutation } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';

const CollectionProduct = () => {
	const [isModalOpen, setIsModelOpen] = useState(false);
	const [stateCollection, setStateCollection] = useState({
		collections_name: '',
	});

	const mutationCollection = useMutation({
		mutationFn: (data) => {
			const res = ProductService.createCollection({ collections_name: data.collections_name });
			return res;
		},
	});

	const { data, isLoading, isSuccess, isError } = mutationCollection;

	useEffect(() => {
		if (isSuccess && data?.statusMessage === 'success') {
			message.success('Thêm thành công');
			handleCancel();
		} else if (data?.status === 400) {
			message.error('Thêm thất bại');
		}
	}, [isSuccess, isError]);

	const handleOnChange = (e) => {
		setStateCollection({
			...stateCollection,
			[e.target.name]: e.target.value,
		});
	};

	const handleCancel = () => {
		setIsModelOpen(false);
	};

	const onFinish = () => {
		mutationCollection.mutate(stateCollection);
	};

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
				<TableComponent></TableComponent>
			</div>
			<Loading isLoading={isLoading}>
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
		</div>
	);
};

export default CollectionProduct;
