import React, { useEffect, useMemo, useState } from 'react';
import * as UserService from '../../service/UserService';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import cart_empty_background from '../../assets/images/cart_empty_background.webp';
import { LabelText, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import { Form, Radio } from 'antd';
import * as Message from '../../components/Message/Message';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../util';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import { deCreaseAmount, inCreaseAmount, removeAllCart, removeCart, selectedCart } from '../../redux/slice/cartSlide';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slice/userSlide';

const PaymentPage = () => {
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [listChecked, setListChecked] = useState([]);
	const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
	const [stateUserDetails, setStateUserDetails] = useState({
		name: '',
		address: '',
		phone: '',
		city: '',
	});

	useEffect(() => {
		dispatch(selectedCart({ listChecked }));
	}, [listChecked]);

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

	const priceMemo = useMemo(() => {
		const result = cart?.cartItemsSelected?.reduce((total, cur) => {
			return total + cur.price * cur.amount;
		}, 0);
		return result;
	}, [cart]);

	const priceDiscountMemo = useMemo(() => {
		const result = cart?.cartItemsSelected?.reduce((total, cur) => {
			return total + cur.discount;
		}, 0);
		if (Number(result)) {
			return result;
		}
		return 0;
	}, [cart]);

	const diliveryPriceMemo = useMemo(() => {
		if (priceMemo > 200000) {
			return 10000;
		} else if (priceMemo === 0) {
			return 0;
		} else {
			return 20000;
		}
	}, [priceMemo]);

	const totalPriceMemo = useMemo(() => {
		return Number(priceMemo) - (Number(priceMemo) * Number(priceDiscountMemo)) / 100 + Number(diliveryPriceMemo);
	}, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

	const mutationUpdateUser = useMutation({
		mutationFn: (data) => UserService.updateUser(data),
	});

	const { isLoading, data } = mutationUpdateUser;

	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id);
		dispatch(updateUser({ ...res?.data, accessToken: token }));
	};
	const handleAddCard = () => {
		if (!cart?.cartItemsSelected?.length) {
			Message.error('Vui lòng chọn sản phẩm');
		} else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
			setIsOpenModalUpdateInfo(true);
		} else {
			console.log('add');
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
		<div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
			<Loading isLoading={isLoading}>
				<div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
					<h3>Thanh toán</h3>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<WrapperLeft>
							<WrapperInfo>
								<div>
									<LabelText>Chọn phương thức giao hàng</LabelText>
									<WrapperRadio>
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
									<WrapperRadio>
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
											{convertPrice(priceMemo)}
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<span>Giảm giá</span>
										<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
											{convertPrice(priceDiscountMemo)}
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<span>Phí giao hàng</span>
										<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
											{convertPrice(diliveryPriceMemo)}
										</span>
									</div>
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
								onClick={() => handleAddCard()}
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
					<Loading isLoading={isLoading}>
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
