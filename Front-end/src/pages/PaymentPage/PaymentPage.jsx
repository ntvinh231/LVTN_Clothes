import React, { useEffect, useState } from 'react';
import * as UserService from '../../service/UserService';
import { LabelText, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import { Form, Radio } from 'antd';
import * as Message from '../../components/Message/Message';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../util';
import { getCartUser, removeAllFromCart, resetCart } from '../../redux/slice/cartSlide';
import * as OrderService from '../../service/OrderService';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { resetUser, updateUser } from '../../redux/slice/userSlide';

const PaymentPage = () => {
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state.user);
	const { state } = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [payment, setPayment] = useState('');
	const [delivery, setDelivery] = useState('fast');
	const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
	const [stateUserDetails, setStateUserDetails] = useState({
		name: '',
		address: '',
		phone: '',
		city: '',
	});
	const token = localStorage.getItem('accessToken');

	useEffect(() => {
		if (user?.id) {
			dispatch(getCartUser(user?.id));
		} else if (!token || token === 'undefined') {
			dispatch(resetCart());
			dispatch(resetUser());
		}
	}, [user, dispatch]);

	useEffect(() => {
		if (!token || token === 'undefined') {
			navigate('/');
			Message.error('Bạn không đăng nhập.Vui lòng đăng nhập lại');
		}
	}, [user]);

	useEffect(() => {
		if (state === null) {
			navigate('/cart');
		}
		localStorage.removeItem('visitedBefore');
	}, [state]);

	const mutationAddOrder = useMutation({
		mutationFn: (data) => OrderService.createOrder(data),
	});

	useEffect(() => {
		if (isOpenModalUpdateInfo) {
			setStateUserDetails({
				name: user?.name,
				address: user?.address,
				phone: user?.phone,
				city: user?.city,
			});
		}
	}, [isOpenModalUpdateInfo]);

	useEffect(() => {
		form.setFieldsValue({
			name: stateUserDetails.name,
			address: stateUserDetails.address,
			phone: stateUserDetails.phone,
			city: stateUserDetails.city,
		});
	}, [form, stateUserDetails]);

	// const priceMemo = useMemo(() => {
	// 	const result = cart?.cartItems?.reduce((total, cur) => {
	// 		return total + cur.price * cur.amount;
	// 	}, 0);
	// 	return result;
	// }, [cart]);

	// const priceDiscountMemo = useMemo(() => {
	// 	const result = cart?.cartItems?.reduce((total, cur) => {
	// 		return total + cur.discount;
	// 	}, 0);
	// 	if (Number(result)) {
	// 		return result;
	// 	}
	// 	return 0;
	// }, [cart]);

	// const diliveryPriceMemo = useMemo(() => {
	// 	const totalPrice = Number(priceMemo) - (Number(priceMemo) * Number(priceDiscountMemo)) / 100;
	// 	if (totalPrice >= 200000 && totalPrice < 500000 && cart?.cartItems.length !== 0) {
	// 		return 10000;
	// 	} else if (totalPrice < 200000 && cart?.cartItems.length !== 0) {
	// 		return 20000;
	// 	} else {
	// 		return 0;
	// 	}
	// }, [priceMemo, priceDiscountMemo, cart]);

	// const totalPriceMemo = useMemo(() => {
	// 	return Number(priceMemo) - (Number(priceMemo) * Number(priceDiscountMemo)) / 100 + Number(diliveryPriceMemo);
	// }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

	const mutationUpdateUser = useMutation({
		mutationFn: (data) => UserService.updateUser(data),
	});

	const { isLoading: isLoadingAddOrder, data: dataAddOrder } = mutationAddOrder;

	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id);
		dispatch(updateUser({ ...res?.data, accessToken: token }));
	};

	useEffect(() => {
		if (dataAddOrder !== undefined) {
			if (dataAddOrder?.statusMessage === 'success') {
				const arrayOrdered = [];
				cart?.cartItems?.forEach((element) => {
					arrayOrdered.push(element.product);
				});
				dispatch(removeAllFromCart({ listChecked: arrayOrdered }));
				Message.success('Đặt hàng thành công');
				navigate('/ordersuccess', {
					state: {
						delivery,
						payment,
						total: cart?.totalCart,
						orders: cart?.cartItems,
						totalPriceMemo: state?.totalPriceMemo,
					},
				});
			} else {
				Message.error(dataAddOrder.message);
			}
		}
	}, [dataAddOrder?.statusMessage]);
	const handlePaymentChange = (e) => {
		setPayment(e.target.value);
	};
	const handleAddOrder = () => {
		if (!token || token === 'undefined') {
			Message.error('Vui lòng chọn phương thức thanh toán');
			navigate('/');
		}
		if (!payment) {
			Message.error('Vui lòng chọn phương thức thanh toán');
			return;
		} else if (
			user?.accessToken &&
			user?.id &&
			cart?.cartItems &&
			user?.name &&
			user?.address &&
			user?.phone &&
			user?.city &&
			state?.priceMemo
		) {
			mutationAddOrder.mutate(
				{
					cartItems: cart?.cartItems,
					fullName: user?.name,
					address: user?.address,
					phone: user?.phone,
					city: user?.city,
					paymentMethod: payment,
					itemsPrice: state?.priceMemo,
					shippingPrice: state?.diliveryPriceMemo,
					totalPrice: state?.totalPriceMemo,
					user: user?.id,
				},
				{
					onSuccess: () => {},
				}
			);
		}
	};

	const handleCancelUpdate = () => {
		setStateUserDetails({
			name: '',
			address: '',
			phone: '',
			city: '',
		});
		form.resetFields();
		setIsOpenModalUpdateInfo(false);
	};

	const handleUpdateInfoUser = () => {
		const { name, phone, address, city } = stateUserDetails;
		if (name && phone && address && city) {
			mutationUpdateUser.mutate(
				{ ...stateUserDetails },
				{
					onSuccess: () => {
						handleGetDetailsUser(user?.id, user?.accessToken);
						setIsOpenModalUpdateInfo(false);
					},
				}
			);
		}
	};

	const handleOnChangeDetails = (e) => {
		setStateUserDetails({
			...stateUserDetails,
			[e.target.name]: e.target.value,
		});
	};

	const handleChangeAddress = () => {
		setIsOpenModalUpdateInfo(true);
	};

	return (
		<div style={{ background: '#fff', with: '100%', height: '100vh' }}>
			<Loading isLoading={isLoadingAddOrder}>
				<div style={{ height: '100%', width: '1270px', margin: '0 auto', padding: '0 26px' }}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<WrapperLeft>
							<WrapperInfo>
								<div>
									<LabelText>Chọn phương thức giao hàng</LabelText>
									<WrapperRadio value={delivery}>
										<Radio value="fast">
											<span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST </span>
											Giao hàng tận nơi (phí vận chuyển tạm tính)
										</Radio>
									</WrapperRadio>
								</div>
							</WrapperInfo>
							<WrapperInfo>
								<div>
									<LabelText>Chọn phương thức thanh toán</LabelText>
									<WrapperRadio onChange={handlePaymentChange} value={payment}>
										<Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
										<Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
									</WrapperRadio>
								</div>
							</WrapperInfo>
						</WrapperLeft>
						<WrapperRight>
							<div style={{ width: '100%' }}>
								<WrapperInfo>
									<div>
										<span>Địa chỉ: </span>
										<span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
										<span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>
											Thay đổi
										</span>
									</div>
								</WrapperInfo>
								<WrapperInfo>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<span>Tạm tính</span>
										<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
											{convertPrice(state?.priceMemo)}
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<span>Giảm giá</span>
										<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
											{state?.priceDiscountMemo}%
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<span>Phí giao hàng</span>
										<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
											{convertPrice(state?.diliveryPriceMemo)}
										</span>
									</div>
								</WrapperInfo>
								<WrapperTotal>
									<span>Tổng tiền</span>
									<span style={{ display: 'flex', flexDirection: 'column' }}>
										<span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
											{convertPrice(state?.totalPriceMemo)}
										</span>
										<span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
									</span>
								</WrapperTotal>
							</div>
							{/* {payment === 'paypal' && sdkReady ? (
								<div style={{ width: '320px' }}>
									<PayPalButton
										amount={Math.round(totalPriceMemo / 30000)}
										// shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
										onSuccess={onSuccessPaypal}
										onError={() => {
											alert('Erroe');
										}}
									/>
								</div>
							) : (*/}
							<ButtonComponent
								onClick={() => handleAddOrder()}
								backgroundHover="#0089ff"
								size={40}
								styleButton={{
									background: 'rgb(255, 57, 69)',
									height: '48px',
									width: '320px',
									border: 'none',
									borderRadius: '4px',
								}}
								textButton={'Đặt hàng'}
								styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
							></ButtonComponent>
							{/* )} */}
						</WrapperRight>
					</div>
				</div>
				<ModalComponent
					title="Cập nhật thông tin giao hàng"
					open={isOpenModalUpdateInfo}
					onCancel={handleCancelUpdate}
					onOk={handleUpdateInfoUser}
				>
					<Loading isLoading={false}>
						<Form
							name="basic"
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							// onFinish={onUpdateUser}
							autoComplete="on"
							form={form}
						>
							<Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
								<InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name" />
							</Form.Item>
							<Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your city!' }]}>
								<InputComponent value={stateUserDetails['city']} onChange={handleOnChangeDetails} name="city" />
							</Form.Item>
							<Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your  phone!' }]}>
								<InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
							</Form.Item>

							<Form.Item
								label="Adress"
								name="address"
								rules={[{ required: true, message: 'Please input your  address!' }]}
							>
								<InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
							</Form.Item>
						</Form>
					</Loading>
				</ModalComponent>
			</Loading>
		</div>
	);
};

export default PaymentPage;
