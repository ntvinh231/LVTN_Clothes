import {
	CustomSearch,
	WrapperContentPopup,
	WrapperHeader,
	WrapperHeaderAccount,
	WrapperHeaderCart,
	WrapperTextHeader,
} from './style';
import { Badge, Col, Popover } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService';
import { resetUser } from '../../redux/slice/userSlide';
import { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
const HeaderComponent = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const handleNavigateLogin = () => {
		navigate('/sign-in');
	};

	const [isLoading, setIsLoading] = useState(false);
	const handleLoggout = async () => {
		setIsLoading(true);
		await UserService.loggoutUser();
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		dispatch(resetUser());
		setIsLoading(false);
	};
	const content = (
		<div>
			<WrapperContentPopup onClick={handleLoggout}>Đăng xuất</WrapperContentPopup>
			<WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
		</div>
	);
	return (
		<div>
			<WrapperHeader id="header">
				<Col span={3} offset={2}>
					<WrapperTextHeader>Hotline: 0379488746</WrapperTextHeader>
				</Col>
				<Col span={12} style={{ marginRight: '40px' }}>
					<CustomSearch
						placeholder="Nhập sản phẩm cần tìm" //onSearch={onSearch}
						enterButton
					/>
				</Col>
				<Loading isLoading={isLoading}>
					<WrapperHeaderAccount span={5} offset={2} style={{ cursor: 'pointer' }}>
						<UserOutlined style={{ fontSize: '20px' }} />
						{user?.name ? (
							<>
								<Popover content={content} trigger="click">
									<div style={{ cursor: 'pointer' }}>{user.name}</div>
								</Popover>
							</>
						) : (
							<div onClick={handleNavigateLogin}>
								<WrapperTextHeader>Đăng nhập/Đăng ký</WrapperTextHeader>
							</div>
						)}
					</WrapperHeaderAccount>
				</Loading>
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
