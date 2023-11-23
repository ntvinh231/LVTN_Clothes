import styled from 'styled-components';
import { Col } from 'antd';

export const WrapperProducts = styled.div`
	display: flex;
	justify-content: center;
	gap: 15px;
	flex-wrap: wrap;
`;

export const WrapperNavbar = styled(Col)`
	background: #fff;
	padding: 10px;
	border-radius: 6px;
	height: fit-content;
`;
