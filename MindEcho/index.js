const express = require('express')
const app = express()
const methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const port = 3000;

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.set('view enginee', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {   
        id : uuidv4(),
        username : "tripurari",
        content : "I am currently studying in IIT Madras."
    },
    {
        id : uuidv4(),
        username : "sweta",
        content : "I am currently studying in NIT Manipur."
    },
    {
        id : uuidv4(),
        username : "raushan",
        content : "I am currently studying in Jawaharlal Nehru University."
    }
]

app.get('/posts', (req,res)=>{
    res.render('index.ejs', {posts})
})

app.get('/posts/new', (req,res)=>{
    res.render('newForm.ejs')
})

app.post('/posts', (req,res)=>{
    let {username, content} = req.body
    let id = uuidv4()
    posts.push({id, username, content})
    res.redirect('/posts')
})

app.get('/posts/:id', (req,res)=>{
    let {id} = req.params
    let post = posts.find((p)=> id===p.id)
    res.render('post.ejs', {post})
})

app.patch('/posts/:id', (req,res)=>{
    let {id} = req.params
    let newContent = req.body.content
    let post = posts.find((p)=> id===p.id)
    post.content = newContent;
    console.log(post)
    res.redirect('/posts')
})

app.get('/posts/:id/edit', (req,res)=>{
    let {id} = req.params
    let post = posts.find((p)=> id===p.id)
    res.render('editForm.ejs', {post})
})

app.delete('/posts/:id', (req,res)=>{
    let {id} = req.params
    posts = posts.filter((p)=> id !== p.id)
    res.redirect('/posts')
})


app.listen(port, (req,res)=>{
    console.log('App listen on port 3000')
})