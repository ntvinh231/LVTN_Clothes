import styled from 'styled-components';
import { Col, InputNumber } from 'antd';

export const WrapperStyleImageProduct = styled.div`
	left: 153px;
	top: 289px;
	height: 345;
	width: 345;
`;

export const WrapperStyleImageSmall = styled(Col)`
	max-height: 100%;
	max-width: 100%;
	width: auto;
	padding: 10px 4px;
`;

export const WrapperStyleNameProduct = styled.h1`
	font-family: 'Roboto', sans-serif;
	color: #333;
	font-size: 30px;
	font-weight: 400;
	margin: 0px 0px 15px;
	line-height: normal;
`;

export const WrapperPriceBox = styled.div`
	margin: 20px 0 0px;
	padding-top: 0px;
	padding-bottom: 5px;
	display: inline-block;
	float: left;
	margin-right: 15px;
`;

export const WraperPriceProduct = styled.span`
	font-family: 'Arial', sans-serif;
	font-weight: 700;
	font-size: 30px;
	color: #363636;
`;

export const WrapperComparePriceProduct = styled.span`
	text-decoration: line-through;
	font-family: 'Arial', sans-serif;
	color: #acacac;
	font-size: 16px;
	font-weight: 400;
	margin-left: 15px;
`;

export const WrapperGroupStatus = styled.div`
	font-family: 'Roboto', sans-serif;
	font-size: 14px;
	margin-bottom: 12px;
	margin-top: 20px;
	width: 100%;
	float: left;
`;

export const WrapperStatusText = styled.span`
	color: #707070;
	display: inline-block;
	float: left;
	line-height: 14px;
	margin-bottom: 10px;
`;

export const WrapperStatusTextName = styled.span`
	display: block;
	padding: 0px 0px 0 0;
	margin: 0px;
	font-family: 'Roboto', sans-serif;
	color: #333;
	font-weight: 400;
	float: left;
	background: #fff;
	line-height: 15px;
`;

export const WrapperStatusTextAvailabel = styled.span`
	font-size: 14px;
	color: #0089ff;
	line-height: 15px;
	padding: 0px 0px 0px 5px;
`;

export const WrapperFormProduct = styled.div`
	padding: 0px;
	width: 100%;
	float: left;
	margin-top: 30px;
`;

export const WrapperHeader = styled.div`
	margin: 0px 0px 20px;
	text-align: left;
	min-width: 100px;
	font-weight: 400;
	font-size: 14px;
	color: #707070;
	font-family: 'Roboto', sans-serif;
`;

export const WrapperInputNumber = styled(InputNumber)`
	&.ant-input-number.ant-input-number-sm {
		width: 40px;
	}
	.ant-input-number-handler-wrap {
		display: none;
	}
`;

export const WrapperQualityProduct = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	border-radius: 4px;
	width: 120px;
	border: 1px solid #ccc;
`;

export const WrapperBtnQualityProduct = styled.button`
	background: transparent;
	border: none;
`;
