import HomePage from '../pages/HomePage/HomePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';

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
		isShowHeader: true,
	},
	{
		path: '/sign-up',
		page: SignUpPage,
		isShowHeader: true,
	},
	{
		path: '/type',
		page: TypeProductPage,
		isShowHeader: true,
	},
	{
		path: '/product-detail',
		page: ProductDetailsPage,
		isShowHeader: true,
	},
	{
		path: '/profile-user',
		page: ProfilePage,
		isShowHeader: true,
	},
	{
		path: '*',
		page: NotFoundPage,
		isShowHeader: false,
	},
];

// export const ClothingDropdown = [
// 	{
// 		path: '*',
// 		title: 'All'
// 		page: NotFoundPage,
// 	}
// ]
