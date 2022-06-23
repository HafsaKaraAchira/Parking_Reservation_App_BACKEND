const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const bcrypt= require("bcrypt");
//const {func} = require("joi");
//const jwt = require("jsonwebtoken");
const Joi = require("joi");

const authService = require("../../services/auth/auth.service");

const login=async (req, res) => {
    const {email, password} = req.body;
    let theUser = null;
    await prisma.Utilisateur.findUnique({
        where: {email: email,},
    })
        .then( async user => {
            if (user == null) {
                throw new Error("Email Don't exist in our database !")
            } else {
                theUser = user;
                console.log(password);
                console.log(theUser.motDePasse);

                //const salt = await bcrypt.genSalt(10);
                //const passwordHash = await bcrypt.hash(password, salt);
                //console.log(passwordHash);
                const valid = await bcrypt.compare(password,theUser.motDePasse);
                return valid ;
            }
        })
        .then(status => {
            if (status === true) {
                res.setHeader('Content-Types', 'application/json');
                res.statusCode = 200;
                res.json({success: true,data: theUser})
            } else {
                throw new Error("Password is wrong")
            }
        })
        .catch(err => {
            console.log(err.message)
            res.setHeader('Content-Types', 'application/json');
            res.statusCode = 500;
            res.json({success: false, data: {message: err.message}})
        });
}

const signUpDataValidate = (data) =>  {
    const validationSchema = Joi.object({
        family_name: Joi.string().min(3).max(255).required(),
        name: Joi.string().min(3).max(255).required(),
        phone_number: Joi.string().required(),
        email: Joi.string().email().max(255).required(),
        password: Joi.string().min(8).max(255).required()
    });
    return validationSchema.validate(data);
}

const signUp = async (req, res) => {
    // 1. Validate user supplied data
    const {error} = signUpDataValidate(req.body);
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    // 2. Extract validated data from body
    const {family_name, name, phone_number,email, password} = req.body;
    // 3. call the service of sign up
    const {code, data, serviceError} = await authService.signUp(family_name,name, phone_number,email, password);

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
    login,
    signUp
}