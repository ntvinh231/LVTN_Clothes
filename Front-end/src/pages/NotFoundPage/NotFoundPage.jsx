import React from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
	const navigate = useNavigate();
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				textAlign: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				height: '50vh',
				color: '#323c3f',
			}}
		>
			<h1>Lỗi không tìm thấy trang</h1>
			<p style={{ margin: ' 0 0 15px 0' }}>
				Xin lỗi, chúng tôi không tìm thấy kết quả nào phù hợp. Xin vui lòng quay lại trang chủ
			</p>
			<ButtonComponent
				onClick={() => navigate('/')}
				bordered="false"
				size={40}
				backgroundHover="#0089ff"
				styleButton={{
					background: 'rgb(255, 57, 69)',
					height: '48px',
					width: '12%',
					border: 'none',
					borderRadius: '4px',
					transition: 'background 0.3s ease',
					margin: '20px 0 10px',
				}}
				textButton={'Trở về trang chủ'}
				styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
			></ButtonComponent>
		</div>
	);
};

export default NotFoundPage;
