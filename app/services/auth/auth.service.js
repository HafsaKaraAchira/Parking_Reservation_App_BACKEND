const bcrypt = require("bcrypt");

const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const signUp = async (family_name, name,phone_number, email, password) => {
    try {
        // Check if agent already exits
        const user = await prisma.Utilisateur.findUnique({
            where: {
                email: email
            }
        });

        if (user){
            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "User already exists"
                    }]
                }
            }

        }
        // Create a brand new agent
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.Utilisateur.create({
            data: {
                nom: family_name,
                prenom: name,
                email: email,
                telephone: phone_number,
                motDePasse: passwordHash,
            }
        })

        return {
            code: 201,
            data: {
                success: true,
                data: {
                    msg: "User added"
                }
            }
        }
    }catch (e){
        return {
            code: 500,
            data: {
                errors:[{msg: "Server error"}]
		},
            serviceError: e
        }
    }
}

module.exports = {
    signUp
}