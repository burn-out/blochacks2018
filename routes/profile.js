const postDb = require("../db_interactions/post");
const userDb = require("../db_interactions/user");
const app = require("express");
const router = app.Router();

router.get("/:user_id", function(res,req) {
    let viewerId = req.user._id;
    let receiverId = req.params.user_id;

    // Find out if you need to fetch the user from db (or if content )
    // maintained online
    
    // Im here assuming that I'm getting the information straight from the url, so
    // There will be a type problem here between the two type of ids
    userDb.fetchUser(receiver)
    .then((receiverDoc)=>{
        let outBoundObject = {
            isReceiver : false,
            posts: [],
            name: receiverDoc.name,
        }
        // moneyRaised : receiverDoc.name
        if (!(receiverId in viewerId.receivers)) {
            outBoundObject.posts = receiverDoc.posts;
            receiverDoc.isReceiver = true;
        } 
        res.json(outBoundObject);
        // res.render("feed", outBoundObject);
    })
    .catch((err)=>{
        // Error handling will need to be implemented
        console.log(err);
    })
})