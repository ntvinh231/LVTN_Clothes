import React, { useEffect, useState } from 'react';
import * as UserService from '../../service/UserService';
import { LabelText, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import { PayPalButton } from 'react-paypal-button-v2';
import { Form, Radio } from 'antd';
import * as Message from '../../components/Message/Message';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice, getCookieValue } from '../../util';
import { getCartUser, removeAllFromCart, resetCart } from '../../redux/slice/cartSlide';
import * as OrderService from '../../service/OrderService';
import * as PaymentService from '../../service/PaymentService';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { resetUser, updateUser } from '../../redux/slice/userSlide';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import * as VoucherService from '../../service/VoucherService';

const PaymentPage = () => {
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state.user);
	const { state } = useLocation();
	const [sdkReady, setSdkReady] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [payment, setPayment] = useState('');
	const [delivery, setDelivery] = useState('fast');
	const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
	const [stateVoucherCode, setStateVoucherCode] = useState('');
	const [stateVoucherDiscount, setStateVoucherDiscount] = useState(1);
	const [totalPriceMemo, setTotalPriceMemo] = useState(state?.totalPriceMemo);

	const [stateUserDetails, setStateUserDetails] = useState({
		name: '',
		address: '',
		phone: '',
		city: '',
	});

	let accessToken = getCookieValue('jwt');
	useEffect(() => {
		if (!accessToken) {
			dispatch(resetCart());
			dispatch(resetUser());
			navigate('/');
			Message.error('Bạn không đăng nhập vui lòng đăng nhập lại');
		} else {
			dispatch(getCartUser(user?.id));
		}
	}, [accessToken]);

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
						totalPriceMemo,
					},
				});
			} else {
				Message.error(dataAddOrder.message);
			}
		}
	}, [dataAddOrder?.statusMessage]);

	const handlePayment = (e) => {
		setPayment(e.target.value);
	};

	const addPaypalScript = async () => {
		const { data } = await PaymentService.getConfig();
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
		script.async = true;
		script.onload = () => {
			setSdkReady(true);
		};
		document.body.appendChild(script);
	};

	useEffect(() => {
		if (!window.paypal) {
			addPaypalScript();
		} else {
			setSdkReady(true);
		}
	}, []);

	const onSuccessPaypal = (details, data) => {
		mutationAddOrder.mutate({
			cartItems: cart?.cartItems,
			fullName: user?.name,
			address: user?.address,
			phone: user?.phone,
			city: user?.city,
			paymentMethod: payment,
			itemsPrice: state?.priceMemo,
			shippingPrice: state?.diliveryPriceMemo,
			totalPrice: totalPriceMemo,
			user: user?.id,
			isPaid: true,
			PaidAt: details.update_time,
			email: user?.email && user?.email,
		});
	};

	const handleAddOrder = () => {
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
					totalPrice: totalPriceMemo,
					user: user?.id,
					email: user?.email && user?.email,
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
	const handleOnChangleVoucherCode = (e) => {
		setStateVoucherCode(e.target.value);
	};

	const mutationAddVoucher = useMutation({
		mutationFn: (data) => VoucherService.getVoucher(data),
	});

	const { data: dataVoucher, isLoading: isLoadingVoucher } = mutationAddVoucher;

	const handleAddVoucherCode = () => {
		mutationAddVoucher.mutate({
			stateVoucherCode,
			totalPrice: state?.totalPriceMemo,
		});
	};

	useEffect(() => {
		if (state?.totalPriceMemo >= dataVoucher?.data?.totalAmount) {
			// Tính giá trị giảm giá và đảm bảo không bao giờ dưới 0
			const discountedPrice = Math.max(state?.totalPriceMemo - dataVoucher?.data?.discountAmount, 0);
			// Set giá trị mới cho totalPriceMemo
			setTotalPriceMemo(discountedPrice);
		}
	}, [dataVoucher]);

	return (
		<>
			<div style={{ background: '#fff', with: '100%', height: '75vh', marginBottom: '200px' }}>
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
										<WrapperRadio onChange={handlePayment} value={payment}>
											<Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
											<Radio value="paypal"> Thanh toán bằng paypal</Radio>
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
										{dataVoucher?.statusMessage === 'success' && !dataVoucher?.statusMessageDetail && (
											<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
												<span style={{ display: 'flex', alignItems: 'center' }}>
													Mã giảm giá
													<div
														style={{
															marginLeft: '4px',
															marginTop: '4px',
															display: 'flex',
															alignItems: 'center',
															gap: '4px',
														}}
													>
														<svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" fill="#338dbc">
															<path d="M14.476 0H8.76c-.404 0-.792.15-1.078.42L.446 7.207c-.595.558-.595 1.463 0 2.022l5.703 5.35c.296.28.687.42 1.076.42.39 0 .78-.14 1.077-.418l7.25-6.79c.286-.268.447-.632.447-1.01V1.43C16 .64 15.318 0 14.476 0zm-2.62 5.77c-.944 0-1.713-.777-1.713-1.732 0-.954.77-1.73 1.714-1.73.945 0 1.714.776 1.714 1.73 0 .955-.768 1.73-1.713 1.73z"></path>
														</svg>
														<span style={{ color: '#338dbc', fontSize: '12px' }}>{dataVoucher?.data?.voucherCode}</span>
													</div>
												</span>

												<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
													- {convertPrice(dataVoucher?.data?.discountAmount)}
												</span>
											</div>
										)}
										<div
											style={{
												marginTop: '10px',
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<div>
												<InputComponent
													value={stateVoucherCode.toUpperCase()}
													onChange={handleOnChangleVoucherCode}
													placeholder={'Mã giảm giá'}
													name="voucherCode"
													style={{
														border: dataVoucher?.statusMessage === 'failed' ? '1px solid red' : '1px solid #d9d9d9',
													}}
												/>
											</div>
											<div>
												<Loading isLoading={isLoadingVoucher}>
													<ButtonComponent
														onClick={() => handleAddVoucherCode()}
														backgroundHover="#0089ff"
														size={40}
														disabled={!stateVoucherCode}
														styleButton={{
															background: stateVoucherCode ? 'rgb(255, 57, 69)' : '#c8c8c8',
															height: '36px',
															width: '102px',
															marginLeft: '10px',
															border: 'none',
															borderRadius: '4px',
														}}
														textButton={'Sử dụng'}
														styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
													></ButtonComponent>
												</Loading>
											</div>
										</div>
										{dataVoucher?.statusMessage === 'failed' && !dataVoucher?.statusMessageDetail ? (
											<span
												style={{
													color: 'red',
													fontSize: '12px',
													marginTop: '5px',
													marginLeft: '4px',
													display: 'block',
												}}
											>
												Không tìm thấy mã giảm giá
											</span>
										) : (
											<span
												style={{
													color: 'red',
													fontSize: '12px',
													marginTop: '5px',
													marginLeft: '4px',
													display: 'block',
												}}
											>
												{dataVoucher?.message}
											</span>
										)}
									</WrapperInfo>
									<WrapperTotal>
										<span>Tổng tiền</span>
										<span style={{ display: 'flex', flexDirection: 'column' }}>
											<span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
												{convertPrice(totalPriceMemo)}
											</span>
											<span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
										</span>
									</WrapperTotal>
								</div>
								{payment === 'paypal' && sdkReady ? (
									<div style={{ width: '320px' }}>
										<PayPalButton
											amount={Math.round(totalPriceMemo / 23500)}
											// shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
											onSuccess={onSuccessPaypal}
											onError={(err) => {
												console.error('failed to load the PayPal JS SDK script', err);
											}}
										/>
									</div>
								) : (
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
								)}
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
								<Form.Item
									label="Phone"
									name="phone"
									rules={[{ required: true, message: 'Please input your  phone!' }]}
								>
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
			<div style={{ marginLeft: '120px', width: '80%' }}>
				<FooterComponent></FooterComponent>
			</div>
		</>
	);
};

export default PaymentPage;
