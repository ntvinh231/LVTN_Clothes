import styled from 'styled-components';

export const WrapperReportText = styled.div`
	display: flex;
	justify-items: center;
	flex-direction: column;
`;

export const StyleNameProduct = styled.div`
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	white-space: initial;
	overflow: hidden;
	margin: 0 0 5px;
	font-size: 16px;
	font-weight: normal;
	line-height: 1.4;
`;

export const WrapperPriceText = styled.span`
	font-weight: 500;
	font-size: 16px;
	color: #001f5d;
	display: block;
`;

export const WrapperComparePriceText = styled.span`
	color: #666666;
	text-decoration: line-through;
	font-size: 14px;
	display: flex;
	margin-right: 5px;
`;

export const WrapperDiscountText = styled.div`
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #d0021b;
	border-radius: 40%;
	font-weight: 500;
	font-size: 12px;
	width: 38px;
	height: 20px;
	font-weight: 500;
	margin-left: 5px;
`;
