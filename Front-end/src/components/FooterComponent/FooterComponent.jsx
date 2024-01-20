import React from 'react';
import { StyledFooter, StyledText, StyledLink, StyledBoldUnderlineText } from './style';
import { Row, Col, Typography, Input, Button } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Search } = Input;

const FooterComponent = () => {
	return (
		<StyledFooter>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={8} lg={6}>
					<StyledBoldUnderlineText>Liên hệ</StyledBoldUnderlineText>
					<StyledText>
						<EnvironmentOutlined style={{ marginRight: '8px' }} />
						Trường Dại Học Công Nghệ Sài Gòn
					</StyledText>
					<StyledText>
						<PhoneOutlined style={{ marginRight: '8px' }} />
						+84 379 488 746
					</StyledText>
					<StyledText>
						<MailOutlined style={{ marginRight: '8px' }} />
						DH51901924@student.stu.edu.vn
					</StyledText>
				</Col>
				<Col xs={24} sm={12} md={8} lg={6}>
					<StyledBoldUnderlineText>Liên kết nhanh</StyledBoldUnderlineText>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						<li style={{ marginBottom: '10px' }}>
							<StyledLink href="/">Trang chủ</StyledLink>
						</li>
						<li style={{ marginBottom: '10px' }}>
							<StyledLink href="/product/all">Sản phẩm</StyledLink>
						</li>
						<li style={{ marginBottom: '10px' }}>
							<StyledLink href="/contact">Liên hệ</StyledLink>
						</li>
					</ul>
				</Col>
				<Col xs={24} sm={12} md={8} lg={6}>
					<StyledBoldUnderlineText>Đăng ký nhận tin</StyledBoldUnderlineText>
					<StyledText>Nhận thông báo mới nhất về dự án và tin tức</StyledText>
					<Search placeholder="Địa chỉ email" style={{ width: '100%' }} />
					<Button type="primary" style={{ marginTop: '8px' }}>
						Đăng ký
					</Button>
				</Col>
			</Row>
			<Row justify="end" style={{ marginTop: '16px' }}>
				<Col>
					<Text style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
						© {new Date().getFullYear()} Nguyễn Thành Vinh - DH51901924.
					</Text>
				</Col>
			</Row>
		</StyledFooter>
	);
};

export default FooterComponent;
