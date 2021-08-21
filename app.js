const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');



var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect("mongodb://localhost:27017/myfoodshop", { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected");
}).catch((e) => {
    // throw new Error(e);
    console.log("not connected!");
});

const studentschema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: [true, "email is already present"],
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("invalid email");
        }
    },
    phone: {
        type: Number,
        required: true,
        min: 1000000000
    },
    address: {
        type: String,
        required: true,
        lowercase: true
    }

});
// creating new collection and instance of document
const Student = new mongoose.model("Student", studentschema);


// console.log(path.join(__dirname, "/public"));
const staticpath = path.join(__dirname, '/public');
app.use(express.static(staticpath));

app.post("/", (req, res) => {

    const User = new Student(req.body);
    User.save().then(() => {
        res.redirect('/');
    }).catch((e) => {
        console.log("invalide information");
    });


});
app.listen(port, () => {
    console.log(`server running on port "${port}"`)
});