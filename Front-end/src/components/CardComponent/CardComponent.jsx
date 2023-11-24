import { Card } from 'antd';
import React from 'react';
import {
	StyleNameProduct,
	WrapperComparePriceText,
	WrapperDiscountText,
	WrapperPriceText,
	WrapperReportText,
} from './style';
import imageProduct from '../../assets/images/test.webp';

const CardComponent = () => {
	return (
		<Card
			hoverable
			style={{ width: 215, display: 'block' }}
			bodyStyle={{ padding: '10px 15px' }}
			cover={<img alt="example" src={imageProduct} />}
		>
			<StyleNameProduct title="Áo Polo Radiate Positivity">Áo Polo Radiate Positivity</StyleNameProduct>
			<WrapperReportText>
				<WrapperPriceText>315,000₫</WrapperPriceText>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<WrapperComparePriceText>350,000₫</WrapperComparePriceText>
					<WrapperDiscountText>-10%</WrapperDiscountText>
				</div>
			</WrapperReportText>
		</Card>
	);
};

export default CardComponent;
