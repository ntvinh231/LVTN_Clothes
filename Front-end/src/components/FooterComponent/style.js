import styled from 'styled-components';
import { Layout } from 'antd';

const { Footer } = Layout;

export const StyledFooter = styled(Footer)`
	width: 125%;
	margin-left: -120px;
	padding-top: 14px;
	border-top: 4px solid var(--primary-color);
	margin-top: 20px;
	background-color: #000;
`;

export const StyledText = styled.p`
	color: #fff;
`;

export const StyledLink = styled.a`
	color: #fff;
`;
export const StyledBoldUnderlineText = styled.p`
	color: #fff;
	font-weight: bold;
	display: inline-block;
	padding-bottom: 5px;
	border-bottom: 2px solid #fff;
`;
