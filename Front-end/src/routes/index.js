import HomePage from '../pages/HomePage/HomePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';

export const routes = [
	{
		path: '/',
		page: HomePage,
		isShowHeader: true,
	},
	{
		path: '/order',
		page: OrderPage,
		isShowHeader: true,
	},
	{
		path: '/product',
		page: ProductPage,
		isShowHeader: true,
	},
	{
		path: '/sign-in',
		page: SignInPage,
		isShowHeader: false,
	},
	{
		path: '/sign-up',
		page: SignUpPage,
		isShowHeader: false,
	},
	{
		path: '*',
		page: NotFoundPage,
		isShowHeader: false,
	},
];
