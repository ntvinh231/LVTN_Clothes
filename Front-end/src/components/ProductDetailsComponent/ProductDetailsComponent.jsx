import React from 'react';
import { Col, Image, Row, Radio } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import imageProduct from '../../assets/images/test.webp';
import imageProductSmall1 from '../../assets/images/imageProductSmall1.webp';
import imageProductSmall2 from '../../assets/images/imageProductSmall2.webp';
import imageProductSmall3 from '../../assets/images/imageProductSmall3.webp';
import imageProductSmall4 from '../../assets/images/imageProductSmall4.webp';
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

const ProductDetailsComponent = () => {
	const onChangeSize = (e) => {
		console.log(e.target.value);
	};
	const onChangeNumber = () => {
		// console.log(e.target.value);
	};
	return (
		<Row style={{ padding: '16px', marginTop: '30px' }}>
			<Col span={10} style={{ padding: '0 16px' }}>
				<WrapperStyleImageProduct>
					<Image src={imageProduct} alt="image product" preview={false} />
				</WrapperStyleImageProduct>
				<div>
					<Row style={{ paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
						<WrapperStyleImageSmall span={6}>
							<Image src={imageProductSmall1} alt="image product" preview="false" />
						</WrapperStyleImageSmall>
						<WrapperStyleImageSmall span={6}>
							<Image src={imageProductSmall2} alt="image product" preview="false" />
						</WrapperStyleImageSmall>
						<WrapperStyleImageSmall span={6}>
							<Image src={imageProductSmall3} alt="image product" preview="false" />
						</WrapperStyleImageSmall>
						<WrapperStyleImageSmall span={6}>
							<Image src={imageProductSmall4} alt="image product" preview="false" />
						</WrapperStyleImageSmall>
					</Row>
				</div>
			</Col>
			<Col span={14} style={{ padding: '0 16px' }}>
				<WrapperStyleNameProduct>DREAM TEE - BLACK</WrapperStyleNameProduct>
				<WrapperGroupStatus>
					<WrapperStatusTextName>Tình trạng:</WrapperStatusTextName>
					<WrapperStatusTextAvailabel>Còn hàng</WrapperStatusTextAvailabel>
				</WrapperGroupStatus>
				<WrapperPriceBox>
					<WraperPriceProduct>299.000₫</WraperPriceProduct>
					<WrapperComparePriceProduct>395.000₫</WrapperComparePriceProduct>
				</WrapperPriceBox>

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
					<div style={{ margin: '30px 0' }}>Số lượng:</div>
					<WrapperQualityProduct>
						<WrapperBtnQualityProduct>
							<MinusOutlined style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }} />
						</WrapperBtnQualityProduct>
						<WrapperInputNumber defaultValue={1} onChange={onChangeNumber} size="small" />
						<WrapperBtnQualityProduct>
							<PlusOutlined style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }} />
						</WrapperBtnQualityProduct>
					</WrapperQualityProduct>
				</WrapperFormProduct>
				<ButtonComponent
					bordered="false"
					size={40}
					backgroundHover="#0089ff"
					styleButton={{
						background: 'rgb(255,57,69)',
						height: '48px',
						width: '150px',
						border: 'none',
						borderRadius: '4px',
						transition: 'background 0.3s ease',
						margin: '40px 0 10px',
					}}
					textButton={'Chọn Mua'}
					styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
				></ButtonComponent>
			</Col>
		</Row>
	);
};

export default ProductDetailsComponent;
