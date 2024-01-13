import { Button } from 'antd';
import React, { useState } from 'react';

const ButtonComponent = ({
	size,
	backgroundHover,
	styleButton,
	styleTextButton,
	textHover = '#fff',
	textButton,
	isLoading = false,
	...rest
}) => {
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
			loading={isLoading}
			disabled={isLoading}
			{...rest}
		>
			{isLoading ? (
				<span style={{ ...styleTextButton, color: isHovered ? textHover : styleTextButton.color }}>Loading...</span>
			) : (
				<span style={{ ...styleTextButton, color: isHovered ? textHover : styleTextButton.color }}>{textButton}</span>
			)}
		</Button>
	);
};

export default ButtonComponent;
