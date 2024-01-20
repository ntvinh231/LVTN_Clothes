import React, { useEffect, useRef, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Col, Pagination, Row, Select } from 'antd';
import * as ProductService from '../../service/ProductService';
import { WrapperNavbar, WrapperProducts } from './style';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { SortPagi, WrapperLabelTitle } from '../../components/NavbarComponent/style';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const TypeProductPage = () => {
	const OPTIONS = [
		{ value: '', label: 'Mặc định' },
		{ value: 'sort=-name', label: 'A -> Z' },
		{ value: 'sort=name', label: 'Z -> A' },
		{ value: 'sort=price', label: 'Giá tăng dần' },
		{ value: 'sort=-price', label: 'Giá giảm dần' },
	];
	const searchProduct = useSelector((state) => state.product.search);
	const searchDebounce = useDebounce(searchProduct, 500);
	const [collection, setCollection] = useState('');
	const [selectValue, setSelectValue] = useState('Mặc định');
	let { state } = useLocation();

	const { pathname } = useLocation();
	const match = pathname.match(/\/product\/([^\/]+)(\/|$)/);
	let result = match ? match[1].replace(/-/g, ' ') : null;

	const onChangeSelect = (value) => {
		setSelectValue(value);
	};
	useEffect(() => {
		if (!state) {
			state = result;
		}
	}, []);

	const [collectionProduct, setCollectionProduct] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [paginate, setPaginate] = useState({
		page: 1,
		limit: 5,
		totalPage: 1,
	});

	const fetchAllCollectionProduct = async () => {
		try {
			const res = await ProductService.getCollectionProduct();
			const collectionsName = res?.data?.map((item) => item.collections_name);

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

	const fetchProductType = async (state, page, limit, selectValue) => {
		try {
			console.log(selectValue);
			setLoading(true);
			let res, collectionsId, data;
			if (state === 'all') {
				data = await ProductService.getProductTypePagi({ page, limit, selectValue });
			} else {
				res = await ProductService.getNameCollection(state);
				collectionsId = res?.data[0]?._id;

				data = await ProductService.getProductTypePagi({ page, limit, collectionsId, selectValue });
			}
			setCollection(collectionsId);
			if (data?.statusCode === 200) {
				setLoading(false);
				setProducts(data?.data);
				setPaginate({ ...paginate, totalPage: data?.totalPage });
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
			fetchProductType(state, paginate.page, paginate.limit, selectValue);
		}
	}, [state, paginate.page, paginate.limit, selectValue]);

	useEffect(() => {
		//Reset page khi đổi collection
		setPaginate({ ...paginate, page: 1 });
	}, [collection]);

	const onChange = (current) => {
		setPaginate({ ...paginate, page: current });
	};

	return (
		<>
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
									<WrapperLabelTitle>{state === 'all' ? 'Tất cả sản phẩm' : state}</WrapperLabelTitle>
									<Select
										style={{ width: 150, marginLeft: 10, marginTop: '29px' }}
										placeholder="Chọn một lựa chọn"
										value={selectValue}
										onChange={onChangeSelect}
										options={OPTIONS}
									></Select>
								</SortPagi>
							</Row>
							<Row>
								<WrapperProducts>
									{products
										?.filter(
											(pro) =>
												searchDebounce === '' || pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())
										)
										?.map((data) => (
											<CardComponent
												key={data._id}
												description={data.description}
												image={data.image}
												name={data.name}
												discount={data.discount}
												price={data.price}
												id={data._id}
											/>
										))}
								</WrapperProducts>
							</Row>
							<Pagination
								style={{
									textAlign: 'center',
									marginTop: '80px',
								}}
								defaultCurrent={paginate.page}
								current={paginate?.page}
								pageSize={paginate?.limit}
								total={paginate?.limit * paginate.totalPage}
								onChange={onChange}
							></Pagination>
						</Col>
					</Row>
				</div>
			</Loading>
			<div style={{ marginLeft: '120px', width: '80%' }}>
				<FooterComponent></FooterComponent>
			</div>
		</>
	);
};

export default TypeProductPage;
