import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmailCreateOrder = async (email, cartItems) => {
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
		text: 'Hello',
		html:
			`<div><b>Cảm ơn bạn đã mua hàng tại cửa hàng</b></div>` +
			attachments.map((item) => item.content).join('') +
			`<div>Bên dưới là hình ảnh của sản phẩm</div>`,
		attachments: attachments.flatMap((item) => item.attachments),
	});
};

export const sendMailResetPassword = async (options) => {
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

	const info = await transporter.sendMail({
		from: 'Clothing Store' + process.env.MAIL_ACCOUNT,
		to: options.email,
		subject: 'Yêu cầu đặt lại mật khẩu',
		html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td>
            <h1>${options.subject}</h1>
			${options.message1}
            <p>${options.message2}</p>
            <p>
              <a style="cursor: pointer;" href="${options.resetURL}">
                <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                  Đặt lại mật khẩu
                </button>
              </a>
            </p>
			<p>${options.message3}</p>
          </td>
        </tr>
      </table>
    `,
	});
};
