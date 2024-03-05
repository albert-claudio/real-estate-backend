import express from 'express'
import { bookVisit, cancelBooking, createUser, getAllBookings, getAllFavourits, toFav } from '../controllers/userCntrl.js'
const router = express.Router()

router.post("/register", createUser)
router.post("/bookVisit/:id", bookVisit)
router.post("/allBookings", getAllBookings)
router.post("/removeBookings/:id", cancelBooking)
router.post("/toFav/:id", toFav)
router.post("/allFav", getAllFavourits)

export {router as userRoute}