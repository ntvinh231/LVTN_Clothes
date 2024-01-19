import React from 'react';
import {
	WrapperAllPrice,
	WrapperContentInfo,
	WrapperHeaderUser,
	WrapperInfoUser,
	WrapperItem,
	WrapperItemLabel,
	WrapperLabel,
	WrapperNameProduct,
	WrapperProduct,
	WrapperStyleContent,
} from './style';
import * as message from '../../components/Message/Message';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as OrderService from '../../service/OrderService';
import { useQuery } from '@tanstack/react-query';
import { orderContant } from '../../contant';
import { convertPrice, getCookieValue } from '../../util';
import { useMemo } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { resetUser } from '../../redux/slice/userSlide';
import { resetCart } from '../../redux/slice/cartSlide';

const DetailsOrder = () => {
	const params = useParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const { id } = params;

	let accessToken = getCookieValue('jwt');
	useEffect(() => {
		if (!accessToken) {
			dispatch(resetCart());
			dispatch(resetUser());
			navigate('/');
			message.error('Bạn không đăng nhập vui lòng đăng nhập lại');
		}
	}, [accessToken]);

	const fetchDetailsOrder = async () => {
		const res = await OrderService.getDetailsOrder(id);
		return res.data;
	};

	const queryOrder = useQuery(
		{ queryKey: ['orders-details'], queryFn: fetchDetailsOrder },
		{
			enabled: id,
		}
	);
	const { isLoading, data } = queryOrder;

	const priceMemo = useMemo(() => {
		const result = data?.cartOrder?.reduce((total, cur) => {
			return total + cur.price * cur.amount;
		}, 0);
		return result;
	}, [data]);

	return (
		<Loading isLoading={isLoading}>
			<div style={{ width: '100%', background: '#f5f5fa', padding: '0 50px' }}>
				<div style={{ width: '1135px', margin: '0 auto', padding: '0 32px' }}>
					<WrapperHeaderUser>
						<WrapperInfoUser>
							<WrapperLabel>Địa chỉ người nhận</WrapperLabel>
							<WrapperContentInfo>
								<div className="name-info">{data?.shippingAddress?.fullName}</div>
								<div className="address-info">
									<span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
								</div>
								<div className="phone-info">
									<span>Điện thoại: </span> {data?.shippingAddress?.phone}
								</div>
							</WrapperContentInfo>
						</WrapperInfoUser>
						<WrapperInfoUser>
							<WrapperLabel>Hình thức giao hàng</WrapperLabel>
							<WrapperContentInfo>
								<div className="delivery-info">
									<span className="name-delivery">FAST </span>Giao hàng tiết kiệm
								</div>
								<div className="delivery-fee">
									<span>Phí giao hàng: </span> {data?.shippingPrice}
								</div>
							</WrapperContentInfo>
						</WrapperInfoUser>
						<WrapperInfoUser>
							<WrapperLabel>Hình thức thanh toán</WrapperLabel>
							<WrapperContentInfo>
								<div className="payment-info">{orderContant.payment[data?.paymentMethod]}</div>
								<div className="status-payment">{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
							</WrapperContentInfo>
						</WrapperInfoUser>
					</WrapperHeaderUser>
					<WrapperStyleContent>
						<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ width: '670px' }}>Sản phẩm</div>
							<WrapperItemLabel>Giá</WrapperItemLabel>
							<WrapperItemLabel style={{ marginRight: '45px' }}>Số lượng</WrapperItemLabel>
							<WrapperItemLabel>Giảm giá</WrapperItemLabel>
						</div>
						{data?.cartOrder?.map((order) => {
							return (
								<WrapperProduct key={order._id}>
									<WrapperNameProduct>
										<img
											src={order?.image}
											alt={order?.name}
											style={{
												width: '70px',
												height: '70px',
												objectFit: 'cover',
												border: '1px solid rgb(238, 238, 238)',
												padding: '2px',
											}}
										/>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												width: 260,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												marginLeft: '10px',
												height: '70px',
											}}
										>
											<span style={{ color: '#001F5D', fontWeight: '500' }}>
												{order?.name} ({order?.size.toUpperCase()})
											</span>
										</div>
									</WrapperNameProduct>
									<WrapperItem>{convertPrice(order?.price)}</WrapperItem>
									<WrapperItem style={{ marginLeft: '30px' }}>{order?.amount}</WrapperItem>
									<WrapperItem>
										{order?.discount ? convertPrice((priceMemo * order?.discount) / 100) : '0 VND'}
									</WrapperItem>
								</WrapperProduct>
							);
						})}

						<WrapperAllPrice>
							<WrapperItemLabel>Tạm tính</WrapperItemLabel>
							<WrapperItem>
								<span style={{ marginLeft: '10px' }}>{convertPrice(priceMemo)}</span>
							</WrapperItem>
						</WrapperAllPrice>
						<WrapperAllPrice>
							<WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
							<WrapperItem>
								<span style={{ marginLeft: '10px' }}>{convertPrice(data?.shippingPrice)}</span>
							</WrapperItem>
						</WrapperAllPrice>
						<WrapperAllPrice>
							<WrapperItemLabel>Tổng cộng</WrapperItemLabel>
							<WrapperItem>
								<WrapperItem>
									<span style={{ marginLeft: '10px' }}>{convertPrice(data?.totalPrice)}</span>
								</WrapperItem>
							</WrapperItem>
						</WrapperAllPrice>
					</WrapperStyleContent>
				</div>
			</div>
		</Loading>
	);
};

export default DetailsOrder;
