import React, { useEffect, useState } from 'react';
import { WrapperContainer, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import * as Message from '../../components/Message/Message';

const ForgotPasswordPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const frontendHost = window.location.origin;

	const mutation = useMutation({
		mutationFn: (email) => UserService.forgotPassword(email, frontendHost),
	});
	const { data, isLoading } = mutation;

	useEffect(() => {
		const fetchData = async () => {
			if (data?.statusMessage && data?.statusMessage === 'failed') {
				Message.error(data?.message);
			} else if (data?.statusMessage && data?.statusMessage === 'success') {
				Message.success(data?.message);
			}
		};

		fetchData();
	}, [data?.statusMessage]);

	const handleOnChangeEmail = (value) => {
		setEmail(value);
	};

	const handleForgotPassword = () => {
		mutation.mutate(email);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<div
				style={{
					width: '405px',
					height: '250px',
					borderRadius: '6px',
					background: '#fff',
					marginTop: '80px',
					boxShadow: '0 0 6px 0 rgba(0,0,0,0.3',
				}}
			>
				<WrapperContainer>
					<h1>Quên mật khẩu</h1>
					<InputForm
						style={{ marginBottom: '10px' }}
						value={email}
						placeholder="Nhập email của bạn"
						onChange={handleOnChangeEmail}
					></InputForm>

					<Loading isLoading={isLoading}>
						<ButtonComponent
							onClick={handleForgotPassword}
							disabled={!email.length}
							bordered="false"
							size={40}
							backgroundHover="#0089ff"
							styleButton={{
								background: 'rgb(255, 57, 69)',
								height: '48px',
								width: '100%',
								border: 'none',
								borderRadius: '4px',
								transition: 'background 0.3s ease',
								margin: '6px 0 10px',
							}}
							textButton={'Đặt lại mật khẩu'}
							styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
						></ButtonComponent>
					</Loading>
					<WrapperTextLight onClick={() => navigate('/sign-in')}>Trở đăng nhập</WrapperTextLight>
				</WrapperContainer>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
