import { Checkbox } from 'antd';
import styled from 'styled-components';

export const WrapperStyleHeader = styled.div`
	background: rgb(246, 246, 246);
	padding: 9px 16px;
	border-radius: 4px;
	justify-content: center;
	display: flex;
	align-items: center;
	span {
		color: rgb(36, 36, 36);
		font-weight: 400;
		font-size: 13px;
	}
`;
export const WrapperStyleHeaderDilivery = styled.div`
	background: rgb(255, 255, 255);
	padding: 9px 16px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	span {
		color: rgb(36, 36, 36);
		font-weight: 400;
		font-size: 13px;
	}
	margin-bottom: 4px;
`;

export const WrapperLeft = styled.div`
	width: 910px;
	padding: 0 17px;
`;

export const WrapperListCart = styled.div``;

export const WrapperItemCart = styled.div`
	display: flex;
	align-items: center;
	padding: 9px 16px;
	background: #fff;
	margin-top: 12px;
	border-bottom: ${({ $lastitem }) => ($lastitem === 'true' ? 'none' : '1.6px solid #eee')};
`;

export const WrapperPriceDiscount = styled.span`
	color: #999;
	font-size: 12px;
	text-decoration: line-through;
	margin-left: 4px;
`;
export const WrapperCountCart = styled.div`
	display: flex;
	align-items: center;
	width: 84px;
	border: 1px solid #ccc;
	border-radius: 4px;
`;

export const WrapperRight = styled.div`
	width: 320px;
	margin-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	height: 100%;
	align-items: center;
`;

export const WrapperInfo = styled.div`
	padding: 17px 20px;
	border-bottom: 1px solid #f5f5f5;
	border-top-right-radius: 6px;
	border-top-left-radius: 6px;
	width: 100%;
`;

export const WrapperTotal = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 17px 20px;

	border-bottom-right-radius: 6px;
	border-bottom-left-radius: 6px;
`;

export const CustomCheckbox = styled(Checkbox)`
	.ant-checkbox-checked .ant-checkbox-inner {
		background-color: #9255fd;
		border-color: #9255fd;
	}
	.ant-checkbox:hover .ant-checkbox-inner {
		border-color: #9255fd;
	}
`;

export const WrapperStyleEmpty = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
	flex-direction: column;
`;

export const WrapperVoucher = styled.div`
	border-top: solid 1px #e4e5e7;
	border-bottom: solid 1px #e4e5e7;
	padding-top: 10px;
	padding-bottom: 10px;
	display: flex;
	justify-content: space-between;
`;

export const WrapperVoucherToggle = styled.div`
	cursor: pointer;
	font-size: 14px;
	color: #2e72d2;
	display: flex;
	align-items: center;
	align-content: center;
	line-height: 1;
`;

export const ScrowCoupon = styled.div`
	flex-wrap: wrap;
	overflow: none;
	padding-bottom: 120px;
`;

export const CouponList = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
	gap: 14px;
`;

export const CouponItem = styled.div`
	display: flex;
	color: #001f5d;
	flex-direction: column;
	border-top: 2px solid #eee;
	border-bottom: 2px solid #eee;
	padding: 8px;
	box-shadow: 0px 2px 4px 2px rgba(0, 31, 93, 0.1);
`;
export const CouponHeader = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const CouponBody = styled.div`
	margin-bottom: 0;
	font-size: 14px;
	color: #001f5d;
	font-weight: 900;
`;

export const CouponFooter = styled.div`
	font-size: 30px;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: space-between;
	align-items: center;
`;
