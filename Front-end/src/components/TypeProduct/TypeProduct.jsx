import React from 'react';
import { useNavigate } from 'react-router-dom';

const TypeProduct = ({ name }) => {
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
	return <div onClick={() => handleNavigatetype(name)}>{name}</div>;
};

export default TypeProduct;
