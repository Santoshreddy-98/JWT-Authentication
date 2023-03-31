const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const app = express();


mongoose.connect("mongodb+srv://santosh:babyjo@cluster0.l3weldl.mongodb.net/?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex  : true
}).then(
    () => console.log('DB Connection established')
)

app.use(express.json());

app.use(cors({origin:"*"}))

app.post('/register',async (req, res) =>{
    try{
        const {username,email,password,confirmpassword} = req.body;
        let exist = await Registeruser.findOne({email})
        if(exist){
            return res.send('User Already Exist')
        }
        if(password !== confirmpassword){
            return res.status(400).send('Passwords are not matching');
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')

    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internal Server Error')
    }
})

app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            
            return res.status(400).send('User Not Found');
            
        }
        if(exist.password !== password) {
           
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:5000},
          (err,token) =>{
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/myprofile',middleware,async(req, res)=>{
    try{
        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User not found');
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.put('/updateprofile',middleware,async(req, res)=>{
    try{
        const {username, password} = req.body;
        let updatedUser = {};
        if(username) updatedUser.username = username;
        if(password) updatedUser.password = password;

        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User not found');
        }
        exist = await Registeruser.findByIdAndUpdate(req.user.id, {$set: updatedUser}, {new: true});
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})


app.listen(710,()=>{
    console.log('Server running...')
})

// axios.put(`http://localhost:710/updateprofile/${data._id}`, updatedData, {
//   headers: {
//     'x-token': token
//   }
// }).then(res => {
//   console.log(res.data)
//   // do something with the response
// }).catch(err => console.log(err));
