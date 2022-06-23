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

const getParkingsSearchResult = async (req, res) => {
    let destLong , destLat, maxDistance , maxPrice ;
    try{
        destLong = parseFloat(req.params.destLong);
        destLat = parseFloat(req.params.destLat);
        if(req.params.maxDistance)//max distance in meters
            maxDistance = parseInt(req.params.maxDistance);
        else
            maxDistance = 1000 // valeur par defaut
        if(req.params.maxPrice)
            maxPrice = parseFloat(req.params.maxPrice);
    }
    catch (e){
        res.json("Number my be provided");
    }


    const {code, data, serviceError} = await parkingService.getAllParkings(destLong,destLat,maxDistance,maxPrice);

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


module.exports = {
    getAllParkings,
    getParkingById,
    getParkingsSearchResult
}