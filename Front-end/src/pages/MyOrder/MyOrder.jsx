import React, { useEffect, useState } from 'react';
import cartEmptyBackground from '../../assets/images/cart_empty_background.webp';
import * as message from '../../components/Message/Message';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../util';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import * as OrderService from '../../service/OrderService';
import {
	EmptyOrderWrapper,
	WrapperContainer,
	WrapperFooterItem,
	WrapperHeaderItem,
	WrapperItemOrder,
	WrapperListOrder,
	WrapperStatus,
} from './style';
import { resetUser } from '../../redux/slice/userSlide';

const MyOrder = () => {
	const location = useLocation();
	const { state } = location;
	const user = useSelector((state) => state.user);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = localStorage.getItem('accessToken');

	useEffect(() => {
		if (!token || token === 'undefined') {
			message.error('Bạn không đăng nhập. Vui lòng đăng nhập lại');
			dispatch(resetUser());
			navigate('/');
		}
	}, [user, token]);

	const fetchMyOrder = async () => {
		const res = await OrderService.getOrderByUserId(state?.id);
		return res.data;
	};

	const queryOrder = useQuery(
		{ queryKey: ['orders'], queryFn: fetchMyOrder },
		{
			enabled: state?.id && state?.token,
		}
	);
	const { isLoading, data } = queryOrder;

	const handleDetailsOrder = (id) => {
		navigate(`/order-details/${id}`, {
			state: {
				token: state?.token,
			},
		});
	};

	const mutation = useMutation({
		mutationFn: (data) => {
			const { id, orderItems, userId } = data;
			const res = OrderService.deleteOrder(id, orderItems, userId);
			return res;
		},
	});

	const handleCanceOrder = (order) => {
		const userConfirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng?');
		if (userConfirmed) {
			mutation.mutate(
				{ id: order._id, orderItems: order?.cartOrder, userId: user.id },
				{
					onSuccess: () => {
						queryOrder.refetch();
					},
					onError: (error) => {
						console.error('Error cancelling order:', error);
						alert('Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.');
					},
				}
			);
		}
	};

	const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation;

	useEffect(() => {
		if (isSuccessCancel && dataCancel?.status === 'OK') {
			message.success();
		} else if (isSuccessCancel && dataCancel?.status === 'ERR') {
			message.error(dataCancel?.message);
		} else if (isErrorCancle) {
			message.error();
		}
	}, [isErrorCancle, isSuccessCancel]);

	const renderProduct = (data) => {
		return data?.cartOrder?.map((order) => (
			<WrapperHeaderItem key={order?._id}>
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
						width: 260,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						marginLeft: '10px',
					}}
				>
					<span style={{ color: '#001F5D', fontWeight: '500' }}>
						{order?.name} - {order?.color} ({order?.size.toUpperCase()}) x {order?.amount}
					</span>
				</div>

				<span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
			</WrapperHeaderItem>
		));
	};

	return (
		<Loading isLoading={isLoading}>
			<WrapperContainer>
				<div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
					{Array.isArray(data) && data.length > 0 ? (
						<WrapperListOrder>
							{data.map((order) => (
								<WrapperItemOrder key={order?._id}>
									<WrapperStatus>
										<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
										<div>
											<span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
											<span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>
												{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}
											</span>
										</div>
										<div>
											<span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
											<span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>
												{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
											</span>
										</div>
									</WrapperStatus>
									{renderProduct(order)}
									<WrapperFooterItem>
										<div>
											<span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
											<span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>
												{convertPrice(order?.totalPrice)}
											</span>
										</div>
										<div style={{ display: 'flex', gap: '10px' }}>
											<ButtonComponent
												backgroundHover="#9255FD"
												textHover="#fff"
												onClick={() => handleCanceOrder(order)}
												size={40}
												styleButton={{
													height: '36px',
													border: '1px solid #9255FD',
													borderRadius: '4px',
													transition: 'color 0.3s ease',
												}}
												textButton={'Hủy đơn hàng'}
												styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
											></ButtonComponent>
											<ButtonComponent
												backgroundHover="#9255FD"
												onClick={() => handleDetailsOrder(order?._id)}
												size={40}
												styleButton={{
													height: '36px',
													border: '1px solid #9255FD',
													borderRadius: '4px',
													transition: 'color 0.3s ease',
												}}
												textButton={'Xem chi tiết'}
												styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
											></ButtonComponent>
										</div>
									</WrapperFooterItem>
								</WrapperItemOrder>
							))}
						</WrapperListOrder>
					) : (
						<EmptyOrderWrapper>
							<p>Hiện bạn chưa có đơn hàng nào.</p>
							<img src={cartEmptyBackground} alt="Empty Cart" />
							<ButtonComponent
								backgroundHover="#9255FD"
								textHover="#fff"
								onClick={() => navigate('/product/collections', { state: 'all' })}
								size={40}
								styleButton={{
									height: '36px',
									border: '1px solid #9255FD',
									borderRadius: '4px',
									transition: 'color 0.3s ease',
								}}
								textButton={'Mua sắm ngay'}
								styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
							></ButtonComponent>
						</EmptyOrderWrapper>
					)}
				</div>
			</WrapperContainer>
		</Loading>
	);
};

export default MyOrder;
