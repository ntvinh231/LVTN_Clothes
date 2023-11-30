import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongoose_delete from 'mongoose-delete';

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
	},
	password: {
		type: String,
		select: false,
	},
	passwordChangedAt: {
		type: Date,
		select: false,
	},
	phone: String,
	address: String,
	avatar: String,
	role: {
		type: String,
		enum: ['user', 'admin'],
		select: false,
	},
	list_favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', select: false }],
	refreshToken: String,
	accessToken: String,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = bcrypt.hashSync(this.password, 12);
	if (this.isModified('password') || this.isNew) this.passwordChangedAt = Date.now() - 2000;
});

userSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return changedTimeStamp > jwtTimeStamp;
	}
	return false;
};

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const User = mongoose.model('User', userSchema);

export default User;
