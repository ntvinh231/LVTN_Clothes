import React from 'react';
import {
	CustomCheckbox,
	WrapperInfo,
	WrapperLeft,
	WrapperListCart,
	WrapperRight,
	WrapperStyleHeader,
	WrapperStyleHeaderDilivery,
	WrapperTotal,
} from './style';

import { Checkbox, Form } from 'antd';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { DeleteOutlined } from '@ant-design/icons';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import Loading from '../../components/LoadingComponent/Loading';
import { useNavigate } from 'react-router-dom';
const CartPage = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const handleRemoveAllOrder = () => {};
	const isOpenModalUpdateInfo = () => {};
	const handleCancleUpdate = () => {};
	const handleUpdateInforUser = () => {};

	return (
		<div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
			<div style={{ height: '100%', width: '1215px', margin: '0 auto' }}>
				<h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<WrapperLeft>
						<h4>Phí giao hàng</h4>
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
						<WrapperStyleHeader>
							<span style={{ display: 'inline-block', width: '390px' }}>
								<CustomCheckbox
								// onChange={handleOnchangeCheckAll}
								// checked={listChecked?.length === order?.orderItems?.length}
								></CustomCheckbox>
								{/* <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span> */}
								<span> Tất cả sản phẩm</span>
							</span>
							<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<span>Đơn giá</span>
								<span>Số lượng</span>
								<span>Thành tiền</span>
								<DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
							</div>
						</WrapperStyleHeader>
						<WrapperListCart>
							{/* {order?.orderItems?.map((order) => {
								return (
									<WrapperItemOrder key={order?.product}>
										<div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
											<CustomCheckbox
												onChange={onChange}
												value={order?.product}
												checked={listChecked.includes(order?.product)}
											></CustomCheckbox>
											<img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
											<div
												style={{
													width: 260,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
												}}
											>
												{order?.name}
											</div>
										</div>
										<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<span>
												<span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
											</span>
											<WrapperCountOrder>
												<button
													style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
													onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}
												>
													<MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
												</button>
												<WrapperInputNumber
													defaultValue={order?.amount}
													value={order?.amount}
													size="small"
													min={1}
													max={order?.countInstock}
												/>
												<button
													style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
													onClick={() =>
														handleChangeCount(
															'increase',
															order?.product,
															order?.amount === order.countInstock,
															order?.amount === 1
														)
													}
												>
													<PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
												</button>
											</WrapperCountOrder>
											<span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>
												{convertPrice(order?.price * order?.amount)}
											</span>
											<DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
										</div>
									</WrapperItemOrder>
								);
							})} */}
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
									{/* <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span> */}
								</div>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<span>Giảm giá</span>
									{/* <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
										{convertPrice(priceDiscountMemo)}
									</span> */}
								</div>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<span>Phí giao hàng</span>
									<span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
										{/* {convertPrice(diliveryPriceMemo)} */}
									</span>
								</div>
							</WrapperInfo>
							<WrapperTotal>
								<span>Tổng tiền</span>
								<span style={{ display: 'flex', flexDirection: 'column' }}>
									<span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
										{/* {convertPrice(totalPriceMemo)} */}
									</span>
									<span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
								</span>
							</WrapperTotal>
						</div>
						<ButtonComponent
							// onClick={() => handleAddCard()}
							size={40}
							styleButton={{
								background: 'rgb(255, 57, 69)',
								height: '48px',
								width: '320px',
								border: 'none',
								borderRadius: '4px',
							}}
							textbutton={'Mua hàng'}
							styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
						></ButtonComponent>
					</WrapperRight>
				</div>
			</div>
			{/* <ModalComponent
				title="Cập nhật thông tin giao hàng"
				open={isOpenModalUpdateInfo}
				onCancel={handleCancleUpdate}
				onOk={handleUpdateInforUser}
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
							<InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
						</Form.Item>
						<Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your city!' }]}>
							<InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
						</Form.Item>
						<Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your  phone!' }]}>
							<InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
						</Form.Item>

						<Form.Item
							label="Adress"
							name="address"
							rules={[{ required: true, message: 'Please input your  address!' }]}
						>
							<InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
						</Form.Item>
					</Form>
				</Loading>
			</ModalComponent> */}
		</div>
	);
};

export default CartPage;
