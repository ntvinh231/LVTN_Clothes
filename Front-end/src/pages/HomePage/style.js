import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

export const WrapperTypeProduct = styled.div`
	display: flex;
	align-items: center;
	gap: 24px;
	justify-content: flex-start;
	height: 44px;
	&:hover {
		color: #fff;
		background: #9255fd;
		span {
			color: #fff;
		}
	}
	width: 100px;
	color: #9255fd;
	text-align: center;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const WrapperMore = styled.div`
	text-align: center;
	&:hover {
		color: #fff;
		background: #0089ff;
		span {
			color: #fff;
		}
	}
	width: 100px;
	height: 32px;
	line-height: 32px;
	color: #fff;
	background-color: #ed1c24;
	text-align: center;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const WrapperButtonMore = styled(ButtonComponent)`
	&:hover {
		color: #fff;
		background: #9255fd;
		span {
			color: #fff;
		}
	}
	width: 100px;
	color: #9255fd;
	text-align: center;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const WrapperProducts = styled.div`
	display: flex;
	gap: 14px;
	margin-top: 20px;
	flex-wrap: wrap;
`;
