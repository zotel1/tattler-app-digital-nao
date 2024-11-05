// Función simulada para ObjectId
function ObjectId(id) {
    return id;
}



export const restaurantsData =  [{
    "_id": ObjectId("507f191e810c19729de860ea"),
    "address": {
        "building": "8825",
        "coord": [
            -73.8803827,
            40.7643124
        ],
        "street": "Astoria Boulevard",
        "zipcode": "11369"
    },
    "borough": "Queens",
    "cuisine": "American",
    "grades": [
        {
            "date": {
                "$date": "2014-11-15T00:00:00.000Z"
            },
            "score": 4
        },
        {
            "date": {
                "$date": "2014-05-02T00:00:00.000Z"
            },
            "score": 2
        }
    ],
    "comments": [
        {
            "date": {
                "$date": "2014-11-15T00:00:00.000Z"
            },
            "comment": "I will definitely be back!",
            "_id": ObjectId("507f1f77bcf86cd799439011")
        }
    ],
    "name": "Brunos On The Boulevard",
    "restaurant_id": "40356151"
},
{
    "_id": ObjectId("507f191e810c19729de860eb"),
    "address": {
        "building": "1234",
        "coord": [
            -73.9876,
            40.7654
        ],
        "street": "Broadway",
        "zipcode": "10001"
    },
    "borough": "Manhattan",
    "cuisine": "Italian",
    "grades": [
        {
            "date": {
                "$date": "2015-07-01T00:00:00.000Z"
            },
            "score": 6
        },
        {
            "date": {
                "$date": "2016-01-05T00:00:00.000Z"
            },
            "score": 3
        }
    ],
    "comments": [
        {
            "date": {
                "$date": "2015-07-01T00:00:00.000Z"
            },
            "comment": "Great food!",
            "_id": ObjectId("507f1f77bcf86cd799439012")
        }
    ],
    "name": "Luigi's",
    "restaurant_id": "40356152"
},
{
    "_id": ObjectId("507f191e810c19729de860ec"),
    "address": {
        "building": "7890",
        "coord": [
            -73.9812,
            40.7328
        ],
        "street": "Madison Avenue",
        "zipcode": "10128"
    },
    "borough": "Brooklyn",
    "cuisine": "Mexican",
    "grades": [
        {
            "date": {
                "$date": "2016-03-22T00:00:00.000Z"
            },
            "score": 8
        },
        {
            "date": {
                "$date": "2017-08-10T00:00:00.000Z"
            },
            "score": 7
        }
    ],
    "comments": [
        {
            "date": {
                "$date": "2016-03-22T00:00:00.000Z"
            },
            "comment": "Loved the tacos!",
            "_id": ObjectId("507f1f77bcf86cd799439013")
        }
    ],
    "name": "El Ranchito",
    "restaurant_id": "40356153"
},
{
    "_id": ObjectId("507f191e810c19729de860ed"),
    "address": {
        "building": "4567",
        "coord": [
            -74.0060,
            40.7128
        ],
        "street": "Wall Street",
        "zipcode": "10005"
    },
    "borough": "Manhattan",
    "cuisine": "Japanese",
    "grades": [
        {
            "date": {
                "$date": "2017-05-12T00:00:00.000Z"
            },
            "score": 9
        },
        {
            "date": {
                "$date": "2018-02-03T00:00:00.000Z"
            },
            "score": 10
        }
    ],
    "comments": [
        {
            "date": {
                "$date": "2017-05-12T00:00:00.000Z"
            },
            "comment": "Best sushi ever!",
            "_id": ObjectId("507f1f77bcf86cd799439014")
        }
    ],
    "name": "Sakura",
    "restaurant_id": "40356154"
},
{
    "_id": ObjectId("507f191e810c19729de860ee"),
    "address": {
        "building": "2345",
        "coord": [
            -73.9772,
            40.7831
        ],
        "street": "Columbus Avenue",
        "zipcode": "10024"
    },
    "borough": "Manhattan",
    "cuisine": "French",
    "grades": [
        {
            "date": {
                "$date": "2018-11-10T00:00:00.000Z"
            },
            "score": 8
        },
        {
            "date": {
                "$date": "2019-06-08T00:00:00.000Z"
            },
            "score": 9
        }
    ],
    "comments": [
        {
            "date": {
                "$date": "2018-11-10T00:00:00.000Z"
            },
            "comment": "Delicious croissants!",
            "_id": ObjectId("507f1f77bcf86cd799439015")
        }
    ],
    "name": "Le Petit Cafe",
    "restaurant_id": "40356155"
}
]