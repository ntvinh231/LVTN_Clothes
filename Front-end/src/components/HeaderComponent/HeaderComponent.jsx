import { CustomSearch, WrapperHeader, WrapperHeaderAccount, WrapperHeaderCart, WrapperTextHeader } from './style';
import { Col } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const HeaderComponent = () => {
	const navigate = useNavigate();
	const handleNavigateLogin = () => {
		navigate('/sign-in');
	};
	return (
		<div>
			<WrapperHeader id="header">
				<Col span={3} offset={2}>
					<WrapperTextHeader>Hotline: 0379488746</WrapperTextHeader>
				</Col>
				<Col span={12}>
					<CustomSearch
						placeholder="Nhập sản phẩm cần tìm" //onSearch={onSearch}
						enterButton
					/>
				</Col>
				<WrapperHeaderAccount span={5} offset={2} style={{ cursor: 'pointer' }}>
					<UserOutlined style={{ fontSize: '20px' }} />
					<div onClick={handleNavigateLogin}>
						<WrapperTextHeader>Đăng nhập/Đăng ký</WrapperTextHeader>
					</div>
				</WrapperHeaderAccount>
				<WrapperHeaderCart style={{ cursor: 'pointer' }}>
					<ShoppingCartOutlined style={{ fontSize: '20px' }} />
					<div>
						<WrapperTextHeader>Giỏ hàng</WrapperTextHeader>
					</div>
				</WrapperHeaderCart>
			</WrapperHeader>
		</div>
	);
};

export default HeaderComponent;
