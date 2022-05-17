//const Joi = require("joi");
const parkingService = require("../../services/parkings/parkings.service");


const getAllParkings = async (req, res) => {
    const {code, data, serviceError} = await parkingService.getAllParkings();

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

const getParkingById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const {code, data, serviceError} = await parkingService.getParkingById(id);
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
        res.json("Number my be provided");
    }
}


module.exports = {
    getAllParkings,
    getParkingById
}