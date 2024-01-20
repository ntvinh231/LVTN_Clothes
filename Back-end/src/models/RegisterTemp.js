import mongoose_delete from 'mongoose-delete';
import crypto from 'crypto';
import mongoose from 'mongoose';

const registerTempSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
	},
	password: {
		type: String,
	},
	phone: String,
	address: String,
	city: String,
	avatar: String,
	role: {
		type: String,
		enum: ['user', 'admin', 'superadmin'],
		select: false,
	},
	tokenRegister: String,
	tokenRegisterExpires: Date,
	refreshToken: String,
});

registerTempSchema.methods.createRegisterTempToken = async function () {
	const token = crypto.randomBytes(32).toString('hex');
	this.tokenRegister = crypto.createHash('sha256').update(token).digest('hex');
	//Minutes
	this.tokenRegisterExpires = Date.now() + parseInt(process.env.EMAIL_REGISTER_TEMP_EXPIRES) * 60 * 1000;

	return token;
};

registerTempSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const register = mongoose.model('register', registerTempSchema);

// Hàm để tự động xóa các bản ghi
const deleteExpiredTokens = async () => {
	try {
		const currentDate = new Date();
		// Xóa tất cả các bản ghi có thời gian hết hạn ít hơn thời điểm hiện tại
		await register.deleteMany({ tokenRegisterExpires: { $lt: currentDate } });
	} catch (error) {
		console.error('Lỗi khi xóa các bản ghi hết hạn:', error);
	}
};

const intervalTime = parseInt(process.env.EMAIL_REGISTER_TEMP_EXPIRES) * 60 * 1000 + 30 * 60 * 1000;
setInterval(deleteExpiredTokens, intervalTime);

export default register;
