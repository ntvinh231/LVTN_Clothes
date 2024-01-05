import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
	const { id } = useParams();
	return (
		<div style={{ padding: '0 120px', height: '1000px' }}>
			<ProductDetailsComponent idProduct={id}></ProductDetailsComponent>
		</div>
	);
};

export default ProductDetailsPage;
