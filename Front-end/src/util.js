export const isJsonString = (data) => {
	try {
		if (data) JSON.parse(data);
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};

export const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

export const getItem = (label, key, icon, children, type) => {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
};

export const convertPrice = (price) => {
	try {
		const result = price?.toLocaleString().replaceAll(',', '.');
		return `${result} VNĐ`;
	} catch (error) {
		return null;
	}
};
