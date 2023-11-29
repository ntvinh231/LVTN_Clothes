export const isJsonString = (data) => {
	try {
		JSON.parse(data);
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};
