import React, { useEffect, useState } from 'react';
import { WrapperContent, WrapperLabelText, WrapperTextValue } from './style';
import { Checkbox } from 'antd';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { useLocation, useNavigate } from 'react-router-dom';

const NavbarComponent = (props) => {
	const [activeOption, setActiveOption] = useState(null);
	const { state } = useLocation();
	const { collectionsName } = props;
	const collectionsArray = Array.isArray(collectionsName) ? collectionsName : [];
	const updatedCollections = ['ALL ITEM', ...collectionsArray];
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const onChange = (e) => {
		setActiveOption(e.target.value);
	};

	const match = pathname.match(/\/product\/([^\/]+)(\/|$)/);
	let result = match ? match[1].replace(/-/g, ' ') : null;

	useEffect(() => {
		if (result && result.toLowerCase() === 'all') {
			setActiveOption('ALL ITEM');
		} else if (!state && result) {
			setActiveOption(result.toUpperCase());
		} else if (state && state.toLowerCase() === 'all') {
			setActiveOption('ALL ITEM');
		} else {
			setActiveOption(state.toUpperCase());
		}
	}, [state, result]);

	const handleTypeProductClick = (option) => {
		let stateValue;

		switch (option.toLowerCase()) {
			case 'xem thêm':
			case 'sản phẩm':
			case 'all item':
				stateValue = 'all';
				break;
			default:
				stateValue = option.toLowerCase();
		}

		navigate(
			`/product/${stateValue
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/ /g, '-')}`,
			{ state: stateValue }
		);
	};

	const renderContent = (type, options) => {
		if (type === 'text') {
			return options?.map((option, id) => (
				<TypeProduct
					key={id}
					backgroundHover="#0089ff"
					styleComponent={{
						color: activeOption === option.toUpperCase() ? '#0089ff' : '#333',
						padding: '6px',
						fontSize: '15px',
						cursor: 'pointer',
					}}
					name={option.toUpperCase()}
					onClick={() => handleTypeProductClick(option)}
				>
					<WrapperTextValue key={id}></WrapperTextValue>
				</TypeProduct>
			));
		}

		return [];
	};

	return (
		<div>
			<WrapperLabelText>DANH MỤC SẢN PHẨM</WrapperLabelText>
			<WrapperContent>{renderContent('text', updatedCollections)}</WrapperContent>
			<WrapperContent>
				{renderContent('checkbox', [
					{
						value: 'a',
						label: 'A',
					},
					{
						value: 'B',
						label: 'B',
					},
					{
						value: 'c',
						label: 'C',
					},
				])}
			</WrapperContent>
			<WrapperContent>
				{renderContent('price', [
					'Giá dưới 100,000₫',
					'100,000₫ - 200,000₫',
					'200,000₫ - 300,000₫',
					'300,000₫ - 500,000₫',
					'Giá trên 600,000₫',
				])}
			</WrapperContent>
		</div>
	);
};

export default NavbarComponent;
