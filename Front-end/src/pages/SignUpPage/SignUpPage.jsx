import React, { useEffect, useState } from 'react';
import { WrapperContainer, WrapperTextLight } from '../SignInPage/style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as UserService from '../../service/UserService';
import Loading from '../../components/LoadingComponent/Loading';
import * as Message from '../../components/Message/Message';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
const SignUpPage = () => {
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const frontendHost = window.location.origin;
	const mutation = useMutation({
		mutationFn: (data) => UserService.registerUserTemp(data),
	});
	const { data, isLoading } = mutation;

	useEffect(() => {
		if (data?.statusCode === 200 || data?.statusMessage === 'success') {
			Message.success(data?.message);
			navigate('/sign-in');
		}
	}, [data?.statusCode]);

	const handleOnChangeName = (value) => {
		setName(value);
	};
	const handleOnChangeEmail = (value) => {
		setEmail(value);
	};
	const handleOnChangePassword = (value) => {
		setPassword(value);
	};
	const handleOnChangeConfirmPassword = (value) => {
		setConfirmPassword(value);
	};

	const handleSignUp = () => {
		mutation.mutate({
			name,
			email,
			password,
			confirmPassword,
			frontendHost,
		});
	};
	const navigate = useNavigate();
	const handleNavigateLogin = () => {
		navigate('/sign-in');
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '50px',
				}}
			>
				<div
					style={{
						width: '635px',
						height: '450px',
						borderRadius: '6px',
						background: '#fff',
						marginTop: '80px',
						boxShadow: '0 0 6px 0 rgba(0,0,0,0.3',
					}}
				>
					<WrapperContainer>
						<h1>Đăng ký tài khoản</h1>
						<InputForm style={{ marginBottom: '10px' }} placeholder="Name" onChange={handleOnChangeName}></InputForm>
						<InputForm style={{ marginBottom: '10px' }} placeholder="Email" onChange={handleOnChangeEmail}></InputForm>
						<div style={{ position: 'relative' }}>
							<span
								style={{
									zIndex: 10,
									position: 'absolute',
									top: '4px',
									right: '8px',
									cursor: 'pointer',
								}}
								onClick={() => setIsShowPassword(!isShowPassword)}
							>
								{isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
							</span>
							<InputForm
								style={{ marginBottom: '10px' }}
								placeholder="Password"
								type={isShowPassword ? 'text' : 'password'}
								onChange={handleOnChangePassword}
							></InputForm>
						</div>
						<div style={{ position: 'relative' }}>
							<span
								style={{
									zIndex: 10,
									position: 'absolute',
									top: '4px',
									right: '8px',
									cursor: 'pointer',
								}}
								onClick={() => setIsShowPasswordConfirm(!isShowPasswordConfirm)}
							>
								{isShowPasswordConfirm ? <EyeFilled /> : <EyeInvisibleFilled />}
							</span>
							<InputForm
								placeholder="Confirm password"
								type={isShowPasswordConfirm ? 'text' : 'password'}
								onChange={handleOnChangeConfirmPassword}
							></InputForm>
						</div>
						{data?.statusMessage === 'failed' && (
							<span style={{ color: 'red', margin: '10px 0 0 4px' }}>{data?.message}</span>
						)}
						<Loading isLoading={isLoading}>
							<ButtonComponent
								onClick={handleSignUp}
								disabled={!email.length || !password.length || !confirmPassword.length}
								bordered="false"
								size={40}
								backgroundHover="#0089ff"
								styleButton={{
									background: 'rgb(255,57,69)',
									height: '48px',
									width: '100%',
									border: 'none',
									borderRadius: '4px',
									transition: 'background 0.3s ease',
									margin: '20px 0 10px',
								}}
								textButton={'Đăng Ký'}
								styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
							></ButtonComponent>
						</Loading>
						<p style={{ marginTop: '10px' }}>
							Bạn đã có tài khoản tài khoản <WrapperTextLight onClick={handleNavigateLogin}>Đăng nhập</WrapperTextLight>{' '}
						</p>
					</WrapperContainer>
				</div>
			</div>
			<div style={{ marginLeft: '120px', width: '80%' }}>
				<FooterComponent></FooterComponent>
			</div>
		</>
	);
};

export default SignUpPage;
