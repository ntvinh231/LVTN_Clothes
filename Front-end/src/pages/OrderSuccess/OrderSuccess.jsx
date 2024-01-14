import React, { useEffect, useMemo, useState } from 'react';
import * as UserService from '../../service/UserService';
import cart_empty_background from '../../assets/images/cart_empty_background.webp';
import { LabelText, WrapperContainer, WrapperInfo, WrapperStyleHeader, WrapperValue } from './style';

import * as Message from '../../components/Message/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../util';
import { getCartUser, resetCart } from '../../redux/slice/cartSlide';
import * as OrderService from '../../service/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import { WrapperItemCart } from '../CartPage/style';
import { orderContant } from '../../contant';

const OrderSuccess = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const { state } = location;
	const token = localStorage.getItem('accessToken');

	useEffect(() => {
		if (state === null) {
			navigate('/payment');
		}
	}, [state]);

	return (
		<div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
			<Loading isLoading={false}>
				<div style={{ height: '100%', width: '1270px', margin: '0 auto', padding: '0 26px' }}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<WrapperContainer>
							<WrapperInfo>
								<div>
									<LabelText>Phương thức giao hàng</LabelText>
									<WrapperValue>
										<span style={{ color: '#ea8500', fontWeight: 'bold' }}>
											{orderContant.delivery[state?.delivery]}
										</span>{' '}
										Giao hàng tiết kiệm
									</WrapperValue>
								</div>
							</WrapperInfo>
							<WrapperInfo>
								<div>
									<LabelText>Phương thức thanh toán</LabelText>
									<WrapperValue>{orderContant.payment[state?.payment]}</WrapperValue>
								</div>
							</WrapperInfo>
							<WrapperInfo>
								<WrapperStyleHeader>
									<span style={{ display: 'inline-block', width: '400px' }}>
										<span style={{ fontWeight: 'bold' }}> Tất cả ({state?.total} sản phẩm)</span>
									</span>
									<div
										style={{
											flex: 1,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Số lượng</span>
										<span style={{ marginRight: '20px', fontWeight: 'bold' }}>Giá tiền</span>
									</div>
								</WrapperStyleHeader>
								{state &&
									state.orders?.map((order, index) => {
										return (
											<WrapperItemCart key={index}>
												<div
													style={{ fontSize: '15px', width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}
												>
													<img
														src={order?.image}
														alt={order?.name}
														style={{ width: '77px', height: '79px', objectFit: 'cover' }}
													/>

													<div
														style={{
															width: 260,
															overflow: 'hidden',
															whiteSpace: 'nowrap',
															fontWeight: '550',
															marginLeft: '4px',
														}}
													>
														{order?.name} - {order.color} ({order?.size?.toUpperCase()})
													</div>
												</div>
												<div
													style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
												>
													<span>
														<span style={{ fontSize: '15px', color: '#242424', marginLeft: '40px' }}>
															{order?.amount}
														</span>
													</span>
													<span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>
														<span style={{ fontSize: '15px', color: '#242424' }}>{convertPrice(order?.price)}</span>
													</span>
												</div>
											</WrapperItemCart>
										);
									})}
							</WrapperInfo>
							<div>
								<span
									style={{ fontSize: '30px', fontWeight: 'bold', color: 'red', float: 'Right', marginRight: '70px' }}
								>
									Tổng tiền: {convertPrice(state?.totalPriceMemo)}
								</span>
							</div>
						</WrapperContainer>
					</div>
				</div>
			</Loading>
		</div>
	);
};

export default OrderSuccess;
