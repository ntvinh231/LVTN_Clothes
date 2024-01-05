import React from 'react';
import { WrapperContent, WrapperLabelText, WrapperTextValue } from './style';
import { Checkbox } from 'antd';

const NavbarComponent = (props) => {
	const { collectionsName } = props;
	const collectionsArray = Array.isArray(collectionsName) ? collectionsName : [];
	const updatedCollections = ['ALL ITEM', ...collectionsArray];
	const onChange = () => {};
	const renderContent = (type, options) => {
		switch (type) {
			case 'text':
				return options?.map((option, id) => {
					return <WrapperTextValue key={id}>{option.toUpperCase()}</WrapperTextValue>;
				});
			case 'checkbox':
				return (
					<Checkbox.Group
						style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
						onChange={onChange}
					>
						{options.map((option) => {
							return (
								<Checkbox key={option.value} value={option.value}>
									{option.label}
								</Checkbox>
							);
						})}
					</Checkbox.Group>
				);
			case 'price':
				return options.map((option, id) => {
					return <WrapperTextValue key={id}>{option}</WrapperTextValue>;
				});
			default:
				return {};
		}
	};
	return (
		<div>
			<WrapperLabelText>Label</WrapperLabelText>
			<WrapperContent>{renderContent('text', updatedCollections)}</WrapperContent>
			<WrapperContent>
				{' '}
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
