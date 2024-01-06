import React, { useEffect, useRef, useState } from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent.jsx';
import slider_1 from '../../assets/images/slider_1.webp';
import slider_2 from '../../assets/images/slider_2.webp';
import slider_3 from '../../assets/images/slider_3.webp';
import CardComponent from '../../components/CardComponent/CardComponent.jsx';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../service/ProductService.js';
import { WrapperButtonMore, WrapperMore, WrapperProducts, WrapperTypeProduct } from './style.js';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
	const navigate = useNavigate();
	const [initialLoad, setInitialLoad] = useState(true);
	const [isNull, setIsNull] = useState(false);
	const [loading, setLoading] = useState(false);
	const searchProduct = useSelector((state) => state.product.search);
	const searchDebounce = useDebounce(searchProduct, 500);
	const queryRef = useRef();

	const fetchProduct = async (context) => {
		setLoading(true);
		const limit = 10;
		const searchValue = context?.queryKey && context?.queryKey[1];
		const res = await ProductService.getProductSearch(searchValue, limit);
		setIsNull(false);
		if (res?.data?.length === 0) {
			setIsNull(true);
		}
		setLoading(false);
		return res;
	};

	const {
		isLoading,
		data: products,
		refetch,
	} = useQuery(['products', searchDebounce], fetchProduct, {
		retry: 2,
		retryDelay: 500,
		keepPreviousData: true,
		enabled: initialLoad,
	});

	useEffect(() => {
		queryRef.current = refetch;
	}, [refetch]);

	useEffect(() => {
		if (!initialLoad) {
			queryRef.current && queryRef.current();
		}
	}, [searchDebounce]);

	useEffect(() => {
		setInitialLoad(false);
	}, []);

	return (
		<div id="container" style={{ padding: '0 120px', height: '1000px' }}>
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			<div
				style={{
					marginTop: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '30px',
					flexWrap: 'wrap',
				}}
			>
				<Loading isLoading={loading}>
					<WrapperProducts>
						<div style={{ width: '1270px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
							{isNull ? (
								<div style={{ fontWeight: 'bold', fontSize: '20px' }}>
									Không tìm thấy bất kỳ kết quả nào với từ khóa trên.
								</div>
							) : (
								''
							)}
						</div>

						{products?.data?.map((product) => {
							return (
								<CardComponent
									key={product._id}
									description={product.description}
									image={product.image}
									name={product.name}
									price={product.price}
									id={product._id}
								></CardComponent>
							);
						})}
					</WrapperProducts>
				</Loading>
			</div>

			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
				<WrapperMore>
					<TypeProduct name={'XEM THÊM'} />
				</WrapperMore>
			</div>
		</div>
	);
};

export default HomePage;
