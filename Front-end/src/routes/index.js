import HomePage from '../pages/HomePage/HomePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import CartPage from '../pages/CartPage/CartPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';
import AdminPage from '../pages/AdminPage/AdminPage';

export const routes = [
	{
		path: '/',
		page: HomePage,
		isShowHeader: true,
	},
	{
		path: '/cart',
		page: CartPage,
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
		path: '/product/:collections',
		page: TypeProductPage,
		isShowHeader: true,
	},
	{
		path: '/product-details/:id',
		page: ProductDetailsPage,
		isShowHeader: true,
	},
	{
		path: '/profile-user',
		page: ProfilePage,
		isShowHeader: true,
		isPrivate: true,
		isAccessible: (user) => ['user', 'admin', 'superadmin'].includes(user?.role),
	},
	{
		path: '/system/admin',
		page: AdminPage,
		isShowHeader: false,
		isPrivate: true,
		isAccessible: (user) => ['admin', 'superadmin'].includes(user?.role),
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
