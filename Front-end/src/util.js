import { orderContant } from './contant';

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

export const convertDataPieChart = (data, type, typeChild) => {
	try {
		const object = {};

		Array.isArray(data) &&
			data?.forEach((option) => {
				if (!object[option[type]]) {
					object[option[type]] = 1;
				} else {
					object[option[type]] += 1;
				}
			});

		const result =
			Array.isArray(Object.keys(object)) &&
			Object.keys(object).map((item) => {
				return {
					name: orderContant.payment[item],
					value: object[item],
				};
			});
		return result;
	} catch (error) {
		return [];
	}
};

export const convertDataBarChart = (data, type, typeChild) => {
	try {
		const object = {};

		Array.isArray(data) &&
			data?.forEach((option) => {
				option[type].forEach((item) => {
					if (!object[item[typeChild]]) {
						object[item[typeChild]] = item['amount'];
					} else {
						object[item[typeChild]] += item['amount'];
					}
				});
			});

		const result =
			Array.isArray(Object.keys(object)) &&
			Object.keys(object)?.map((item) => {
				return {
					name: item,
					Collections: object[item],
				};
			});

		return result;
	} catch (error) {
		return [];
	}
};

export const convertDataTime = (dateString) => {
	const dateObject = new Date(dateString);

	// Hàm bổ sung để thêm số 0 phía trước nếu là số có một chữ số
	const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);

	// Lấy thông tin ngày tháng năm
	const year = dateObject.getFullYear();
	const month = addLeadingZero(dateObject.getMonth() + 1); // Tháng bắt đầu từ 0
	const day = addLeadingZero(dateObject.getDate());

	// Lấy thông tin giờ, phút, giây
	const hours = addLeadingZero(dateObject.getHours());
	const minutes = addLeadingZero(dateObject.getMinutes());
	const seconds = addLeadingZero(dateObject.getSeconds());

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
