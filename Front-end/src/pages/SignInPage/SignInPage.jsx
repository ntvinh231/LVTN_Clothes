import React, { useState } from 'react';
import { WrapperContainer, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const SignInPage = () => {
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleShowPassword = () => {
		setIsShowPassword(!isShowPassword);
	};

	const handleOnChangeEmail = (value) => {
		setEmail(value);
	};
	const handleOnChangePassword = (value) => {
		setPassword(value);
	};

	const handleSignIn = () => {
		console.log(email, password);
	};

	const navigate = useNavigate();
	const handleNavigateRegister = () => {
		navigate('/sign-up');
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
					width: '635px',
					height: '312px',
					borderRadius: '6px',
					background: '#fff',
					marginTop: '80px',
					boxShadow: '0 0 6px 0 rgba(0,0,0,0.3',
				}}
			>
				<WrapperContainer>
					<h1>Đăng nhập tài khoản</h1>
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
							onClick={handleShowPassword}
						>
							{isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
						</span>
						<InputForm
							placeholder="Password"
							type={isShowPassword ? 'text' : 'password'}
							onChange={handleOnChangePassword}
						></InputForm>
					</div>
					<ButtonComponent
						onClick={handleSignIn}
						disabled={!email.length || !password.length}
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
							margin: '20px 0 10px',
						}}
						textButton={'Đăng Nhập'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
					<WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
					<p>
						Chưa có tài khoản <WrapperTextLight onClick={handleNavigateRegister}>Tạo tài khoản?</WrapperTextLight>{' '}
					</p>
				</WrapperContainer>
			</div>
		</div>
	);
};

export default SignInPage;
