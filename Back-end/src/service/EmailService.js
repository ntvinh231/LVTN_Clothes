import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const sendEmailCreateOrder = async (email, cartItems) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_ACCOUNT,
			pass: process.env.MAIl_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const attachments = cartItems.map((order) => {
		const attachImage = [
			{
				path: order.image,
				filename: `${order.name}.png`,
			},
		];

		const listItem = `
		<div>
		  <div>
			Bạn đã đặt sản phẩm <b>${order.name} - ${order.color} (${order.size.toUpperCase()})</b> với số lượng: <b>${
			order.amount
		}</b> và giá là: <b>${order.price} VND</b>
		  </div>
		</div>`;

		return {
			content: listItem,
			attachments: attachImage,
		};
	});

	const info = await transporter.sendMail({
		from: 'Clothing Store' + process.env.MAIL_ACCOUNT,
		to: email,
		subject: 'Bạn đã đặt hàng thành công',
		text: 'Hello world?',
		html:
			`<div><b>Cảm ơn bạn đã mua hàng tại cửa hàng</b></div>` +
			attachments.map((item) => item.content).join('') +
			`<div>Bên dưới là hình ảnh của sản phẩm</div>`,
		attachments: attachments.flatMap((item) => item.attachments),
	});
};

export default sendEmailCreateOrder;
