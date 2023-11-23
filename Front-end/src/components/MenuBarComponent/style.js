import { Row } from 'antd';

import styled from 'styled-components';

export const WrapperMenuBar = styled(Row)`
	position: fixed;
	position: -webkit-sticky;
	width: 100%;
	background-color: #fff;
	padding: 15px 110px;
	color: #cccccc;
	text-align: center;
	z-index: 1000; /* Đảm bảo header luôn nằm trên cùng của các phần tử khác */
	transition: top 0.2s; /* Áp dụng transition chỉ cho thuộc tính top */
	will-change: top; /* Thông báo cho trình duyệt biết phần tử sẽ thay đổi top */
`;

export const WrapperTextMenuBar = styled.span`
	padding: 10px 30px;
	color: #000000;
	align-items: center;
	cursor: pointer;
	&:hover {
		color: #0089ff;
	}
`;
