import React, { useEffect, useState } from 'react';
import { WrapperContainer, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import * as Message from '../../components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { updateUser } from '../../redux/slice/userSlide';

const SignInPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector((state) => state.user);
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user?.id && user?.accessToken) {
			navigate('/');
		}
	}, [user]);

	const mutation = useMutation({
		mutationFn: (data) => UserService.loginUser(data),
	});
	const { data, isLoading } = mutation;

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (data?.statusCode === 201) {
				if (location?.state) {
					navigate(location?.state);
				} else {
					navigate('/');
				}
				if (data?.accessToken) {
					localStorage.setItem('accessToken', JSON.stringify(data?.accessToken));
					const decoded = jwtDecode(data?.accessToken);
					if (decoded?.payload) {
						await handleGetDetailsUser(decoded?.payload, data?.accessToken);
						Message.success('Đăng nhập thành công');
					}
				}
			}
			setLoading(false);
		};

		fetchData();
	}, [data?.statusCode]);

	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id, token);
		await dispatch(updateUser({ ...res?.data, accessToken: token }));
	};

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
		mutation.mutate({
			email,
			password,
		});
	};

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
					height: '350px',
					borderRadius: '6px',
					background: '#fff',
					marginTop: '80px',
					boxShadow: '0 0 6px 0 rgba(0,0,0,0.3',
				}}
			>
				<WrapperContainer>
					<h1>Đăng nhập tài khoản</h1>
					<InputForm
						style={{ marginBottom: '10px' }}
						value={email}
						placeholder="Email"
						onChange={handleOnChangeEmail}
					></InputForm>
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
							value={password}
							placeholder="Password"
							type={isShowPassword ? 'text' : 'password'}
							onChange={handleOnChangePassword}
						></InputForm>
					</div>
					<span style={{ color: 'red', margin: '10px 0 0 4px' }}>{data?.message}</span>
					<Loading isLoading={loading || isLoading}>
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
					</Loading>
					<WrapperTextLight onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</WrapperTextLight>
					<p>
						Chưa có tài khoản <WrapperTextLight onClick={handleNavigateRegister}>Tạo tài khoản?</WrapperTextLight>{' '}
					</p>
				</WrapperContainer>
			</div>
		</div>
	);
};

export default SignInPage;
