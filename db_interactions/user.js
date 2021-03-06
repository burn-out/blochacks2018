const User = require("../models/User");
const postDb = require("./post");

function fetchUser(userId) {
    return User.findById(userId);
}

function fetchUserByUsername(username) {
    return User.findOne({username: username})
    .then((user)=>{
        if(user) {
            return user;
        }
        else {
            throw new Error("User not found")
        } 
    })
}


function createUser(username, email, password, description) {
    return User.register(new User({
        username: username,
        email: email,
        posts: [],
        isReceiver: false,
        donors: [],
        description: description,
        proImgPath: "/css/res/default-user.png"
    }),
        password);
}

function updateUser(userId, update) {
    return User.findByIdAndUpdate(userId, update);
}

function addPost(userId, post) {
    
    return postDb.createPost(post)
    .then((postDoc)=>{
        console.log(postDoc);
        fetchUser(userId)
        .then((userDoc)=>{
            let oldposts = userDoc.posts;
            let newPosts = oldposts.slice();
            newPosts.push(postDoc._id);
            return updateUser(userDoc._id, newPosts);
        })
        .then((userDoc)=>{
            console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬")
            console.log(postDoc);
            console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬")

            return postDoc;
            // return new Promise((fulfill, reject)=>{fulfill(postDoc)});
        });
    })
    .then((postDoc)=>{
        console.log(postDoc);
        return postDoc;
    })
}

module.exports = {
    createUser : createUser,
    fetchUserByUsername,fetchUserByUsername,
    updateUser:updateUser,
    addPost: addPost,
    fetchUser: fetchUser
}