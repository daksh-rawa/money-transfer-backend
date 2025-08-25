const express = require("express");
const mongoose = require('mongoose');

const {account} = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/balance", authMiddleware , async (req,res)=>{
    const Account = await account.findOne({
        userId: req.userId
    });

    res.json({
        msg: "Account balance fetched successfully",
        balance: Account.balance
    })
});

router.post("/transfer", authMiddleware, async (req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    const {amount, to}= req.body;

    //fetch acc of sender
    const Account = await account.findOne({userId: new mongoose.Types.ObjectId(req.userId)}).session(session);
    console.log("req.userId =", req.userId);

  
    if (!Account|| Account.balance < amount){
        await session.abortTransaction();
        return res.status(404).json({
            msg: "Acc err or you broke??"
        });
    }
    // }else{
    //     return res.json({
    //         msg: "Transfer initiated successfully",
    //         balance: Account.balance
    //     });
    // }

    //fetch acc of receiver


    const toAccount = await account.findOne({userId: new mongoose.Types.ObjectId(to)}).session(session);
    console.log("the other.userId =", to);


    if (!toAccount){
        await session.abortTransaction();
        return res.status(404).json({
            msg: "Receiver account not found"
        });
    }
    // }else{
    //     return res.json({
    //         msg:"Transfer initiated successfully"
    // });
        // }
    

    // perform transfer
    await account.updateOne(
        {userId: req.userId},
        {$inc: {balance: -amount}}
        ).session(session);
    
    await account.updateOne(
        { userId: to},
        {$inc: {balance: amount}}   
        ).session(session);

    console.log("Transfer done");

    // commit transaction
    await session.commitTransaction();
    res.json({
        msg: "Transfer done successfully",
        balance: (Account.balance-amount )
    });


})


//test code to check double calling of transfer
// async function transfer(req) {
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to } = req.body;

//     // Fetch the accounts within the transaction
//     const Account = await account.findOne({ userId: req.userId }).session(session);

//     if (!Account || Account.balance < amount) {
//         await session.abortTransaction();
//         console.log("Insufficient balance")
//         return;
//     }

//     const toAccount = await account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//         await session.abortTransaction();
//         console.log("Invalid account")
//         return;
//     }

//     // Perform the transfer
//     await account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//     await account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//     // Commit the transaction
//     await session.commitTransaction();
//     console.log("done")
// }

// transfer({
//     userId: "688e03c4cc98743b9b30ebe8",
//     body: {
//         to: "688e7e8d8c5ffc060b072f12",
//         amount: 10000
//     }
// })

// transfer({
//     userId: "688e03c4cc98743b9b30ebe8",
//     body: {
//         to: "688f138407bc447169e775e9",
//         amount: 10000
//     }
// })

module.exports = router;