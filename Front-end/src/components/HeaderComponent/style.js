import { Row } from 'antd';
import Search from 'antd/es/input/Search';
import styled from 'styled-components';
export const WrapperHeader = styled(Row)`
	padding: 15px 10px;
	background-color: #363636;
	align-items: center;
	cursor: default;
`;

export const WrapperTextHeader = styled.span`
	font-size: 13px;
	color: #cccccc;
	font-weight: 400;
	text-align: left;
	align-items: center;
	padding-left: 10px;
	font-family: 'Roboto', sans-serif;
`;
export const CustomSearch = styled(Search)`
	&& {
		font-size: 13px;
		color: #cccccc;
		font-weight: 400;
		text-align: left;
		padding-left: 30px;
		font-family: 'Roboto', sans-serif;
	}

	&& button {
		background-color: #000; /* Màu nền của nút "Search" */
		color: #fff; /* Màu văn bản của nút "Search" */
	}
`;

export const WrapperHeaderAccount = styled.div`
	display: flex;
	align-items: center;
	font-size: 13px;
	color: #cccccc;
	font-weight: 400;
	margin-left: 40px;
`;

export const WrapperHeaderCart = styled.div`
	display: flex;
	align-items: center;
	font-size: 13px;
	color: #cccccc;
	font-weight: 400;
	margin-left: 30px;
`;
