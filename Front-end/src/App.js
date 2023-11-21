import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';

export default function App() {
	return (
		<div>
			<Router>
				<Routes>
					{routes.map((route) => {
						const Page = route.page;
						const Layout = route.isShowHeader ? DefaultComponent : Fragment;
						return (
							<Route
								key={Page} // Thêm key vào đây với giá trị là route.path hoặc một giá trị duy nhất khác
								path={route.path}
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
		</div>
	);
}
