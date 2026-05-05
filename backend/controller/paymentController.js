import Payment from '../models/Payment.js'
import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createOrder = async(req,res) => {
    try {
        const razorpay = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const booking = await Booking.findById(req.body.bookingId);
        if(!booking) return res.status(404).json({message:"Booking Not Found"});
        const order = {
            amount : booking.amount * 100,
            currency : "INR",
            receipt : booking._id.toString()
        }
        
        const createdOrder = await razorpay.orders.create(order)

        await Payment.create({
            bookingId: booking._id,
            amount : booking.amount,
            razorpayOrderId : createdOrder.id
        });
        res.json(createdOrder);
    } catch (error) {
    return res.status(500).json({ message: error.message });
}
}

export const verifyPayment = async(req,res) => {
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const generated = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")
        if(generated!=razorpay_signature)
        {
            return res.status(400).json({ message: "Invalid signature" });
        }
        const payment = await Payment.findOneAndUpdate(
            {razorpayOrderId:razorpay_order_id},
            {status:"completed",
            razorpayPaymentId:razorpay_payment_id,
            isPaid:true
            },
            {returnDocument: "after"}
        )
        res.json({ message: "Payment has been done" });
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getPaymentStatus = async(req,res) => {
    try {
        const payment = await Payment.findOne({bookingId:req.params.id});
        if(!payment)
        {
            return res.status(404).json({message:"Payment Not found"});
        }
        res.json({
            status:payment.status,
            paymentId:payment.razorpayPaymentId
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}