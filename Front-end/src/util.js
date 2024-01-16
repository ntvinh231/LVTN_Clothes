export const isJsonString = (data) => {
	try {
		JSON.parse(data);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export function getCookieValue(cookieName) {
	const cookies = document.cookie.split('; ');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].split('=');
		if (cookie[0] === cookieName) {
			return cookie[1];
		}
	}
	return null;
}

export function deleteCookie(cookieName) {
	document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

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

export const translateColorToVietnamese = (englishText) => {
	const translationMap = {
		red: 'đỏ',
		green: 'xanh lá',
		blue: 'xanh dương',
		yellow: 'vàng',
		black: 'đen',
		white: 'trắng',
		gray: 'xám',
		brown: 'nâu',
		orange: 'cam',
		pink: 'hồng',
		purple: 'tím',
		cyan: 'xanh lam',
		maroon: 'đỏ sẫm',
		navy: 'xanh hải quân',
		olive: 'lục',
		teal: 'xanh ngọc',
		salmon: 'màu hồng nhạt',
		indigo: 'màu chàm',
		coral: 'màu san hô',
		lavender: 'màu oải hương',
		khaki: 'màu khaki',
		turquoise: 'màu măng xô',
		periwinkle: 'màu xanh nhạt',
	};

	return translationMap[englishText] || englishText;
};
