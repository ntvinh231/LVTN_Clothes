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
	const { description, image, name, price, discount = 5, id } = props;

	const discountedPrice = price - (price * discount) / 100;
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
				<WrapperPriceText>{discountedPrice.toLocaleString()} VNĐ</WrapperPriceText>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<WrapperComparePriceText>{price?.toLocaleString()}</WrapperComparePriceText> VNĐ
					<WrapperDiscountText>{discount || -5}%</WrapperDiscountText>
				</div>
			</WrapperReportText>
		</Card>
	);
};

export default CardComponent;
