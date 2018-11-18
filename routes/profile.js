const app = require("express");
const router = app.Router();
const postDb = require("../db_interactions/post");
const userDb = require("../db_interactions/user");
const User = require('../models/User');

router.get('/', (req, res) => {
    if(!req.user) {
        userDb.fetchUser(req.user._id)
        .then((currUser) => {

            let outBoundObject = {
                profileData: currUser,
                isReceiver : false,
                posts: []
            }
            res.render('myProfile', {data : outBoundObject})
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

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
});

// 
router.post("/", function(req,res){
    let update = req.body;
    // req.user shoul always be active, but just in case
    if(req.user) {
        let userId = req.user.id;
        let updateUserObject = {
            moneyGoal: update.moneyGoal,
            country : update.country,
            isReceiver : true
        }
        return Promise.all(
            queueDb.fetchRecentQueue()
            .then((queueDoc)=>{
    
                let oldRecentReceivers = queueDoc.users;
                let newRecentReceivers = oldRecentReceivers.slice();
                if(newRecentReceivers.length > queueDoc.sizeLimit)
                    newRecentReceivers.shift();
                newRecentReceivers.push(userId);
                return queueDb.updateQueue(queueDoc.id, {
                    users:newRecentReceivers
                })
            }),
            userDb.updateUser(userId, updateUserObject)
        )
        .then((queueDoc)=>{
            res.redirect("/");
        })
    } else {
        res.redirect("/");
    }
});

module.exports = router;