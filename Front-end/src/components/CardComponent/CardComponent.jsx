import { Card } from 'antd';
import React from 'react';
import {
	CardImage,
	StyleNameProduct,
	WrapperComparePriceText,
	WrapperDiscountText,
	WrapperPriceText,
	WrapperReportText,
} from './style';

import { useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
	const navigate = useNavigate();
	const { description, image, name, price, discount, id } = props;
	const handleDetails = (id) => {
		navigate(`/product-details/${id}`);
	};
	return (
		<Card
			onClick={() => handleDetails(id)}
			hoverable
			headStyle={{ width: '200px', height: '200px' }}
			style={{ width: 200 }}
			bodyStyle={{ padding: '15px 20px' }}
			cover={<CardImage alt={name} src={image} />}
		>
			<StyleNameProduct
				title="Áo Polo Radiate Positivity"
				style={{ textDecoration: 'none', color: '#000000', fontWeight: 'bold' }}
			>
				{name}
			</StyleNameProduct>
			<WrapperReportText>
				<WrapperPriceText>{price}</WrapperPriceText>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<WrapperComparePriceText>{price}</WrapperComparePriceText>
					<WrapperDiscountText>{discount || -10}%</WrapperDiscountText>
				</div>
			</WrapperReportText>
		</Card>
	);
};

export default CardComponent;
