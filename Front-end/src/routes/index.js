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
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import MyOrder from '../pages/MyOrder/MyOrder';
import DetailsOrder from '../pages/DetailsOrder/DetailsOrder';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import FinalRegisterPage from '../pages/FinalRegisterPage/FinalRegisterPage';

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
		path: '/payment',
		page: PaymentPage,
		isShowHeader: true,
	},
	{
		path: '/ordersuccess',
		page: OrderSuccess,
		isShowHeader: true,
	},
	{
		path: '/my-order',
		page: MyOrder,
		isShowHeader: true,
	},
	{
		path: '/order-details/:id',
		page: DetailsOrder,
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
		path: '/final-register/:token',
		page: FinalRegisterPage,
		isShowHeader: false,
	},
	{
		path: '/forgot-password',
		page: ForgotPasswordPage,
		isShowHeader: true,
	},
	{
		path: '/reset-password/:token',
		page: ResetPasswordPage,
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
		path: '/contact',
		page: ContactPage,
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
