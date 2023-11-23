import { Image } from 'antd';
import { React, useEffect, useState } from 'react';
import Slider from 'react-slick';
const SliderComponent = ({ arrImages }) => {
	const [marginTopSlider, setMaginTopSlider] = useState(0);
	useEffect(() => {
		const navbarHeight = document.getElementById('MenuBar').offsetHeight;

		// height navbar
		setMaginTopSlider(navbarHeight);
	}, []); // Chạy chỉ một lần sau khi trang đã tải
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
	};
	return (
		<Slider {...settings} style={{ marginTop: marginTopSlider }}>
			{arrImages.map((image) => {
				return <Image key={image} src={image} alt="slider" preview={false} width="100%" />;
			})}
		</Slider>
	);
};

export default SliderComponent;
