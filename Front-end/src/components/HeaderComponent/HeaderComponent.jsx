import {
	CustomSearch,
	WrapperAccount,
	WrapperContentPopup,
	WrapperHeader,
	WrapperHeaderAccount,
	WrapperHeaderCart,
	WrapperTextHeader,
} from './style';
import { Badge, Col } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService';
import { resetUser } from '../../redux/slice/userSlide';
import { useEffect, useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slice/productSlide';
const HeaderComponent = ({ isHiddentSearch = false, isHiddenCart = false }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [userName, setUserName] = useState('');
	const [userAvatar, setUserAvatar] = useState('');
	const cart = useSelector((state) => state.cart);
	const location = useLocation();
	const user = useSelector((state) => state.user);
	const handleNavigateLogin = () => {
		if (!user?.name || !user?.accessToken) navigate('/sign-in');
	};

	const [isLoading, setIsLoading] = useState(false);
	const handleLogout = async () => {
		setIsLoading(true);
		await UserService.loggoutUser();
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		dispatch(resetUser());
		navigate('/');
		setIsLoading(false);
	};
	useEffect(() => {
		setIsLoading(true);
		setUserName(user?.name);
		setUserAvatar(user?.avatar);
		setIsLoading(false);
	}, [user?.name, user?.avatar]);
	const content = user?.email ? (
		<div>
			<WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
			{user.role === 'admin' || user.role === 'superadmin' ? (
				<WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
			) : (
				<></>
			)}

			<WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
		</div>
	) : null;

	const onSearch = (e) => {
		setSearch(e.target.value);
		dispatch(searchProduct(e.target.value));
	};

	useEffect(() => {
		dispatch(searchProduct(''));
		setSearch('');
	}, [location.pathname]);

	return (
		<div>
			<WrapperHeader
				id="header"
				style={{ justifyContent: isHiddenCart && isHiddentSearch ? 'space-between' : 'unset' }}
			>
				<Col span={3} offset={2}>
					<WrapperTextHeader>Hotline: 0379488746</WrapperTextHeader>
				</Col>
				{!isHiddentSearch && (
					<Col span={12} style={{ marginRight: '40px' }}>
						<CustomSearch value={search} placeholder="Nhập sản phẩm cần tìm" enterButton onChange={onSearch} />
					</Col>
				)}
				<Loading isLoading={isLoading}>
					<WrapperHeaderAccount
						onClick={handleNavigateLogin}
						span={5}
						offset={2}
						style={{ display: 'flex', cursor: 'pointer', marginRight: isHiddenCart && isHiddentSearch ? '340px' : '0' }}
					>
						<>
							<WrapperAccount content={content} trigger="click">
								{userAvatar ? (
									<img
										src={userAvatar}
										style={{
											height: '30px',
											width: '30px',
											borderRadius: '50%',
											objectFit: 'cover',
										}}
										alt="avatar"
									></img>
								) : (
									<UserOutlined style={{ fontSize: '20px' }} />
								)}

								{user?.accessToken && user?.id ? (
									<div style={{ cursor: 'pointer', marginLeft: '5px' }}>{userName || 'User' || user?.email}</div>
								) : (
									<div>
										<WrapperTextHeader>Đăng nhập/Đăng ký</WrapperTextHeader>
									</div>
								)}
							</WrapperAccount>
						</>
					</WrapperHeaderAccount>
				</Loading>
				{!isHiddenCart && (
					<WrapperHeaderCart onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
						<Badge count={cart?.totalCart} size="small">
							<ShoppingCartOutlined style={{ fontSize: '20px', color: ' #cccccc' }} />
						</Badge>
						<div>
							<WrapperTextHeader>Giỏ hàng</WrapperTextHeader>
						</div>
					</WrapperHeaderCart>
				)}
			</WrapperHeader>
		</div>
	);
};

export default HeaderComponent;
