import booking from '../models/Booking.js';

export const createBooking = async(req,res) => {
    try {
        const details = await booking.create({...req.body,customerUserId : req.user._id});
        res.status(201).json(details);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getBookings = async(req,res) => {
    try {
        if(req.user.role=="customer")
        {
            const customerDetails = await booking.find({customerUserId : req.user._id});
            res.status(200).json(customerDetails);
        }
        if(req.user.role=="worker")
        {
            const workerDetails = await booking.find({skilledPersonId : req.user._id});
            res.status(200).json(workerDetails);
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const chooseBooking = async(req,res) => {
    try {
        const bookingSpecific = await booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}
        );
        res.status(200).json(bookingSpecific);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getSingleBooking = async(req,res) => {
    try {
        const singleBooking = await booking.findById(req.params.id);
        res.status(200).json(singleBooking);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}