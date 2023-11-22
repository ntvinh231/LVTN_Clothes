import React, { useState } from 'react';
import { WrapperContainer, WrapperTextLight } from '../SignInPage/style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
const SignUpPage = () => {
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0,0,0,0.53)',
				height: '80vh',
			}}
		>
			<div style={{ width: '635px', height: '350px', borderRadius: '6px', background: '#fff' }}>
				<WrapperContainer>
					<h1>Đăng nhập tài khoản</h1>
					<InputForm style={{ marginBottom: '10px' }} placeholder="Email"></InputForm>
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
						<InputForm placeholder="Confirm password" type={isShowPasswordConfirm ? 'text' : 'password'}></InputForm>
					</div>
					<ButtonComponent
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
						textButton={'Đăng Nhập'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
					<WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
					<p>
						Bạn đã có tài khoản tài khoản <WrapperTextLight>Đăng nhập</WrapperTextLight>{' '}
					</p>
				</WrapperContainer>
			</div>
		</div>
	);
};

export default SignUpPage;
