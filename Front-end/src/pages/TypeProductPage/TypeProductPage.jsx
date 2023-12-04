import React from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Pagination, Row } from 'antd';

import { WrapperNavbar, WrapperProducts } from './style';

const TypeProductPage = () => {
	const onChange = () => {};
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
					<Pagination
						style={{
							textAlign: 'center',
							marginTop: '20px',
						}}
						defaultCurrent={1}
						total={100}
						onChange={onChange}
					></Pagination>
				</WrapperProducts>
			</Row>
		</div>
	);
};

export default TypeProductPage;
