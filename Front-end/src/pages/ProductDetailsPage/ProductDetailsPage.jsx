import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
	const { id } = useParams();
	return (
		<>
			<div style={{ padding: '0 120px', height: '700px' }}>
				<ProductDetailsComponent idProduct={id}></ProductDetailsComponent>
			</div>
			<div style={{ marginLeft: '120px', width: '80%' }}>
				<FooterComponent></FooterComponent>
			</div>
		</>
	);
};

export default ProductDetailsPage;
