import express from 'express';
import auth from '../middleware/auth.js'
import {createBooking,getBookings,chooseBooking,getSingleBooking} from '../controller/bookingController.js'

const router = express.Router();

router.post('/',auth,createBooking);
router.get('/',auth,getBookings);
router.put('/:id/status',auth,chooseBooking);
router.get('/:id',auth,getSingleBooking);

export default router;