import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledTypeProduct } from './style';

const TypeProduct = ({ name, styleComponent, backgroundHover }) => {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
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
				color: isHovered ? backgroundHover : styleComponent?.color,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => handleNavigatetype(name)}
		>
			{name}
		</StyledTypeProduct>
	);
};

export default TypeProduct;
