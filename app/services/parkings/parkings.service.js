const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const axios = require("axios");

const WeekDays=['Dimanche','Lundi','Mardi','Mercredi','Jeudi', 'Vendredi','Samedi'];

//const uploadPath = "images/parkings/";

const getAllParkings = async () => {
    try {
        const d = new Date();
        //console.log(d.getDay());
        //console.log(WeekDays[d.getDay()]);
        const allParkings = await prisma.Parking.findMany({
            select: {
                parkingID:true,
                nom:true,
                photo:true,
                commune:true,
                unitPrice:true,
                longitude:true,
                latitude:true,
                reservedPositionsNum:true,
                totalPositionsNum:true,
                Horaire: {
                    select: {
                        ouvertureHoraire:true,
                        fermetureHoraire:true,
                        //day:true
                    },
                    where: {
                        weekDay:{
                            equals:WeekDays[d.getDay()],
                        }
                    }
                }
            },

        });

        return {
            code: 200,
            data:allParkings.map( (parking)=> { return flatten(parking) }  )
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error `,//${e.meta.cause}
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
                data: parking
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

const getParkingsSearchResult = async (destLong,destLat,maxDistance,maxPrice=Infinity) => {
    try {
        // first filter by max price
        let allParkings = maxPriceFilter(maxPrice);
        // second filter by max distance
        if(Array.isArray(allParkings) && allParkings.length)
            allParkings = maxDistanceFilter(allParkings,destLong,destLat,maxDistance);

        return {
            code: 200,
            data:allParkings.map( (parking)=> { return flatten(parking) }  )
        }

    }catch (e){
        return {
            code: 500,
            data: `Server error `,//${e.meta.cause}
            serviceError: e
        }
    }
}

// first filter by max price
const maxPriceFilter = async (maxPrice) => {
    const d = new Date();
    return await prisma.Parking.findMany({
        select: {
            parkingID: true,
            nom: true,
            photo: true,
            commune: true,
            tarif: true,
            etat: true,
            totalPlaces: true,
            reservedPlaces: true,
            longitude: true,
            latitude: true,
            Horaire: {
                select: {
                    ouvertureHoraire: true,
                    fermetureHoraire: true,
                },
                where: {
                    day: {
                        equals: WeekDays[d.getDay()],
                    }
                }
            }
        },
        where: {
            tarif: {
                lte: maxPrice,
            },
        }
    }) ;
}

// second filter by max distance
const maxDistanceFilter = (allParkings,destLong,destLat,maxDistance) => {

    //extract the positions of each parking
    let parkingsAddresses = allParkings.map((parking)=> {
        return {longitude:parking.longitude,latitude:parking.latitude}
    })

    console.log(parkingsAddresses);

    //PARAMETERES
    let DESTINATION_PARAM  = 'destination0='+destLat+','+destLong ;
    let STARTS_PARAM = "" ;
    for(let address in parkingsAddresses){
        STARTS_PARAM += address.latitude+','+address.longitude+';'
    }

    //'40.629041,-74.025606;40.630099,-73.993521'
    //'40.629041,-74.025606'
    const options = {
        method: 'GET',
        url: 'https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix',
        params: {
            origins: STARTS_PARAM,
            destinations: DESTINATION_PARAM
        },
        headers: {
            'X-RapidAPI-Key': '7b16509d84mshba7f8442dd91c66p1082bcjsn4536666865e4',
            'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
        }
    };

    let distances ;
    axios.request(options).then(function (response) {
        console.log(response.data);
        distances =  response.data.distances?.flat(2) ;
    });
    //.catch(function (error) {console.error(error);});

    return  allParkings.filter((parking,index) => distances[index]<= maxDistance)
}

const flatten = (obj) => {
    let res = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && !(value instanceof Date) ) {
            //console.log(key);
            res = { ...res, ...flatten(value) };
        } else {
            res[key] = value;
        }
    }
    return res;
}


module.exports = {
    getAllParkings,
    getParkingById,
    getParkingsSearchResult
}


// apiKey={YOUR_API_KEY}&start0=52.43,13.4&start1=52.5,13.4&destination0=52.5,13.43&destination1=52.5,13.46&mode=fastest;car;traffic:disabled&searchrange=5000