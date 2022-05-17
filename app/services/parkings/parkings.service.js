const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


const getAllParkings = async () => {
    try {
        const allParkings = await prisma.Parking.findMany({
            select: {
                parkingID:true,
                photo:true,
                nom:true,
                commune:true,
                totalPlaces:true,
                tarif:true,
                longitude_:true,
                latitude:true,
                occupedPlaces:true,
                etat:true
            }
        });
        return {
            code: 200,
            data: {
                success: true,
                data: allParkings

            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getParkingById = async (id) => {
    try {
        const parking = await prisma.Parking.findUnique({
            where: {
                parkingID: id
            },
            select: {
                parkingID:true,
                photo:true,
                nom:true,
                commune:true,
                totalPlaces:true,
                tarif:true,
                longitude_:true,
                latitude:true,
                occupedPlaces:true,
                etat:true
            }
        })
        if (parking){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        parking
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No parking with id ${id} that was found`
                }
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}


module.exports = {
    getAllParkings,
    getParkingById
}