import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

router.get('/config', (req, res) => {
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: process.env.CLIENT_ID,
	});
});

export default router;
