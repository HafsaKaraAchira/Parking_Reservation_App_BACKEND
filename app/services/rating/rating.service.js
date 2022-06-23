const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const rateParking = async (parkingID,userID,rating,comment) => {
    try {
        // Check if rate already exits
        const rate = await prisma.Note.findUnique({
            where: {
                utilisateurID: userID,
                parkingID: parkingID
            }
        });

        if (rate){
            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "User already rated this parking"
                    }]
                }
            }

        }

        await prisma.Note.create({
            data: {
                utilisateurID:userID,
                parkingID:parkingID,
                note:rating,
                commentaire:comment
            }
        })

        return {
            code: 201,
            data: {
                success: true,
                data: {
                    msg: "rating added"
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
    rateParking
}