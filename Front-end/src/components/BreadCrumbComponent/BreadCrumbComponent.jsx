import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const BreadCrumbComponent = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [breadCrumb, setBreadCrumb] = useState('');
	const locationPath = location.pathname;

	useEffect(() => {
		switch (true) {
			case locationPath.startsWith('/product'):
				setBreadCrumb('Danh mục');
				break;
			case locationPath === '/sign-in' || locationPath === '/sign-up':
				setBreadCrumb('Tài khoản');
				break;
			case locationPath.startsWith('/product-details'):
				setBreadCrumb('Chi tiết sản phẩm');
				break;
			case locationPath.startsWith('/cart'):
				setBreadCrumb('Giỏ hàng');
				break;

			default:
				break;
		}
	}, [locationPath]);
	return (
		<div>
			<Row style={{ padding: '14px 130px', marginTop: '80px', backgroundColor: '#f6f6f6' }}>
				<div>
					<span onClick={() => navigate('/')} style={{ color: '#2f80ed', cursor: 'pointer' }}>
						Trang chủ
					</span>
					<span className="mr_lr">&nbsp;/&nbsp;</span>
					<span onClick={() => navigate(locationPath)} style={{ color: '#2f80ed', cursor: 'pointer' }}>
						{breadCrumb}
					</span>
					{/* <span className="mr_lr">&nbsp;/&nbsp;</span>
					<span style={{ color: '#999' }}>Tất cả sản phẩm</span> */}
				</div>
			</Row>
		</div>
	);
};

export default BreadCrumbComponent;
