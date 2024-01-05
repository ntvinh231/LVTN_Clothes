import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Col, Pagination, Row } from 'antd';
import * as ProductService from '../../service/ProductService';
import { WrapperNavbar, WrapperProducts } from './style';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { SortPagi, WrapperLabelTitle } from '../../components/NavbarComponent/style';

const TypeProductPage = () => {
	let { state } = useLocation();
	const { pathname } = useLocation();
	const match = pathname.match(/\/product\/([^\/]+)(\/|$)/);
	console.log(match);
	let result = match ? match[1].replace(/-/g, ' ') : null;
	useEffect(() => {
		if (!state) {
			state = result;
		}
	}, []);
	const [collectionProduct, setCollectionProduct] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
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
	}, []);
	const fetchProductType = async (state) => {
		try {
			setLoading(true);
			let res, collectionsId, data;
			if (state === 'all') {
				data = await ProductService.getProductCollection();
			} else {
				res = await ProductService.getNameCollection(state);
				collectionsId = res?.data[0]._id;

				data = await ProductService.getProductCollection(collectionsId);
			}
			if (data?.statusCode === 200) {
				setLoading(false);
				setProducts(data?.data);
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.error('Error fetching collection product:', error);
			throw error;
		}
	};

	const queryProduct2 = useQuery(['collections'], fetchProductType, {
		retry: 3,
		retryDelay: 500,
	});
	const { isLoading: isLoadingCollection2, data: collections2 } = queryProduct2;

	useEffect(() => {
		if (state) {
			fetchProductType(state);
		}
	}, [state]);
	const onChange = () => {};
	return (
		<Loading isLoading={loading}>
			<div style={{ background: '#fff', marginRight: '10px', padding: '10px', borderRadius: '6px' }}>
				<Row style={{ padding: '20px 128px', flexWrap: 'nowrap' }}>
					<WrapperNavbar span={5}>
						<Loading isLoading={isLoadingCollection}>
							<NavbarComponent collectionsName={collectionProduct}></NavbarComponent>
						</Loading>
					</WrapperNavbar>

					<Col span={18} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						<Row>
							<SortPagi>
								<WrapperLabelTitle>{state === 'all' ? 'tất cả sản phẩm' : state}</WrapperLabelTitle>
							</SortPagi>
						</Row>
						<Row>
							<WrapperProducts>
								{products?.map((data) => {
									return (
										<CardComponent
											key={data._id}
											description={data.description}
											image={data.image}
											name={data.name}
											price={data.price}
											id={data._id}
										></CardComponent>
									);
								})}
							</WrapperProducts>
						</Row>
						<Pagination
							style={{
								// display: 'none',
								textAlign: 'center',
								marginTop: '80px',
							}}
							defaultCurrent={1}
							total={100}
							onChange={onChange}
						></Pagination>
					</Col>
				</Row>
			</div>
		</Loading>
	);
};

export default TypeProductPage;
