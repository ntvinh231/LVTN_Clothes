import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent.jsx';
import slider_1 from '../../assets/images/slider_1.webp';
import slider_2 from '../../assets/images/slider_2.webp';
import slider_3 from '../../assets/images/slider_3.webp';

const HomePage = () => {
	return (
		<div>
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			<SliderComponent arrImages={[slider_1, slider_2, slider_3]} />
			HomePage
		</div>
	);
};

export default HomePage;
