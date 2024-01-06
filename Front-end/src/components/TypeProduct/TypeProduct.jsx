import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledTypeProduct } from './style';

const TypeProduct = ({ name, styleComponent }) => {
	const navigate = useNavigate();

	const handleNavigatetype = (collection) => {
		let stateValue;

		switch (collection.toLowerCase()) {
			case 'xem thêm':
			case 'sản phẩm':
			case 'all item':
				stateValue = 'all';
				break;
			default:
				stateValue = collection.toLowerCase();
		}

		navigate(
			`/product/${stateValue
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/ /g, '-')}`,
			{ state: stateValue }
		);
	};

	return (
		<StyledTypeProduct
			style={{
				...styleComponent,
			}}
			onClick={() => handleNavigatetype(name)}
		>
			{name}
		</StyledTypeProduct>
	);
};

export default TypeProduct;
