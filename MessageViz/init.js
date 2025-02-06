const mongoose = require('mongoose');
const Chat = require('./models/chat.js')

main().then((res) => {
    console.log("Connection Successful")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chart');
}

let newChat = [
    {
        from: "Tripurari",
        to: "Sweta",
        msg: "Hello meri pyari ardhangani payal",
        created_at: new Date()
    },
    {
        from: "Sweta",
        to: "Treta",
        msg: "Hello mere marad laddu",
        created_at: new Date()
    },
    {
        from: "Treta",
        to: "Payal Ladoo loves each other",
        msg: "Hello mere marad laddu",
        created_at: new Date()
    }
]

Chat.insertMany(newChat).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})