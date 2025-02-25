const express = require('express')
const app = express()
const port = 3000;
const path = require('path')
const mongoose = require('mongoose');
const Chat = require('./models/chat.js')
const methodOverride = require('method-override')
const ExpressError = require('./ExpressError.js')


app.set('view enginee', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"))

app.use(express.urlencoded({extended:true}))

main().then((res) => {
    console.log("Connection Successful")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chart');
}

// Home Route
app.get("/chats",  async(req,res,next)=>{
    try{
        let chats = await Chat.find()
        res.render('index.ejs' , {chats})
    }catch(err){
        next(err)
    }
})

// New Chat Get Form Route
app.get('/chats/new',(req,res)=>{
    res.render("newForm.ejs")
})

// New Chat Post Route
app.post('/chats',(req,res,next)=>{
    try{
        let {from,to,msg} = req.body
        let newChat = new Chat ({
         from:from,
         to:to,
         msg:msg,
         created_at:new Date()
        })
        newChat.save().then((res)=>{
         console.log(res)
        }).catch((err)=>{
         console.log(err)
        })
     
        res.redirect('/chats')
    }catch(err){
        next(err)
    }
})

// Edit Route
app.get('/chats/:id/edit', async(req,res,next)=>{
    try{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat){
            next(new ExpressError(500, "Chat not found"))
        }
        res.render('edit.ejs', {chat})
    }catch(err){
        next(err)
    }
})

// Update Route
app.put('/chats/:id', async(req,res,next)=>{
    try{
        let {id} = req.params;
        let {msg} = req.body;
        let chat = await Chat.findByIdAndUpdate(id,{msg:msg}, {runValidator:true, new:true})
        console.log(chat)
        res.redirect('/chats')
    }catch(err){
        next(err)
    }
})

// Delete Route
app.delete('/chats/:id', async(req,res,next)=>{
    try{
        let {id} = req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect('/chats')
    }catch(err){
        next(err)
    }
})


app.use((err,req,res,next)=>{
    if (err.name = "CastError"){
        res.send('Please enter the right id')
    }
    next(err)
})

// Custom Error 
app.use((err,req,res,next)=>{
    let {status=500, message="error Occured"} = err;
    res.status(status).send(message)
})

app.listen(port, () => {
    console.log(`App is listing on ${port}`)
})