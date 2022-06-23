//const Joi = require("joi");
const reservationService = require("../../services/reservations/reservations.service");


const getAllReservations = async (req, res) => {
    const {code, data, serviceError} = await reservationService.getAllReservations();

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const getReservationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const {code, data, serviceError} = await reservationService.getReservationById(id);
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
        }else{
            // Invoke error logger
            console.log(serviceError);
            res.status(code).json(serviceError)
        }
    }catch (e){
        res.json("Number must be provided");
    }
}

const reserve = async (req, res) => {

    // 2. Extract validated data from body
    const {parking,user,date,entry,exit} = req.body;
    console.log(req.body)
    // 3. call the service of reservation
    const {code, data, serviceError} = await reservationService.reserve(parking,user,date,entry,exit);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }
    else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError);
    }
}

module.exports = {
    getAllReservations,
    getReservationById,
    reserve
}