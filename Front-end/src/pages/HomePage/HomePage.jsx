import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent.jsx';
import slider_1 from '../../assets/images/slider_1.webp';
import slider_2 from '../../assets/images/slider_2.webp';
import slider_3 from '../../assets/images/slider_3.webp';
import CardComponent from '../../components/CardComponent/CardComponent.jsx';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx';

const HomePage = () => {
	return (
		<div id="container" style={{ background: '#efefef', padding: '0 120px', height: '1000px' }}>
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			<div
				style={{
					marginTop: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '30px',
					flexWrap: 'wrap',
				}}
			>
				<CardComponent></CardComponent>
			</div>

			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
				<ButtonComponent
					textButton="XEM THÊM"
					type="outline"
					backgroundHover="#0089ff"
					bordered="false"
					styleButton={{
						background: '#ed1c24',
						color: '#fff',
						borderRadius: '2px',
					}}
				></ButtonComponent>
			</div>
		</div>
	);
};

export default HomePage;
