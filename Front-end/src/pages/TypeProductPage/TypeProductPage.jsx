import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Pagination, Row } from 'antd';
import * as ProductService from '../../service/ProductService';
import { WrapperNavbar, WrapperProducts } from './style';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';

const TypeProductPage = () => {
	const [collectionProduct, setCollectionProduct] = useState([]);
	const fetchAllCollectionProduct = async () => {
		try {
			const res = await ProductService.getCollectionProduct();

			const collectionsName = res?.data.map((item) => item.collections_name);
			if (res?.statusMessage === 'success') {
				setCollectionProduct(collectionsName);
				return collectionsName;
			}
		} catch (error) {
			console.error('Error fetching collection product:', error);
			throw error;
		}
	};

	const queryProduct = useQuery(['collections'], fetchAllCollectionProduct, {
		retry: 3,
		retryDelay: 500,
	});
	const { isLoading: isLoadingCollection, data: collections } = queryProduct;

	useEffect(() => {
		fetchAllCollectionProduct();
	}, [collectionProduct]);

	const onChange = () => {};
	return (
		<div style={{ background: '#fff', marginRight: '10px', padding: '10px', borderRadius: '6px' }}>
			<Row style={{ padding: '20px 120px', flexWrap: 'nowrap' }}>
				<WrapperNavbar span={5}>
					<Loading isLoading={isLoadingCollection}>
						<NavbarComponent collectionsName={collectionProduct}></NavbarComponent>
					</Loading>
				</WrapperNavbar>
				<WrapperProducts span={18}>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<Pagination
						style={{
							textAlign: 'center',
							marginTop: '20px',
						}}
						defaultCurrent={1}
						total={100}
						onChange={onChange}
					></Pagination>
				</WrapperProducts>
			</Row>
		</div>
	);
};

export default TypeProductPage;
