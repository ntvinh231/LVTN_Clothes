import { Card } from 'antd';
import React from 'react';
import {
	StyleNameProduct,
	WrapperComparePriceText,
	WrapperDiscountText,
	WrapperPriceText,
	WrapperReportText,
} from './style';

const CardComponent = () => {
	return (
		<Card
			hoverable
			style={{ width: 204, display: 'block' }}
			bodyStyle={{ padding: '10px 15px' }}
			cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
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
