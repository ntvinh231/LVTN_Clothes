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
	WrapperStyleImageSmall,
	WrapperStyleNameProduct,
} from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../service/ProductService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';

const ProductDetailsComponent = ({ idProduct }) => {
	const [numProduct, setNumProduct] = useState(1);
	const [sizeProduct, setSizeProduct] = useState('S');
	const [checkProductDetails, setCheckProductDetails] = useState({
		id: idProduct,
		size: sizeProduct,
		quantity: numProduct,
	});
	const fetchProductDetails = async (context) => {
		const id = context?.queryKey && context?.queryKey[1];
		const res = await ProductService.getProduct(id);
		return res.data[0];
	};
	const queryProductDetail = useQuery(['products-details', idProduct], fetchProductDetails, {
		enabled: !!idProduct,
	});
	const { isLoading, data: productDetails } = queryProductDetail;

	const onChangeSize = (e) => {
		setSizeProduct(e.target.value);
	};

	const onChangeNumber = (value) => {
		setNumProduct(Number(value));
	};
	const handleChangeCount = (type) => {
		if (type === 'increase') {
			setNumProduct(numProduct + 1);
		} else if (type === 'decrease') {
			setNumProduct(numProduct - 1);
			if (numProduct < 1) {
				setNumProduct(0);
			}
		}
	};

	useEffect(() => {
		handleCheckSoldOut({
			id: idProduct,
			size: sizeProduct,
			quantity: numProduct,
		});
	}, [sizeProduct, numProduct, idProduct]);

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
	const { data: dataCheckProductDetails, isLoading: isLoadingCheck } = mutationCheckProductDetails;

	const handleCheckSoldOut = async (data) => {
		setCheckProductDetails(() => {
			const newData = { ...data };
			mutationCheckProductDetails.mutate(newData, {
				onSettled: () => {
					queryProductDetail.refetch();
				},
			});
			return newData;
		});
	};
	return (
		<Loading isLoading={isLoading}>
			<Row style={{ padding: '16px', marginTop: '30px' }}>
				<Col span={10} style={{ padding: '0 16px' }}>
					<WrapperStyleImageProduct>
						<Image src={productDetails?.image} alt="image product" preview={false} />
					</WrapperStyleImageProduct>
					<div>
						<Row style={{ paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
							<WrapperStyleImageSmall span={6}>
								<Image src={productDetails?.image} alt="image product" preview="false" />
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image src={productDetails?.image} alt="image product" preview="false" />
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image src={productDetails?.image} alt="image product" preview="false" />
							</WrapperStyleImageSmall>
							<WrapperStyleImageSmall span={6}>
								<Image src={productDetails?.image} alt="image product" preview="false" />
							</WrapperStyleImageSmall>
						</Row>
					</div>
				</Col>
				<Col span={14} style={{ padding: '0 16px' }}>
					<WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
					<WrapperGroupStatus>
						<WrapperStatusTextName>Tình trạng:</WrapperStatusTextName>
						<WrapperStatusTextAvailabel>Còn hàng</WrapperStatusTextAvailabel>
					</WrapperGroupStatus>
					<WrapperPriceBox>
						<WraperPriceProduct>{productDetails?.price}</WraperPriceProduct>
						<WrapperComparePriceProduct>{productDetails?.price}</WrapperComparePriceProduct>
					</WrapperPriceBox>

					<WrapperFormProduct>
						<WrapperHeader>Kích thước</WrapperHeader>
						<Radio.Group onChange={onChangeSize} defaultValue="S" buttonStyle="solid">
							<Radio.Button checked value="S">
								S
							</Radio.Button>
							<Radio.Button value="L">L</Radio.Button>
							<Radio.Button value="X">X</Radio.Button>
							<Radio.Button value="XL">XL</Radio.Button>
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
						bordered="false"
						size={40}
						backgroundHover="#0089ff"
						styleButton={{
							background: 'rgb(255, 57, 69)',
							height: '48px',
							width: '150px',
							border: 'none',
							borderRadius: '4px',
							transition: 'background 0.3s ease',
							margin: '40px 0 10px',
							opacity: dataCheckProductDetails?.statusCode !== 200 ? 0.5 : 1,
							cursor: dataCheckProductDetails?.statusCode === 200 ? 'pointer' : 'default',
						}}
						textButton={dataCheckProductDetails?.statusCode === 200 ? 'Chọn Mua' : 'Hết hàng'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
				</Col>
			</Row>
		</Loading>
	);
};

export default ProductDetailsComponent;
