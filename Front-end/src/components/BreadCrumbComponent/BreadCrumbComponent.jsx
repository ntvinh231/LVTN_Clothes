import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const BreadCrumbComponent = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [breadCrumb, setBreadCrumb] = useState('');
	useEffect(() => {
		switch (location.pathname) {
			case '/type':
				setBreadCrumb('Danh mục');
				break;
			case '/sign-in':
				setBreadCrumb('Tài khoản');
				break;
			case '/sign-up':
				setBreadCrumb('Tài khoản');
				break;
			default:
				break;
		}
	}, [location.pathname]);
	return (
		<div>
			<Row style={{ padding: '14px 130px', marginTop: '80px', backgroundColor: '#f6f6f6' }}>
				<div>
					<span onClick={() => navigate('/')} style={{ color: '#2f80ed', cursor: 'pointer' }}>
						Trang chủ
					</span>
					<span className="mr_lr">&nbsp;/&nbsp;</span>
					<span onClick={() => navigate('/type')} style={{ color: '#2f80ed', cursor: 'pointer' }}>
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
