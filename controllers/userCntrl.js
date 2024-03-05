import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createUser = asyncHandler(async(req, res)=>{
    console.log("creating a user")

    let {email} = req.body
    const userExists = await prisma.user.findUnique({where: {email: email}})
    if(!userExists){
        const user = await prisma.user.create({data: req.body})
        res.send({
            message: "User registered succefully",
            user: user,
        })
    }
    else res.status(201).send({message: "User already registered"})
})

//FUNCTION TO BOOK A VISIT TO RESD
export const bookVisit = asyncHandler(async(req, res)=>{
    const {email, date} = req.body
    const {id} = req.params

    try{

        const alreadyBooked = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })

        if(alreadyBooked.bookedVisits.some((visit)=>visit.id === id)) {
            res.status(400).json({message: "This residency is already booked by you"})
        }
        else{
            await prisma.user.update({
                where: {email},
                data: {
                    bookedVisits: {push: {id, date}}
                }
            })
            res.send("your visit is booked successfully")
        }
        

    }catch(err){
        throw new Error(err.message)
    }
})

//FUNCTION TO GET ALL BOOKINGS OF A USER
export const getAllBookings = asyncHandler(async (req, res)=> {
    const {email} = req.body
    try{

        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(200).send(bookings)
    }catch(err){
        throw new Error(err.message)
    }
})

//FUNCTION TO CANCEL THE BOOKING
export const cancelBooking = asyncHandler(async(req, res)=> {
    const {email} = req.body
    const {id} = req.params

    try{

       const user = await prisma.user.findUnique({
        where: {email: email},
        select: {bookedVisits: true}
       }) 

       const index = user.bookedVisits.findIndex((visit)=> visit.id === id)

       if(index === -1){
        res.status(404).json({message: "Booking not found"})
       }else{
        user.bookedVisits.splice(index, 1)
        await prisma.user.update({
            where: {email},
            data: {bookedVisits: user.bookedVisits}
        })
        res.send("Booking canceled successfully")
       }

    }catch(err){
        throw new Error(err.message)
    }
})

//FUNCTION TO ADD A RESD IN FAVOURITE LIST OF A USER
export const toFav = asyncHandler(async(req, res)=>{
    const {email} = req.body
    const {id} = req.params

    try{

        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(user.favResidenciesID.includes(id)){
            const updateUser = await prisma.user.update({
                where: {email},
                data: 
                {
                    favResidenciesID: 
                    {
                        set: user.favResidenciesID.filter((id)=> id!== id)
                    }
                }
            })
            res.send({message: "Removed from favorites", user: updateUser})
        }else {
            const updateUser = await prisma.user.update({
                where: {email},
                data: 
                {
                    favResidenciesID: 
                    {
                        push: id
                    }
                }
            })
            res.send({message: "Added to favorites", user: updateUser})
        }

    }catch(err){
        throw new Error(err.message)
    }
})

//FUNCTION TO GET ALL FAVOURITES RESIDENCYS
export const getAllFavourits = asyncHandler(async (req, res) => {
    const {email} = req.body
    try{
        const favResd = await prisma.user.findUnique({
            where: {email},
            select: {favResidenciesID: true}
        })
        res.status(200).send(favResd)
    }catch(err){
        throw new Error(err.message)
    }
})