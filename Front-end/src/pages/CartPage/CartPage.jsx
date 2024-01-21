import React, { useEffect, useMemo, useState } from 'react';
import * as UserService from '../../service/UserService';
import { DeleteOutlined, MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import cart_empty_background from '../../assets/images/cart_empty_background.webp';
import {
	CouponBody,
	CouponFooter,
	CouponHeader,
	CouponItem,
	CouponList,
	CustomCheckbox,
	ScrowCoupon,
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
	WrapperVoucher,
	WrapperVoucherToggle,
} from './style';
import * as CartService from '../../service/CartService';
import * as VoucherService from '../../service/VoucherService';
import { Form } from 'antd';
import * as Message from '../../components/Message/Message';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as message from '../../components/Message/Message';

import { convertPrice, getCookieValue } from '../../util';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import {
	decreaseAmountAsync,
	getCartUser,
	increaseAmountAsync,
	removeAllFromCart,
	removeCart,
	removeFromCart,
	resetCart,
} from '../../redux/slice/cartSlide';

import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { resetUser, updateUser } from '../../redux/slice/userSlide';
import StepComponent from '../../components/StepComponent/StepComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent';

const CartPage = () => {
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	let accessToken = getCookieValue('jwt');

	useEffect(() => {
		if (!accessToken) {
			dispatch(resetCart());
			dispatch(resetUser());
			navigate('/');
			message.error('Bạn không đăng nhập vui lòng đăng nhập lại');
		} else {
			dispatch(getCartUser(user?.id));
		}
	}, [accessToken]);

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

	// useEffect(() => {
	// 	dispatch(selectedCart({ listChecked }));
	// }, [listChecked]);

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
				dispatch(increaseAmountAsync({ idProduct }));
			}
		} else {
			if (!limited) {
				dispatch(decreaseAmountAsync({ idProduct }));
			}
		}
	};
	const handleDeleteCart = (idProduct) => {
		dispatch(removeCart({ idProduct }));
	};
	const handleRemoveCartItem = async (idProduct) => {
		try {
			dispatch(removeFromCart({ idProduct }));

			// Lọc các phần tử đã được xóa khỏi listChecked
			const newListChecked = listChecked.filter((item) => item !== idProduct);
			setListChecked(newListChecked);
		} catch (error) {
			console.error('Lỗi khi xóa sản phẩm từ giỏ hàng:', error);
		}
	};

	const handleRemoveAllCart = async () => {
		try {
			if (listChecked?.length > 0) {
				dispatch(removeAllFromCart({ listChecked }));

				setListChecked([]);
			}
		} catch (error) {
			console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
		}
	};

	const priceMemo = useMemo(() => {
		const result = cart?.cartItems?.reduce((total, cur) => {
			return total + cur.price * cur.amount;
		}, 0);
		return result;
	}, [cart]);

	const priceDiscountMemo = useMemo(() => {
		const result = cart?.cartItems?.reduce((total, cur) => {
			return total + cur.discount;
		}, 0);
		if (Number(result)) {
			return result;
		}
		return 0;
	}, [cart]);

	const diliveryPriceMemo = useMemo(() => {
		const totalPrice = Number(priceMemo) - (Number(priceMemo) * Number(priceDiscountMemo)) / 100;
		if (totalPrice >= 200000 && totalPrice < 500000 && cart?.cartItems.length !== 0) {
			return 10000;
		} else if (totalPrice < 200000 && cart?.cartItems.length !== 0) {
			return 20000;
		} else {
			return 0;
		}
	}, [priceMemo, priceDiscountMemo, cart]);

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
		if (cart.cartItems.length < 1) {
			Message.error('Bạn chưa có sản phẩm nào trong giỏ hàng');
		} else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
			setIsOpenModalUpdateInfo(true);
		} else {
			navigate('/payment', {
				state: {
					priceMemo,
					totalPriceMemo,
					priceDiscountMemo,
					diliveryPriceMemo,
				},
			});
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

	const itemsDelivery = [
		{
			title: '20.000 VND',
			description: 'Dưới 200.000 VND',
		},
		{
			title: '10.000 VND',
			description: 'Từ 200.000 VND đến dưới 500.000 VND',
		},
		{
			title: 'Free ship',
			description: 'Trên 500.000 VND',
		},
	];

	const [isOpenDrawerVoucher, setIsOpenDrawerVoucher] = useState(false);

	const handleCancelModalVoucher = () => {
		setIsOpenDrawerVoucher(false);
	};

	const CopyButton = ({ textToCopy, style }) => {
		const [copied, setCopied] = useState(false);

		const handleCopyClick = async () => {
			try {
				await navigator.clipboard.writeText(textToCopy);
				setCopied(true);
				setTimeout(() => {
					setCopied(false);
				}, 3000);
			} catch (err) {
				console.error('Lỗi khi sao chép:', err);
				alert('Lỗi khi sao chép. Vui lòng thử lại!');
			}
		};

		return (
			<button
				style={{
					...style,
					fontSize: '15px',
					cursor: 'pointer',
					borderRadius: '0',
					marginBottom: '0px',
					transition: 'opacity 0.3s',
					opacity: copied ? 0.7 : 1,
				}}
				onClick={handleCopyClick}
			>
				<span
					style={{
						color: '#FFFFFF',
						transition: 'opacity 0.3s, filter 0.3s',
						opacity: '0.95',
					}}
					onMouseOver={(e) => {
						e.target.style.opacity = '1';
					}}
					onMouseOut={(e) => {
						e.target.style.opacity = '0.95';
					}}
				>
					{copied ? 'Đã sao chép' : 'Sao chép'}
				</span>
			</button>
		);
	};

	const fetchAllVoucher = async () => {
		const res = await VoucherService.getAllVoucher();
		return res;
	};
	const queryVoucher = useQuery(['vouchers'], fetchAllVoucher);
	const { isLoading: isLoadingVoucher, data: vouchers } = queryVoucher;

	return (
		<div style={{ background: '#fff', with: '100%', height: '90vh', marginBottom: '100px' }}>
			<div style={{ height: '100%', width: '910px', margin: '0 auto', padding: '0 26px' }}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Loading isLoading={cart?.isLoadingGetCart}>
						<WrapperLeft>
							{cart?.totalCart > 0 ? (
								<>
									<h2 style={{ textAlign: 'center' }}>Phí giao hàng</h2>
									<WrapperStyleHeaderDilivery>
										<StepComponent
											items={itemsDelivery}
											current={
												diliveryPriceMemo === 10000
													? 2
													: diliveryPriceMemo === 20000
													? 1
													: diliveryPriceMemo === 0 && cart?.cartItems?.length !== 0
													? 3
													: 0
											}
										/>
									</WrapperStyleHeaderDilivery>
								</>
							) : (
								''
							)}
							{cart?.totalCart > 0 ? (
								<WrapperStyleHeader>
									<span style={{ display: 'inline-block', width: '400px' }}>
										<CustomCheckbox
											onChange={handleOnchangeCheckAll}
											checked={listChecked?.length === cart?.cartItems.length}
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
												marginRight: '12px',
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
														whiteSpace: 'nowrap',
														fontWeight: '550',
														marginLeft: '4px',
													}}
												>
													{cart?.name} - {cart?.color} ({cart?.size?.toUpperCase()})
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
													<WrapperInputNumber defaultValue={cart?.amount} value={cart?.amount} size="small" />
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
												<DeleteOutlined
													style={{ cursor: 'pointer' }}
													onClick={() => handleRemoveCartItem(cart?.product)}
												/>
											</div>
										</WrapperItemCart>
									);
								})}
							</WrapperListCart>
						</WrapperLeft>
					</Loading>
					<WrapperRight>
						<div style={{ width: '100%' }}>
							<WrapperInfo>
								<div>
									<span>Địa chỉ: </span>
									<span style={{ fontWeight: 'bold' }}>{user?.address} </span>
									<span
										onClick={handleChangeAddress}
										style={{
											color: '#9255FD',
											cursor: 'pointer',
											transition: 'color 0.3s',
										}}
										onMouseOver={(e) => (e.target.style.color = 'red')}
										onMouseOut={(e) => (e.target.style.color = '#9255FD')}
									>
										Thay đổi
									</span>
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
									<span>Voucher</span>
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
							<WrapperVoucher>
								<div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
									<img
										alt="voucher"
										src="https://theme.hstatic.net/1000360022/1001194437/14/coupon-icon.png?v=708"
									></img>
									<span
										style={{ lineHeight: '1', marginLeft: '4px', fontSize: '14px', fontFamily: 'Mulish, sans-serif' }}
									>
										Mã giảm giá
									</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
									<WrapperVoucherToggle onClick={() => setIsOpenDrawerVoucher(true)}>
										<span>Xem tất cả</span>
										<RightOutlined style={{ fontSize: '12px' }} />
									</WrapperVoucherToggle>
								</div>
							</WrapperVoucher>
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
				<DrawerComponent title="Mã giảm giá" open={isOpenDrawerVoucher} onClose={handleCancelModalVoucher} width="23%">
					<Loading isLoading={isLoadingVoucher}>
						<ScrowCoupon>
							{vouchers?.data?.map((voucher) => (
								<CouponList key={voucher._id}>
									<CouponItem>
										<CouponHeader>
											<h3>VOUCHER</h3>
											<h3>Đơn từ {convertPrice(voucher.totalAmount)}</h3>
										</CouponHeader>
										<CouponBody>
											<h1>{convertPrice(voucher.totalAmount)}</h1>
										</CouponBody>
										<CouponFooter>
											<span style={{ fontSize: '16px', fontWeight: 500, color: '#001F5D' }}>
												Nhập mã: {voucher.voucherCode}
											</span>
											<CopyButton
												textToCopy={voucher.voucherCode}
												style={{
													background: '#001F5D',
													border: 'none',
													padding: '4px 8px',
												}}
											/>
										</CouponFooter>
									</CouponItem>
								</CouponList>
							))}
						</ScrowCoupon>
					</Loading>
				</DrawerComponent>
			</div>
			<div style={{ marginLeft: '120px', width: '80%' }}>
				<FooterComponent></FooterComponent>
			</div>
		</div>
	);
};

export default CartPage;
