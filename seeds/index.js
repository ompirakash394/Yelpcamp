const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log('Database Connected');
})
.catch(e=>{
    console.log('Connection error');
    console.log(e);
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price= Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: "64e922482c61ef25bfcd0d62",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dm9eqvm9o/image/upload/v1693750717/YelpCamp/hhvpu5aksp3s1nmk46wy.jpg',
                  filename: 'YelpCamp/hhvpu5aksp3s1nmk46wy',
                },
                {
                  url: 'https://res.cloudinary.com/dm9eqvm9o/image/upload/v1693750720/YelpCamp/dg8kgafk6j1gxqe7cxe5.jpg',
                  filename: 'YelpCamp/dg8kgafk6j1gxqe7cxe5',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, nostrum veritatis quasi, nemo at, labore aliquam sed dignissimos culpa explicabo voluptatem placeat expedita. Assumenda illum laudantium ea nesciunt, excepturi optio.',
            price: price
        })
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});