import { Button } from 'antd';
import React, { useState } from 'react';

const ButtonComponent = ({ size, backgroundHover, styleButton, styleTextButton, textButton, ...rest }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Button
			size={size}
			style={{
				...styleButton,
				background: isHovered ? backgroundHover : styleButton.background,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			{...rest}
		>
			<span style={styleTextButton}>{textButton}</span>
		</Button>
	);
};

export default ButtonComponent;
