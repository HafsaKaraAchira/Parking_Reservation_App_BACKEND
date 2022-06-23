const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const ratingService = require("../../services/rating/rating.service");

const rateParking = async (req, res) => {
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    // 2. Extract validated data from body
    const {parking,user,rating,comment} = req.body;
    // 3. call the service of sign up
    const {code, data, serviceError} = await ratingService.rateParking(parking,user,rating,comment);

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
    rateParking
}