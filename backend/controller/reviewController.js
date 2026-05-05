import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const createReview = async(req,res) => {
    try {
        const booking = await Booking.findById(req.body.bookingId);
        if(!booking) return res.status(404).json({message:"Booking not found"});
        if(booking.status=="completed")
        {
            const review = await Review.create({...req.body,bookingId: booking._id,customerId:req.user._id,skilledPersonId:booking.skilledPersonId});
            return res.status(201).json(review);
        }
        return res.status(400).json({message:"Booking is not completed"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getReviews = async(req,res) => {
    try {
        const getAllReviews = await Review.find({skilledPersonId:req.params.id});
        res.status(200).json(getAllReviews);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const getMyReviews = async(req,res) => {
    try {
        const getMyReview = await Review.find({customerId:req.user._id});
        res.status(200).json(getMyReview);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}