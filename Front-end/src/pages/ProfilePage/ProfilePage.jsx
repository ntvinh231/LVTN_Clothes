import React, { useEffect, useState } from 'react';
import {
	WrapperContentProfile,
	WrapperHeader,
	WrapperInput,
	WrapperInputFile,
	WrapperLabel,
	WrapperLabelChangePass,
	WrapperUploadFile,
} from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService';
import { useMutation } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { Button, Upload, message } from 'antd';
import { resetUser, updateUser } from '../../redux/slice/userSlide';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { deleteCookie, getBase64, getCookieValue } from '../../util';

const ProfilePage = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [name, setName] = useState(user?.name);
	const [email, setEmail] = useState(user?.email);
	const [phone, setPhone] = useState(user?.phone);
	const [address, setAddress] = useState(user?.address);
	const [avatar, setAvatar] = useState(user?.avatar);
	const [city, setCity] = useState(user?.city);
	const [isLoading, setIsLoading] = useState(false);

	const mutation = useMutation({
		mutationFn: (data) => UserService.updateUser(data),
	});
	const dispatch = useDispatch();
	const { data } = mutation;

	let accessToken = getCookieValue('jwt');
	useEffect(() => {
		if (!accessToken) {
			dispatch(resetUser());
			navigate('/');
			message.error('Bạn không đăng nhập vui lòng đăng nhập lại');
		}
	}, [accessToken]);

	useEffect(() => {
		setName(user?.name);
		setEmail(user?.email);
		setPhone(user?.phone);
		setAddress(user?.address);
		setCity(user?.city);
		setAvatar(user?.avatar);
	}, [user]);
	useEffect(() => {
		setIsLoading(true);
		if (data?.statusCode === 200) {
			message.success('Cập nhật thành công');
			handleGetDetailsUser(user?.id, user?.accessToken);
		}
		if (data?.statusCode === 400) {
			message.error(data?.message);
			handleGetDetailsUser(user?.id, user?.accessToken);
		}
		setIsLoading(false);
	}, [data?.statusCode]);

	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id);
		dispatch(updateUser({ ...res?.data, accessToken: token }));
	};
	const handleOnChangeName = (value) => {
		setName(value);
	};
	const handleOnChangeEmail = (value) => {
		setEmail(value);
	};

	const handleOnChangePhone = (value) => {
		setPhone(value);
	};
	const handleOnChangeAddress = (value) => {
		setAddress(value);
	};
	const handleOnChangeCity = (value) => {
		setCity(value);
	};

	const handleOnchangeAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setAvatar(file.preview);
	};
	const handleUpdate = () => {
		mutation.mutate({
			name,
			email,
			phone,
			address,
			avatar,
			city,
		});
	};

	const [oldPass, setOldPass] = useState('');
	const [newPass, setNewPass] = useState('');
	const [newPassConfirm, setNewPassConfirm] = useState('');

	const handleOnChangeOldPass = (value) => {
		setOldPass(value);
	};
	const handleOnChangeNewPass = (value) => {
		setNewPass(value);
	};
	const handleOnChangeNewPassConfirm = (value) => {
		setNewPassConfirm(value);
	};

	const mutationUpdatePassword = useMutation({
		mutationFn: (data) => UserService.updatePassword(data),
	});
	const handleChangePassword = () => {
		mutationUpdatePassword.mutate({
			oldPass,
			newPass,
			newPassConfirm,
		});
	};
	const { data: dataPassword } = mutationUpdatePassword;

	useEffect(() => {
		setIsLoading(true);
		if (dataPassword?.statusCode === 200) {
			message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại');
			deleteCookie('jwt');
			deleteCookie('jwtR');
			dispatch(resetUser());
			navigate('/');
		}
		if (dataPassword?.statusCode === 401) {
			message.error(dataPassword?.message);
		}
		setIsLoading(false);
	}, [dataPassword?.statusCode]);

	return (
		<div style={{ width: '100%', margin: '0 auto', height: '1000px' }}>
			<WrapperHeader>THÔNG TIN NGƯỜI DÙNG</WrapperHeader>
			<Loading isLoading={isLoading}>
				<WrapperContentProfile>
					<WrapperInput>
						<WrapperLabel htmlFor="name">Name</WrapperLabel>
						<InputForm
							style={{ width: '300px' }}
							placeholder="Name"
							value={name}
							onChange={handleOnChangeName}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabel htmlFor="email">Email</WrapperLabel>
						<InputForm
							style={{ width: '300px' }}
							placeholder="Email"
							value={email}
							onChange={handleOnChangeEmail}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabel htmlFor="phone">Phone</WrapperLabel>
						<InputForm
							style={{ width: '300px' }}
							placeholder="Phone"
							value={phone}
							onChange={handleOnChangePhone}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabel htmlFor="address">Address</WrapperLabel>
						<InputForm
							style={{ width: '300px' }}
							placeholder="Email"
							value={address}
							onChange={handleOnChangeAddress}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabel htmlFor="city">City</WrapperLabel>
						<InputForm
							style={{ width: '300px' }}
							placeholder="Email"
							value={city}
							onChange={handleOnChangeCity}
						></InputForm>
					</WrapperInput>
					<WrapperInputFile>
						<WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
							<Button icon={<UploadOutlined />}>Select Avatar</Button>
						</WrapperUploadFile>
						{avatar && (
							<img
								src={avatar}
								style={{
									height: '50px',
									width: '50px',
									borderRadius: '50%',
									objectFit: 'cover',
								}}
								alt="avatar"
							/>
						)}
						{/* <InputForm
							style={{ width: '300px' }}
							placeholder="Avatar"
							value={avatar}
							onChange={handleOnChangeAvatar}
						></InputForm> */}
					</WrapperInputFile>
					<ButtonComponent
						onClick={handleUpdate}
						bordered="false"
						size={40}
						backgroundHover="#0089ff"
						styleButton={{
							background: 'rgb(255,57,69)',
							height: '30px',
							width: 'fit-content',
							border: 'none',
							borderRadius: '4px',
							transition: 'background 0.3s ease',
							padding: '2px 6px 6px',
						}}
						textButton={'Cập nhật'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
				</WrapperContentProfile>
			</Loading>
			<WrapperHeader>Đổi mật khẩu</WrapperHeader>
			<Loading isLoading={isLoading}>
				<WrapperContentProfile>
					<WrapperInput>
						<WrapperLabelChangePass htmlFor="oldPass">Mật khẩu cũ</WrapperLabelChangePass>
						<InputForm
							style={{ width: '200px' }}
							placeholder="Nhập mật khẩu cũ"
							value={oldPass}
							onChange={handleOnChangeOldPass}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabelChangePass htmlFor="newPass">Mật khẩu mới</WrapperLabelChangePass>
						<InputForm
							style={{ width: '200px' }}
							placeholder="Nhập mật khẩu mới"
							value={newPass}
							onChange={handleOnChangeNewPass}
						></InputForm>
					</WrapperInput>
					<WrapperInput>
						<WrapperLabelChangePass htmlFor="newPassConfirm">Nhập lại mật khẩu mới</WrapperLabelChangePass>
						<InputForm
							style={{ width: '200px' }}
							placeholder="Nhập lại mật khẩu mới"
							value={newPassConfirm}
							onChange={handleOnChangeNewPassConfirm}
						></InputForm>
					</WrapperInput>
					<ButtonComponent
						onClick={handleChangePassword}
						bordered="false"
						size={40}
						backgroundHover="#0089ff"
						styleButton={{
							background: 'rgb(255,57,69)',
							height: '30px',
							width: 'fit-content',
							border: 'none',
							borderRadius: '4px',
							transition: 'background 0.3s ease',
							padding: '2px 6px 6px',
						}}
						textButton={'Đổi mật khẩu'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
				</WrapperContentProfile>
			</Loading>
		</div>
	);
};

export default ProfilePage;
