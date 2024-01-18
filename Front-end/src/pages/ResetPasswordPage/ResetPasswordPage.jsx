import React, { useEffect, useState } from 'react';
import { WrapperContainer, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import * as Message from '../../components/Message/Message';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
const ResetPasswordPage = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);
	const { token } = useParams();

	const mutation = useMutation({
		mutationFn: (data) => UserService.resetPassword(data, token),
	});
	const { data, isLoading } = mutation;

	useEffect(() => {
		const fetchData = async () => {
			if (data?.statusMessage && data?.statusMessage === 'failed') {
				Message.error(data?.message);
			} else if (data?.statusMessage && data?.statusMessage === 'success') {
				Message.success(data?.message);
				navigate('/');
			}
		};

		fetchData();
	}, [data?.statusMessage]);

	const handleOnChangePassword = (value) => {
		setPassword(value);
	};

	const handleOnChangePasswordConfirm = (value) => {
		setPasswordConfirm(value);
	};
	const handleResetPassword = () => {
		if (token) {
			mutation.mutate({
				password,
				passwordConfirm,
			});
		}
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
					height: '300px',
					borderRadius: '6px',
					background: '#fff',
					marginTop: '80px',
					boxShadow: '0 0 6px 0 rgba(0,0,0,0.3',
				}}
			>
				<WrapperContainer>
					<h1>Đổi mật khẩu</h1>
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
							value={password}
							placeholder="Nhập mật khẩu mới"
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
							style={{ marginBottom: '10px' }}
							value={passwordConfirm}
							placeholder="Nhập lại mật khẩu mới"
							type={isShowPasswordConfirm ? 'text' : 'password'}
							onChange={handleOnChangePasswordConfirm}
						></InputForm>
					</div>
					<Loading isLoading={isLoading}>
						<ButtonComponent
							onClick={handleResetPassword}
							disabled={!password.length || !passwordConfirm.length}
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

export default ResetPasswordPage;
