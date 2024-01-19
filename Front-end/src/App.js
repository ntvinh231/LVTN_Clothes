import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { getCookieValue } from './util';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from './service/UserService';
import * as ProductService from './service/ProductService';

import { resetUser, updateUser } from './redux/slice/userSlide';
import Cookies from 'js-cookie';
import Loading from './components/LoadingComponent/Loading';
import { message } from 'antd';
import FooterComponent from './components/FooterComponent/FooterComponent';

export default function App() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			return;
		}

		let isMounted = true;

		const fetchData = async () => {
			setIsLoading(true);

			const { storageData, decoded } = handleDecoded();

			if (decoded?.payload) {
				await handleGetDetailsUser(decoded.payload, storageData);
			}

			if (isMounted) {
				setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [user]); // Thêm 'dispatch' vào dependencies

	UserService.axiosJWT.interceptors.request.use(async (config) => {
		try {
			const cookieOptions = {
				httpOnly: true,
				secure: false,
			};
			const currentTime = new Date();
			const { decoded } = handleDecoded();
			if (decoded?.exp && decoded?.exp < currentTime.getTime() / 1000) {
				const data = await UserService.refreshToken();
				config.headers['token'] = `Bearer ${data?.accessToken}`;

				// Lưu access token vào cookie
				Cookies.set('jwt', data?.accessToken, cookieOptions);
			}
			return config;
		} catch (error) {
			console.log(error);
		}
	});

	const handleDecoded = () => {
		let storageData = getCookieValue('jwt');
		let decoded = {};
		if (storageData) {
			decoded = jwtDecode(storageData);
		}

		return { decoded, storageData };
	};
	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id, token);

		dispatch(updateUser({ ...res?.data, accessToken: token }));
	};

	return (
		<div>
			<Loading isLoading={isLoading}>
				<Router>
					<Routes>
						{routes.map((route) => {
							const Page = route.page;
							const isPrivate = route.isPrivate;
							const isAccessible = route.isAccessible;

							const isAuthorized = !isPrivate || (user?.accessToken && (isAccessible ? isAccessible(user) : true));
							const Layout = route.isShowHeader ? DefaultComponent : Fragment;

							return (
								<Route
									key={Page} // Thêm key vào đây với giá trị là route.path hoặc một giá trị duy nhất khác
									path={isAuthorized ? route.path : ''}
									element={
										<Layout>
											<Page />
										</Layout>
									}
								/>
							);
						})}
					</Routes>
				</Router>
			</Loading>
		</div>
	);
}
