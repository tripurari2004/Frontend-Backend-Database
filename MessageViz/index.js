const express = require('express')
const app = express()
const port = 3000;
const path = require('path')
const mongoose = require('mongoose');
const Chat = require('./models/chat.js')
const methodOverride = require('method-override')


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


app.get('/',(req,res)=>{
    res.send('Root is working')
})


app.get("/chats",async (req,res)=>{
    let chats = await Chat.find()
    res.render('index.ejs' , {chats})
})

app.get('/chats/new',(req,res)=>{
    res.render("newForm.ejs")
})

app.post('/chats',(req,res)=>{
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
})

app.get('/chats/:id/edit',async (req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render('edit.ejs', {chat})
})

app.put('/chats/:id',async (req,res)=>{
    let {id} = req.params;
    let {msg} = req.body;
    let chat = await Chat.findByIdAndUpdate(id,{msg:msg}, {runValidator:true, new:true})
    console.log(chat)
    res.redirect('/chats')
})

app.delete('/chats/:id',async (req,res)=>{
    let {id} = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect('/chats')
})


app.listen(port, () => {
    console.log(`App is listing on ${port}`)
})