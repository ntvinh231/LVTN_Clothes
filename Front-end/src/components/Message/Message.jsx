import { message } from 'antd';

const success = (mess = 'Success') => {
	message.success(mess);
};
const error = (mess = 'Error') => {
	message.success(mess);
};
const warning = (mess = 'Warning') => {
	message.success(mess);
};

export { success, error, warning };
