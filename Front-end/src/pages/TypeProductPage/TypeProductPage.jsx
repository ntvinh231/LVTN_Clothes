import React from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Row } from 'antd';

import { WrapperNavbar, WrapperProducts } from './style';

const TypeProductPage = () => {
	return (
		<div style={{ background: '#fff', marginRight: '10px', padding: '10px', borderRadius: '6px' }}>
			<Row style={{ padding: '20px 120px', flexWrap: 'nowrap' }}>
				<WrapperNavbar span={5}>
					<NavbarComponent></NavbarComponent>
				</WrapperNavbar>
				<WrapperProducts span={18}>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
					<CardComponent></CardComponent>
				</WrapperProducts>
			</Row>
		</div>
	);
};

export default TypeProductPage;
