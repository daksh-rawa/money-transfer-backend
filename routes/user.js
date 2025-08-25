const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { user } = require("../db");
const {account} = require("../db");
const JWT_SECRET = require("../config").JWT_SECRET;
const router = express.Router();
const { authMiddleware }= require("../middleware");

const signupSchema = zod.object({
    username: zod.string(),
    email: zod.string(),
    password: zod.string().min(6)
})

const updatebody= zod.object({
    username: zod.string().optional(),
    email: zod.string().optional(),
    password: zod.string().min(6).optional()
})
// router.get("/tell", (req, res) => { 
//     res.json({
//         msg: "Welcome to the user route"
//     })
// })  
router.post("/signup", async (req, res) => {
    const user_body = signupSchema.safeParse(req.body)
    const body = user_body.data;
 

    if (!user_body.success) {
        return res.status(411).json({
            msg: 'lol1 Invalid user input',
            error: user_body.error.errors
        });
    }

    const existingUser = await user.findOne({username: body.username})

    if (existingUser){
        return res.status(411).json({
            msg: "lol2 user already exists",
            data: existingUser
        })
    }
    
    // Create a new user and their balance
    const createdUser = await user.create(body);
    const userId = createdUser._id
    const accbody ={
        userId,
        balance: parseInt(1 + Math.random()*10000)
    }
    await account.create(accbody)
    // console.log(accbody)
    
    // Generate JWT token
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        msg: "User created successfully",
        token: token
    })

})
// ...existing code...

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password required" });
    }

    // Find user by username
    const existingUser = await user.findOne({ username });
    if (!existingUser) {
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    // Check password (plain text, for demo; use hashing in production)
    if (existingUser.password !== password) {
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);

    res.json({
        msg: "Sign in successful",
        token: token
    });
});

// ...existing code...
router.put("/update",authMiddleware , async (req, res) => {
    const { success } = updatebody.safeParse(req.body);
    
    if (!success){
        return res.status(411).json({
            msg: "Invalid ip lol"
        })
    }
 
    await user.updateOne({
        _id: req.userId
    }, req.body)
    // console.log(req.userId);
    res.json({
        msg: "User updated successfully"
    })
})

router.get("/bulk", async (req,res)=>{

    const filter = req.query.filter

    const users = await user.find({
        $or:[
            {username:{ $regex: filter}}
            // ,{ firstName: { $regex: filter, $options: "i" } }
            // ,{ lastName: { $regex: filter, $options: "i" }
        ]
    })


res.json({
    user:users.map(user=>({
        username:user.username,
        email:user.email,
        _id: user._id
    }))
})
})

// alocate random acc balances
router.post("/demonitise", async (req,res) =>{
    const sure = req.body.sure;
    if (sure == "yes"){
   
    console.log("start")
    const alluser = await user.find({});
    for (let i=0; i<alluser.length; i++){
        const userId = alluser[i]._id;
        
    console.log(userId);
    
    await account.create({
        userId,
        balance: parseInt(1 + Math.random()*10000)
    })
    // const userId = createdUser._id
    // const accbody ={
    //     userId,
    //     balance: parseInt(1 + Math.random()*10000)
    // }
    // await account.create(accbody)
    }
    console.log("done")
     res.json({
        msg: "done"
    })
}else{
    res.json({
        msg: "not done"
    })
}
});

// ...existing code...
module.exports = router;
// ...existing code...