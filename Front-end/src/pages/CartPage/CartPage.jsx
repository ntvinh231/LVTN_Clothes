import React, { useEffect, useMemo, useState } from 'react';
import * as UserService from '../../service/UserService';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import cart_empty_background from '../../assets/images/cart_empty_background.webp';
import {
	CustomCheckbox,
	WrapperCountCart,
	WrapperInfo,
	WrapperItemCart,
	WrapperLeft,
	WrapperListCart,
	WrapperRight,
	WrapperStyleEmpty,
	WrapperStyleHeader,
	WrapperStyleHeaderDilivery,
	WrapperTotal,
	labelEmpty,
} from './style';

import { Form } from 'antd';
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

const CartPage = () => {
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
	const onChange = (e) => {
		//Check thêm -> nếu chưa checked(chưa có trong listChecked) thì thêm vào
		//Check bỏ -> nếu đã check(có trong listChecked) thì bỏ ra vào tạo list
		if (listChecked.includes(e.target.value)) {
			const newListChecked = listChecked.filter((item) => item !== e.target.value);
			setListChecked(newListChecked);
		} else {
			setListChecked([...listChecked, e.target.value]);
		}
	};

	const handleOnchangeCheckAll = (e) => {
		if (e.target.checked) {
			const newListChecked = [];
			cart?.cartItems?.forEach((item) => {
				newListChecked.push(item?.product);
			});
			setListChecked(newListChecked);
		} else {
			setListChecked([]);
		}
	};

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

	const handleChangeCount = (type, idProduct, limited) => {
		if (type === 'increase') {
			if (!limited) {
				dispatch(inCreaseAmount({ idProduct }));
			}
		} else {
			if (!limited) {
				dispatch(deCreaseAmount({ idProduct }));
			}
		}
	};
	const handleDeleteCart = (idProduct) => {
		dispatch(removeCart({ idProduct }));
	};

	const handleRemoveAllCart = () => {
		if (listChecked?.length > 0) {
			dispatch(removeAllCart({ listChecked }));
			setListChecked([]);
		}
	};

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
	console.log(user);
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

	return (
		<div style={{ background: '#fff', with: '100%', height: '100vh' }}>
			<div style={{ height: '100%', width: '1215px', margin: '0 auto' }}>
				<h3 style={{ fontWeight: 'bold', marginTop: '10px' }}>Giỏ hàng</h3>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<WrapperLeft>
						{cart?.totalCart > 0 ? <h4>Phí giao hàng</h4> : ''}
						<WrapperStyleHeaderDilivery>
							<WrapperStyleHeaderDilivery
							// items={itemsDelivery}
							// current={
							// 	diliveryPriceMemo === 10000
							// 		? 2
							// 		: diliveryPriceMemo === 20000
							// 		? 1
							// 		: order.orderItemsSlected.length === 0
							// 		? 0
							// 		: 3
							// }
							/>
						</WrapperStyleHeaderDilivery>
						{cart?.totalCart > 0 ? (
							<WrapperStyleHeader>
								<span style={{ display: 'inline-block', width: '400px' }}>
									<CustomCheckbox
										onChange={handleOnchangeCheckAll}
										checked={listChecked?.length === cart?.totalCart}
									></CustomCheckbox>

									<span> Tất cả ({cart.totalCart} sản phẩm)</span>
								</span>
								<div
									style={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<span>Đơn giá</span>
									<span style={{ marginLeft: '50px' }}>Số lượng</span>
									<span style={{ marginLeft: '10px' }}>Thành tiền</span>
									<DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllCart} />
								</div>
							</WrapperStyleHeader>
						) : (
							<WrapperStyleHeader style={{ background: 'rgb(255,255,255)' }}>
								<WrapperStyleEmpty>
									<img src={cart_empty_background} alt="Empty Cart" />
									<span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.2', marginBottom: '1rem' }}>
										Hiện giỏ hàng của bạn không có sản phẩm nào!
									</span>
									<div
										style={{
											cursor: 'pointer',
											borderRadius: '5px',
											borderColor: '#080808',
											border: '2px solid #080808',
											padding: '8px 12px',
											transition: 'background-color 0.3s, color 0.3s',
										}}
										onClick={() => navigate('/product/collections', { state: 'all' })}
										onMouseOver={(e) => {
											e.currentTarget.style.backgroundColor = '#080808';
											e.currentTarget.style.color = '#fff';
										}}
										onMouseOut={(e) => {
											e.currentTarget.style.backgroundColor = 'transparent';
											e.currentTarget.style.color = '#080808';
										}}
									>
										Mua sắm ngay
									</div>
								</WrapperStyleEmpty>
							</WrapperStyleHeader>
						)}
						<WrapperListCart>
							{cart?.cartItems?.map((cart, index, array) => {
								return (
									<WrapperItemCart key={cart?.product} $lastitem={String(index === array.length - 1)}>
										<div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
											<CustomCheckbox
												onChange={onChange}
												value={cart?.product}
												checked={listChecked.includes(cart?.product)}
											></CustomCheckbox>
											<img
												src={cart?.image}
												alt={cart?.name}
												style={{ width: '77px', height: '79px', objectFit: 'cover' }}
											/>
											<div
												style={{
													width: 260,
													overflow: 'hidden',
													// textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													fontWeight: '550',
													marginLeft: '4px',
												}}
											>
												{cart?.name} ({cart?.size.toUpperCase()})
											</div>
										</div>
										<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<span>
												<span style={{ fontSize: '13px', color: '#242424' }}>
													{convertPrice(cart?.price)}(-{cart?.discount}%)
												</span>
											</span>
											<WrapperCountCart>
												<button
													style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
													onClick={() => handleChangeCount('decrease', cart?.product)}
												>
													<MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
												</button>
												<WrapperInputNumber
													defaultValue={cart?.amount}
													value={cart?.amount}
													size="small"
													// min={1}
													// max={cart?.quantity}
												/>
												<button
													style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
													onClick={() => handleChangeCount('increase', cart?.product)}
												>
													<PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
												</button>
											</WrapperCountCart>
											<span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>
												{cart?.price && cart?.amount && convertPrice(cart?.price * cart?.amount)}
											</span>
											<DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteCart(cart?.product)} />
										</div>
									</WrapperItemCart>
								);
							})}
						</WrapperListCart>
					</WrapperLeft>
					<WrapperRight>
						<div style={{ width: '100%' }}>
							<WrapperInfo>
								<div>
									<span>Địa chỉ: </span>
									{/* <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span> */}
									{/* <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>
										Thay đổi
									</span> */}
								</div>
							</WrapperInfo>
							<WrapperInfo>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<span>Tạm tính</span>
									<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<span>Giảm giá</span>
									<span
										style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}
									>{`${priceDiscountMemo} %`}</span>
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
							textButton={'Mua hàng'}
							styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
						></ButtonComponent>
					</WrapperRight>
				</div>
			</div>
			<div>
				<ModalComponent
					style={{ textAlign: 'center' }}
					title="Cập nhật thông tin giao hàng"
					open={isOpenModalUpdateInfo}
					onCancel={handleCancelUpdate}
					onOk={handleUpdateInfoUser}
				>
					<Loading isLoading={isLoading}>
						<Form
							form={form}
							name="basic"
							labelCol={{
								span: 4,
							}}
							wrapperCol={{
								span: 20,
							}}
							// onFinish={onFinishUpdate}

							autoComplete="on"
						>
							<Form.Item
								label="Name"
								name="name"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập họ tên của bạn!',
									},
									{
										pattern: /^[a-zA-Z0-9 ]{1,30}$/,
										message: 'Họ tên không được vượt quá 30 kí tự và chỉ được chứa chữ cái, chữ số, hoặc dấu cách!',
									},
								]}
							>
								<InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name" />
							</Form.Item>
							<Form.Item
								label="Address"
								name="address"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập địa chỉ của bạn!',
									},
								]}
							>
								<InputComponent value={stateUserDetails['address']} onChange={handleOnChangeDetails} name="address" />
							</Form.Item>
							<Form.Item
								label="Phone"
								name="phone"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập số điện thoại của bạn!',
									},
									{
										pattern: /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
										message: 'Vui lòng nhập số điện thoại hợp lệ',
									},
								]}
							>
								<InputComponent value={stateUserDetails['phone']} onChange={handleOnChangeDetails} name="phone" />
							</Form.Item>
							<Form.Item
								label="City"
								name="city"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập thành phố của bạn!',
									},
								]}
							>
								<InputComponent value={stateUserDetails['city']} onChange={handleOnChangeDetails} name="city" />
							</Form.Item>
						</Form>
					</Loading>
				</ModalComponent>
			</div>
		</div>
	);
};

export default CartPage;
