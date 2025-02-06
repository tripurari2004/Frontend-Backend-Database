const express = require('express')
const app = express()
const mongoose  = require('mongoose')
const port = 3000
const listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main().then((res)=>{
    console.log('Connected to db')
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbannest')
}

app.get('/listings', async (req,res)=>{
    let list = await listing.find()
    res.render('listings/index.ejs', {list})
})

app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs')
})

app.get('/listings/:id',async (req,res)=>{
    let {id} = req.params
    let data = await listing.findById(id)
    res.render('listings/show.ejs', {data})
})

app.post('/listings',async (req,res)=>{
    let newlisting = new listing(req.body.listing) 
    await newlisting.save()
    res.redirect('/listings')
})


app.get('/listings/:id/edit',async (req,res)=>{
    let {id} = req.params
    let data = await listing.findById(id)
    res.render('listings/edit.ejs', {data})
})


app.put('/listings/:id', async(req,res)=>{
    let {id} = req.params
    await listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)

})

app.delete('/listings/:id', async(req,res)=>{
    let {id} = req.params
    await listing.findByIdAndDelete(id)
    res.redirect('/listings')
})

// app.get('/testlisting', async (req,res)=>{
//     let sample = new listing({
//         title: 'My Home',
//         description : 'By beach',
//         price : 100000,
//         location : "Patna",
//         country : 'India'
//     })

//     await sample.save().then((res)=>{
//         console.log(res)
//     }).catch((err)=>{
//         console.log(err)
//     })

//     res.send('Success')
// })

app.listen(port, (req,res)=>{
    console.log('Sever listing')
})