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

app.post("/signin", async (req, res) => {
    let input = req.body

    userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)

                if (passwordValidator) {
                    jwt.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "error", "error": error })
                        } else {
                            res.json({ "status": "success", "token": token, "userId": items[0]._id })
                        }
                    })
                } else {
                    res.json({ "status": "Invalid Password" })
                }

            } else {
                res.json({ "status": "Invalid Email Id" })
            }
        }
    ).catch((error) => {
        res.json({ "status": "error", "error": error })
    })
})

//signup api

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