const mongoose = require('mongoose')
const initData = require('./data.js')
const listing = require('../models/listing.js')

main().then((res)=>{
    console.log('Connected to db')
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbannest')
}

const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:'67fcdda8e8a54ee9bc72d039'
    }))
    await listing.insertMany(initData.data)
    console.log('Data was init')
}

initDB()