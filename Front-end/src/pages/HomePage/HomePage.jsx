import React, { useState } from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent.jsx';
import slider_1 from '../../assets/images/slider_1.webp';
import slider_2 from '../../assets/images/slider_2.webp';
import slider_3 from '../../assets/images/slider_3.webp';
import CardComponent from '../../components/CardComponent/CardComponent.jsx';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../service/ProductService.js';
import { WrapperProducts, WrapperTypeProduct } from './style.js';
import TypeProduct from '../../components/TypeProduct/TypeProduct';

const HomePage = () => {
	const arr = [''];
	// const [typeProducts, setTypeProducts] = useState([]);
	const fetchProductAll = async () => {
		const res = await ProductService.getProduct();
		// await res.data.map(async (product) => {
		// 	await fetchCollectionAll(product.collections_id);
		// });

		return res;
	};
	const fetchCollectionAll = async (id) => {
		const res = await ProductService.getCollectionProduct(id);
		const data = res.data[0];
		return data;
	};

	const { isLoading, data: products } = useQuery(['products'], fetchProductAll, { retry: 3, retryDelay: 1000 });

	// const { isLoading2, data: collections } = useQuery(['collections'], fetchCollectionAll, {
	// 	retry: 3,
	// 	retryDelay: 1000,
	// });
	// console.log('products', products);
	// console.log('collection', collections);
	return (
		<>
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
					<WrapperProducts>
						<div style={{ width: '1270px', margin: '0 auto' }}>
							<WrapperTypeProduct>
								{arr.map((item) => {
									return <TypeProduct name={item} key={item} />;
								})}
							</WrapperTypeProduct>
						</div>
						{products?.data.map((product) => {
							console.log(product.image);
							return (
								<CardComponent
									key={product._id}
									description={product.description}
									image={product.image}
									name={product.name}
									price={product.price}
								></CardComponent>
							);
						})}
					</WrapperProducts>
				</div>

				<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
					<ButtonComponent
						textButton="XEM THÊM"
						type="outline"
						backgroundHover="#0089ff"
						bordered="false"
						styleButton={{
							background: '#ed1c24',
							color: '#fff',
							borderRadius: '2px',
						}}
					></ButtonComponent>
				</div>
			</div>
		</>
	);
};

export default HomePage;
