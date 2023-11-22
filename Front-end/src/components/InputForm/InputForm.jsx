import React from 'react';
import { WrapperInputStyle } from './style';
const InputForm = (props) => {
	const { placeholder = 'Nhập thông tin', ...rests } = props;
	const handleOnChangeInput = (e) => {
		props.onChange(e.target.value);
	};
	return (
		<div>
			<WrapperInputStyle placeholder={placeholder} {...rests} onChange={handleOnChangeInput} />
		</div>
	);
};

export default InputForm;
