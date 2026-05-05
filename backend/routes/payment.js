import {createOrder,verifyPayment,getPaymentStatus} from "../controller/paymentController.js"
import auth from "../middleware/auth.js";
import express from 'express';

const router = express.Router();
router.post('/create',auth,createOrder);
router.post('/verify',verifyPayment);
router.get("/:id", getPaymentStatus);
export default router;