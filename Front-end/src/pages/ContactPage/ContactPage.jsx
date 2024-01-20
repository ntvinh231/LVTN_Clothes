import React from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'antd';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const ContactPage = () => {
	const navigate = useNavigate();
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Row>
					<Col style={{ width: '1150px', marginTop: '40px', marginLeft: '68px' }}>
						<h1 style={{ marginBottom: '20px' }}>LIÊN HỆ</h1>
						<p>• Hotline: 0379488746</p>
						<p>• Tên sinh viên: Nguyễn Thành Vinh</p>
						<p>• Lớp: D19_TH05</p>
						<p>• MSSV: DH51901924</p>
					</Col>
				</Row>
			</div>
			<div style={{ marginLeft: '120px', width: '80%', marginTop: '60px' }}>
				<FooterComponent></FooterComponent>
			</div>
		</>
	);
};

export default ContactPage;
