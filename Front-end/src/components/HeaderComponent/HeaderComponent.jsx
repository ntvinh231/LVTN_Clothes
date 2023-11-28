import { CustomSearch, WrapperHeader, WrapperHeaderAccount, WrapperHeaderCart, WrapperTextHeader } from './style';
import { Badge, Col } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const HeaderComponent = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
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
					{user?.name ? (
						<div>{user.name}</div>
					) : (
						<div onClick={handleNavigateLogin}>
							<WrapperTextHeader>Đăng nhập/Đăng ký</WrapperTextHeader>
						</div>
					)}
				</WrapperHeaderAccount>
				<WrapperHeaderCart style={{ cursor: 'pointer' }}>
					<Badge count={4} size="small">
						<ShoppingCartOutlined style={{ fontSize: '20px', color: ' #cccccc' }} />
					</Badge>
					<div>
						<WrapperTextHeader>Giỏ hàng</WrapperTextHeader>
					</div>
				</WrapperHeaderCart>
			</WrapperHeader>
		</div>
	);
};

export default HeaderComponent;
