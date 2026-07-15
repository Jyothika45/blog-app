const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()

app.use(Cors())
app.use(Express.json())

Mongoose.connect("mongodb://jyothika:Jyothika2002@ac-njzwpkd-shard-00-00.01mee5b.mongodb.net:27017,ac-njzwpkd-shard-00-01.01mee5b.mongodb.net:27017,ac-njzwpkd-shard-00-02.01mee5b.mongodb.net:27017/blogappdb?ssl=true&replicaSet=atlas-qh0il0-shard-0&authSource=admin&appName=Cluster0")
.then(() => {
    console.log("mongo db connected")
})
.catch((error) => {
    console.log(error)
})

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    let check = await userModel.find({ email: req.body.email })

    if (check.length > 0) {
        res.json({ "status": "Email already exists" })
    } else {
        let result = new userModel(input)
        await result.save()
        res.json({ "status": "success" })
    }
})

app.listen(3030, () => {
    console.log("Server started")
})