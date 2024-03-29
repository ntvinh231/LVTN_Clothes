import React, { useEffect, useState } from 'react';
import { Col, Image, Row, Radio } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {
	WraperPriceProduct,
	WrapperBtnQualityProduct,
	WrapperComparePriceProduct,
	WrapperFormProduct,
	WrapperGroupStatus,
	WrapperHeader,
	WrapperInputNumber,
	WrapperPriceBox,
	WrapperQualityProduct,
	WrapperStatusTextAvailabel,
	WrapperStatusTextName,
	WrapperStyleImageProduct,
	WrapperStyleImageProductImage,
	WrapperStyleImageSmall,
	WrapperStyleNameProduct,
} from './style';
import * as Message from '../../components/Message/Message';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../service/ProductService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { checkProduct } from '../../redux/slice/checkProductSlide';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToCart, getCartUser, resetCart } from '../../redux/slice/cartSlide';
import { convertPrice, translateColorToVietnamese } from '../../util';
import { resetUser } from '../../redux/slice/userSlide';
import * as message from '../../components/Message/Message';
const ProductDetailsComponent = ({ idProduct }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const cart = useSelector((state) => state.cart);
	const location = useLocation();
	const [nameProduct, setNameProduct] = useState('');
	const [numProduct, setNumProduct] = useState(1);
	const [sizeProduct, setSizeProduct] = useState('S');
	const [arrayColor, setArrayColor] = useState([]);
	const [collectionName, setCollectionName] = useState('Loading...');
	const checkSoldOut = useSelector((state) => state.checkProduct);

	const [selectedColor, setSelectedColor] = useState('');

	const [checkProductDetails, setCheckProductDetails] = useState({
		name: nameProduct,
		size: sizeProduct,
		quantity: numProduct,
		colors_id: '',
		collections_id: '',
	});

	const fetchProductDetails = async (context) => {
		const id = context?.queryKey && context?.queryKey[1];
		const res = await ProductService.getProduct(id);
		setNameProduct(res?.data[0]?.name);
		const res2 = await ProductService.getCollectionProduct(res?.data[0]?.collections_id);
		setCollectionName(res2?.data[0].collections_name);
		const resColors = await ProductService.getAllColorOfProduct({
			name: res?.data[0]?.name,
			collections_id: res?.data[0]?.collections_id,
		});

		setArrayColor(resColors);
		return res.data[0];
	};

	const queryProductDetail = useQuery(['products-details', idProduct], fetchProductDetails, {
		enabled: !!idProduct,
	});
	const { isLoading, data: productDetails } = queryProductDetail;

	const onChangeSize = (e) => {
		setSizeProduct(e.target.value);
		setNumProduct(1);
	};

	const onChangeColor = (e) => {
		setSelectedColor(e.target.value);
	};

	const onChangeNumber = (value) => {
		setNumProduct(Number(value));
	};
	const handleChangeCount = (type) => {
		if (type === 'increase') {
			setNumProduct(numProduct + 1);
		} else if (type === 'decrease') {
			setNumProduct(numProduct - 1);
			if (numProduct <= 1) {
				setNumProduct(1);
			}
		}
	};

	useEffect(() => {
		if (productDetails) {
			handleCheckSoldOut({
				name: nameProduct,
				size: sizeProduct,
				quantity: numProduct,
				colors_id: selectedColor,
				collections_id: productDetails?.collections_id,
			});
		}
	}, [sizeProduct, numProduct, nameProduct, selectedColor]);
	useEffect(() => {
		if (productDetails) {
			handleCheckSoldOut({
				name: nameProduct,
				size: sizeProduct,
				quantity: numProduct,
				collections_id: productDetails?.collections_id,
			});
		}
	}, [productDetails]);
	const mutationCheckProductDetails = useMutation({
		mutationFn: async (data) => {
			try {
				const res = await ProductService.checkProductDetails(data);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	});

	const [isLoadingSoldOut, setIsLoadingSoldOut] = useState(false);
	const handleCheckSoldOut = async (data) => {
		try {
			let newData = data;
			setIsLoadingSoldOut(true);
			if (productDetails?.collections_id) {
				newData = { ...data, collections_id: productDetails?.collections_id };
			}
			const mutationResult = await mutationCheckProductDetails.mutateAsync(newData);
			dispatch(checkProduct(mutationResult && mutationResult?.statusCode));
			setCheckProductDetails(mutationResult);
			setIsLoadingSoldOut(false);
			return newData;
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddCart = async () => {
		if (!isLoadingSoldOut) {
			if (!user?.id || !localStorage.getItem('accessToken') || localStorage.getItem('accessToken') === 'undefined') {
				Message.error('Bạn chưa đăng nhập.Vui lòng đăng nhập');
				dispatch(resetUser());
				navigate('/sign-in', { state: location?.pathname });
			} else {
				if (numProduct < 1) {
					Message.error('Sản phẩm phải lớn hơn 1');
					setNumProduct(1);
				} else if (selectedColor === '') {
					Message.error('Bạn chưa chọn màu sắc');
				} else {
					// Tạo cartItem từ dữ liệu sản phẩm

					const cartItem = {
						name: checkProductDetails?.data && checkProductDetails?.data?.name,
						amount: numProduct,
						image: productDetails?.image,
						price: checkProductDetails?.data && checkProductDetails?.data?.price,
						discount: checkProductDetails?.data && checkProductDetails?.data?.discount,
						size: checkProductDetails?.data && checkProductDetails?.data?.size,
						colors_id: checkProductDetails?.data && checkProductDetails?.data?.colors_id,
						collections_id: checkProductDetails?.data && checkProductDetails?.data?.collections_id,
						collections_name: collectionName,
						product: checkProductDetails?.data && checkProductDetails?.data?._id,
					};

					try {
						dispatch(addToCart({ cartItem }));
					} catch (error) {
						console.error('Lỗi khi thêm vào giỏ hàng:', error);
					}
				}
			}
		}
	};

	return (
		<Loading isLoading={isLoading}>
			<Row style={{ padding: '16px', marginTop: '30px' }}>
				<Col span={10} style={{ padding: '0 16px' }}>
					<WrapperStyleImageProduct>
						<Image
							width={400}
							height={400}
							src={productDetails?.image}
							preview={false}
							alt={productDetails?.name || 'Loading...'}
						/>
					</WrapperStyleImageProduct>
					<div>
						<Row style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
							<WrapperStyleImageSmall span={6}>
								<Image
									width={110}
									height={110}
									src={productDetails?.image}
									alt={productDetails?.name || 'Loading...'}
								/>
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image
									width={110}
									height={110}
									src={productDetails?.image}
									alt={productDetails?.name || 'Loading...'}
								/>
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image
									width={110}
									height={110}
									src={productDetails?.image}
									alt={productDetails?.name || 'Loading...'}
								/>
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image
									width={110}
									height={110}
									src={productDetails?.image}
									alt={productDetails?.name || 'Loading...'}
								/>
							</WrapperStyleImageSmall>
						</Row>
					</div>
				</Col>
				<Col span={14} style={{ padding: '0 16px' }}>
					<WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
					<WrapperGroupStatus>
						<WrapperStatusTextName>Loại:</WrapperStatusTextName>
						<WrapperStatusTextAvailabel>{collectionName}</WrapperStatusTextAvailabel>
					</WrapperGroupStatus>
					<WrapperGroupStatus>
						<WrapperStatusTextName>Tình trạng:</WrapperStatusTextName>
						<WrapperStatusTextAvailabel>
							{checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? 'Còn hàng' : 'Hết hàng'}
						</WrapperStatusTextAvailabel>
					</WrapperGroupStatus>
					{productDetails?.price ? (
						<WrapperPriceBox>
							<WraperPriceProduct>
								{convertPrice(productDetails?.price - (productDetails?.price * productDetails.discount) / 100)}
							</WraperPriceProduct>
							<WrapperComparePriceProduct>{convertPrice(productDetails?.price)}</WrapperComparePriceProduct>
						</WrapperPriceBox>
					) : (
						<WrapperPriceBox>
							<WraperPriceProduct></WraperPriceProduct>
							<WrapperComparePriceProduct></WrapperComparePriceProduct>
						</WrapperPriceBox>
					)}

					<WrapperFormProduct>
						<WrapperHeader>Kích thước</WrapperHeader>
						<Radio.Group onChange={onChangeSize} defaultValue="S" buttonStyle="solid">
							<Radio.Button checked value="S">
								S
							</Radio.Button>
							<Radio.Button value="M">M</Radio.Button>
							<Radio.Button value="L">L</Radio.Button>
							<Radio.Button value="XL">XL</Radio.Button>
						</Radio.Group>
						<WrapperHeader>Màu sắc</WrapperHeader>
						<Radio.Group onChange={onChangeColor} buttonStyle="solid">
							{arrayColor?.data?.map((color) => (
								<Radio.Button key={color.id} value={color.id}>
									{translateColorToVietnamese(color.name)}
								</Radio.Button>
							))}
						</Radio.Group>
						<div style={{ margin: '30px 0' }}>Số lượng:</div>
						<WrapperQualityProduct>
							<WrapperBtnQualityProduct>
								<MinusOutlined
									style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }}
									onClick={() => handleChangeCount('decrease')}
								/>
							</WrapperBtnQualityProduct>
							<WrapperInputNumber value={numProduct} onChange={onChangeNumber} size="small" />
							<WrapperBtnQualityProduct>
								<PlusOutlined
									style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }}
									onClick={() => handleChangeCount('increase')}
								/>
							</WrapperBtnQualityProduct>
						</WrapperQualityProduct>
					</WrapperFormProduct>
					<ButtonComponent
						isLoading={cart.isLoadingAddToCart}
						bordered="false"
						size={40}
						disabled={checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? false : true}
						backgroundHover={checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? '#0089ff' : 'disabled'}
						styleButton={{
							background: 'rgb(255, 57, 69)',
							height: '48px',
							width: '150px',
							border: 'none',
							borderRadius: '4px',
							transition: 'background 0.3s ease',
							margin: '40px 0 10px',
							opacity: checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? 1 : 0.5,
							cursor: checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? 'pointer' : 'default',
						}}
						onClick={handleAddCart}
						textButton={checkSoldOut.statusCode && checkSoldOut.statusCode === 200 ? 'Chọn Mua' : 'Hết hàng'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
				</Col>
			</Row>
		</Loading>
	);
};

export default ProductDetailsComponent;
