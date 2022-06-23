const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const QRCode = require('qrcode')

const getAllReservations = async () => {
    try {
        const allReservations = await prisma.Reservation.findMany({
            select: {
                reservationID:true,
                utilisateurId:true,
                numPlace:true,
                paiement:true,
                qrCode:true,
                enter:true,
                sortie:true,
                date:true,
                Parking:true
            }
        });
        return {
            code: 200,
            data:allReservations
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error `,//${e.meta.cause}
            serviceError: e
        }
    }
}

const getReservationById = async (id) => {
    try {
        const reservation = await prisma.Reservation.findUnique({
            where: {
                reservationID: id
            },
            select: {
                reservationID:true,
                utilisateurId:true,
                numPlace:true,
                paiement:true,
                qrCode:true,
                enter:true,
                sortie:true,
                date:true,
                Parking:true
            }
        })
        if (reservation){
            return {
                code: 200,
                data: reservation
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No reservation with id ${id} that was found`
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


const reserve = async (parking,user,date,entry,exit) => {
    try {
        // Check if rate already exits

        console.log(parking+" "+user+" "+date+" "+entry+" "+exit);
        let reservation = await prisma.Reservation.findFirst({
            where: {
                utilisateurID:{
                    equals: user
                } ,
                parkingID:{
                    equals: parking
                } ,
                date:{
                    equals: date
                },
                entryTime:{
                    lte:entry
                },
                exitTime:{
                    gte:exit
                }
            }
        });

        if (reservation){

            console.log(reservation);

            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "You have already reserved a place in this parking at a time that include the mentined duration !"
                    }]
                }
            }

        }
        //Create the new reservation

        //search for reserved places at the demanded duration


        const parkingPlaces = await prisma.Parking.findUnique({
            select: {
                availablePositionsList: true,
                unitPrice:true,
                Reservation:{
                    select:{
                        reservedPosition:true,
                    },
                    where:{
                        parkingID: parking,
                        date:date,
                        OR:[{
                            entryTime:{
                                gte:entry,
                                lte:exit,
                            },
                        }, {
                            exitTime:{
                                gte:entry,
                                lte:exit,
                            },
                        }
                        ]
                    }
                }
            },
            where: {
                parkingID: parking
            }
        });

        console.log(parkingPlaces);

        //search for available place

        console.log( parkingPlaces.Reservation.map((reservation)=> { return reservation.reservedPosition }) );


        const availablePlace = parkingPlaces.availablePositionsList.filter(
            (position) => !parkingPlaces.Reservation.map(
                (reservation)=> { return reservation.reservedPosition }
            ).includes(position)
        )[0];

        console.log(availablePlace);

        const opts = {
            errorCorrectionLevel: 'H',
            type: 'terminal',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#208698',
                light: '#FFF',
            },
        }

        const identifier = user.toString()+parking.toString()+date.toString()+entry.toString()+ exit.toString()+availablePlace.toString()

        const qrImage = await QRCode.toString(identifier, opts)

        console.log(qrImage)

        let start = new Date(entry);
        let end = new Date(exit);

        let duration = Math.ceil((end.getTime()-start.getTime())/(1000*60*60));
        
        let price = parkingPlaces.unitPrice * duration;

        reservation = await prisma.Reservation.create({
            data: {
                Utilisateur: {
                    connect: {utilisateurID: user,}
                },
                Parking:{
                    connect: {parkingID: parking,}
                },
                date:date,
                entryTime:entry,
                exitTime:exit,
                qrCode :qrImage,
                Paiement:{
                    create: { estimatedPrice : price, },
                },
            },
        });

        return {
            code: 200,
            data: reservation
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
    getAllReservations,
    getReservationById,
    reserve
}