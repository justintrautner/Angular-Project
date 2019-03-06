// npm init -y
// npm install express
// npm install body-parser
// npm install sequelize
// npm install mysql2
// npm install bcrypt
// npm install express-session
// npm install --save angularx-social-login
// npm install --save @ng-bootstrap/ng-bootstrap
// npm install rxjs
// npm install --save @sendgrid/mail


// SEQUELIZE


const Sequelize = require('sequelize');
const sequelize = new Sequelize('angular-schema', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        
    })
    .catch(err => {
        
    });

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: {
            args: true,
            msg: "Email already exists"
        },
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: { msg: "Invalid first name" },
            notEmpty: true
        }
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: { msg: "Invalid last name" },
            notEmpty: true
        }
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 16],
            notEmpty: true,
            notIn: {
                args: [['shit', 'bitch']],
                msg: "Do you kiss your mother with that mouth"
            }
        }
    },
    livesIn: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-zA-Z\s]*$/,
            len: [2, 20]
        }
    },
    from: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-zA-Z\s]*$/,
            len: [2, 20]
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    avatar_url: {
        type: Sequelize.STRING,
        defaultValue: "http://bespokeevents.com/wp-content/uploads/2017/11/blank-profile-picture-973460.png"
    },
    cover_photo_url: {
        type: Sequelize.STRING,
        defaultValue: "https://images3.alphacoders.com/276/276565.jpg"
    },
    description: {
        type: Sequelize.STRING,
        defaultValue: "My default bio"
    },
    num_of_follows: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    resetToken: {
        type: Sequelize.STRING
    },
    resetDeadline: {
        type: Sequelize.DATE
    }
},
    { timestamps: true }
)

const Photo = sequelize.define('photo', {
    url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                msg: "Must be valid url"
            }
        }
    },
    num_of_likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    num_of_comments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    caption: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [0, 255],
                msg: "Caption must be less than 255 characters"
            }
        }
    }
},
    { timestamps: true }
)
const Comment = sequelize.define('comment', {
    content: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
},
    { timestamps: true }
)
const Message = sequelize.define('message', {
    content: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true,
        }
    },
    isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},
    { timestamps: true }
)
const Conversation = sequelize.define('conversation', {

},
    { timestamps: true }
)


// ONE TO MANY (UPLOADER ID)
User.hasMany(Photo, { as: 'uploaded_photos', foreignKey: 'uploaderId' });
Photo.belongsTo(User, { as: 'uploader', foreignKey: 'uploaderId' })
// MANY TO MANY (LIKES)
User.belongsToMany(Photo, { as: 'liked', through: 'likes' });
Photo.belongsToMany(User, { as: 'liker', through: 'likes' });
// MANY TO MANY (FOLLOW)
User.belongsToMany(User, { as: 'followed', foreignKey: 'followedId', otherKey: 'followerId', through: 'follows' })
User.belongsToMany(User, { as: 'follower', foreignKey: 'followerId', otherKey: 'followedId', through: 'follows' })
// 2 ONE TO MANY (COMMENTS)
User.hasMany(Comment, { as: 'user_comments', foreignKey: 'userId' })
Comment.belongsTo(User, { as: 'commenter', foreignKey: 'userId' })
Photo.hasMany(Comment, { as: 'photo_comments', foreignKey: 'photoId' })
Comment.belongsTo(Photo, { as: 'commented', foreignKey: 'photoId' })
// 2 ONE TO MANY (MESSAGES)
User.hasMany(Message, { as: 'sender', foreignKey: 'senderId' })
User.hasMany(Message, { as: 'recipient', foreignKey: 'recipientId' })
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' })
// 2 ONE TO MANY (CONVERSATION)
User.hasMany(Conversation, { as: 'userOne', foreignKey: 'userOneId' })
User.hasMany(Conversation, { as: 'userTwo', foreignKey: 'userTwoId' })
Conversation.belongsTo(User, { as: 'userOne', foreignKey: 'userOneId' })
Conversation.belongsTo(User, { as: 'userTwo', foreignKey: 'userTwoId' })
// ONE TO MANY (CONVERSATION, MESSAGES)
Conversation.hasMany(Message, { as: 'messages', foreignKey: 'convoId' })
Message.belongsTo(Conversation, { as: 'convo', foreignKey: 'convoId' })

// SYNC
sequelize.sync({
    // force: true
})

// SEQULIZE OPERATOR
const Op = Sequelize.Op;

// SENDGRID
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const crypto = require('crypto')

const bcrypt = require("bcrypt")
const saltRounds = 10;

const express = require("express");
const app = express();

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

const session = require('express-session');
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}))

app.use(express.static(__dirname + '/angular-app/dist/angular-app'));

app.listen(8000, function () {
    
});

// REGISTER
app.post("/db/register", function (req, res) {
    var new_user = new User();
    new_user.email = req.body.email
    new_user.first_name = req.body.first_name
    new_user.last_name = req.body.last_name
    new_user.username = req.body.username
    // HASH PASSWORD
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        new_user.password = hash;
        new_user.save().then(() => {
            // Store in session
            req.session.uId = new_user.id
            res.json({
                result: true,
                user: new_user
            })
        })
            .catch(error => {
                res.json({
                    result: false,
                    error: error
                })
            })
    })
})

// LOGIN USER
app.post("/db/login", function (req, res) {
    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    res.json({ result: false })
                }
                else if (result) {
                    // Store in session
                    req.session.uId = user['dataValues']['id']
                    res.json({
                        result: result,
                        user: user['dataValues']
                    })
                }
                else {
                    res.json({ result: false })
                }
            })
        } else {
            res.json({ result: false })
        }
    })
})
// LOGIN FB USER
app.post("/db/fb/login", function (req, res) {
    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            // Store in session
            req.session.uId = user['dataValues']['id']
            res.json({
                result: true,
                user: user['dataValues']
            })
        } else if (!user) {
            var new_user = new User();
            new_user.email = req.body.email
            new_user.first_name = req.body.first_name
            new_user.last_name = req.body.last_name
            new_user.username = req.body.first_name
            new_user.avatar_url = req.body.avatar_url
            // HASH
            bcrypt.hash(req.body.secret, saltRounds, function (err, hash) {
                new_user.password = hash;
                new_user.save().then(() => {
                    // Store in session
                    req.session.uId = new_user.id
                    res.json({
                        result: true,
                        user: new_user
                    })
                })
                    .catch(error => {
                        res.json({
                            result: false,
                            error: error
                        })
                    })
            })
        }
        else {
            res.json({
                result: false
            })
        }
    })
})

// SESSION CHECK--GET USER INFO TO DISPLAY HOME PAGE
app.get("/db/user/home", function (req, res) {
    if (req.session.uId) {
        followersArr = []
        User.findOne({
            where: { id: req.session.uId },
            include:
                [{
                    model: User, as: 'followed',
                    attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url', 'num_of_follows']
                },
                {
                    model: User, as: 'follower',
                    attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url', 'num_of_follows']
                },
                {
                    model: Message, as: 'recipient'
                }],
            order: [
                [{ model: User, as: 'followed' }, 'num_of_follows', 'DESC'],
                [{ model: User, as: 'follower' }, 'num_of_follows', 'DESC']

            ]
        })
        .then(user => {
                if (user) {
                    for (var idx in user['dataValues']['follower']) {
                        followersArr.push(user['dataValues']['follower'][idx]['dataValues']['id'])
                    }
                    // PUSH MY OWN ID
                    followersArr.push(req.session.uId)
                    Photo.findAll({
                        where: {
                            uploaderId: {
                                [Op.in]: followersArr
                            }
                        },
                        include: [{
                            model: User, as: 'uploader',
                            attributes: ['id', 'username', 'avatar_url']
                        }],
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    })
                        .then((photos) => {
                            // RECENT PHOTOS
                            Photo.findAll({
                                where: {
                                    uploaderId: req.session.uId
                                },
                                limit: 4,
                                order: [
                                    ['createdAt', 'DESC']
                                ]
                            })
                                .then((rec_photos) => {
                                    res.json({
                                        result: true,
                                        user: user['dataValues'],
                                        photos: photos,
                                        rec_photos: rec_photos
                                    })
                                })
                        })
                } else {
                    res.json({
                        result: false
                    })
                }
            })
    } else {
        res.json({
            result: false
        })
    }
})
// GET USER INFO--PROFILE COMPONENT
app.get("/db/user/profile", function (req, res) {
    if (req.session.uId) {
        User.findOne({
            where: { id: req.session.uId },
            include: { model: Message, as: 'recipient' }
        })
            .then(user => {
                if (user) {
                    res.json({
                        result: true,
                        user: user['dataValues']
                    })
                } else {
                    res.json({
                        result: false
                    })
                }
            })
    } else {
        res.json({
            result: false
        })
    }
})
// LOGOUT
app.get("/db/logout", function (req, res) {
    req.session.uId = null;
    res.json({
        result: true
    })
})
// FIND USER BY ID--PROFILE
app.get("/db/user/:id", function (req, res) {
    User.findOne({
        where: { id: req.params.id },
        include:
            [{
                model: User, as: 'followed',
                attributes: ['id', 'first_name', 'last_name', 'username']
            },
            {
                model: User, as: 'follower',
                attributes: ['id', 'first_name', 'last_name', 'username']
            },
            {
                model: Photo, as: 'uploaded_photos'
            }],
        order: [
            [{ model: Photo, as: 'uploaded_photos' }, 'createdAt', 'DESC']
        ]
    })
        .then(user => {
            if (user) {
                res.json({
                    result: true,
                    user: user['dataValues']
                })
            } else {
                res.json({ result: false })
            }
        })
})
// SHORT EDIT
app.put("/db/user/:id", function (req, res) {
    User.findOne({
        where: { id: req.params.id },
        include:
            [{
                model: User, as: 'followed',
                attributes: ['id', 'first_name', 'last_name', 'username']
            },
            {
                model: User, as: 'follower',
                attributes: ['id', 'first_name', 'last_name', 'username']
            }]
    })
        .then(user => {
            if (user) {
                user.update({
                    livesIn: req.body.livesIn,
                    from: req.body.from
                })
                res.json({
                    result: true,
                    user: user['dataValues']
                })
            }
        })
})
// FOLLOW USER
app.get("/db/user/follow/:followerId/:followedId", function (req, res) {
    User.findOne({
        where: { id: req.params.followedId },
        include: {
            model: User, as: 'followed',
            attributes: ['id', 'first_name', 'last_name', 'username']
        }
    })
        .then(followedUser => {
            User.findOne({ where: { id: req.params.followerId } })
                .then(followerUser => {
                    followedUser.addFollowed(followerUser)
                    followedUser.increment('num_of_follows', { by: 1 })
                        .then(data => {
                            User.findOne({
                                where: { id: followedUser['dataValues']['id'] },
                                include: {
                                    model: User, as: 'followed',
                                    attributes: ['id', 'first_name', 'last_name', 'username']
                                }
                            })
                                .then(updatedUser => {
                                    res.json({
                                        result: true,
                                        user: updatedUser['dataValues']
                                    })
                                })
                        })

                })
                .catch(error => {
                    res.json({
                        result: false,
                        error: error
                    })
                })
        })
        .catch(error => {
            res.json({
                result: false,
                error: error
            })
        })
})
// UNFOLLOW USER
app.get("/db/user/unfollow/:followerId/:followedId", function (req, res) {
    User.findOne({
        where: { id: req.params.followedId },
        include: {
            model: User, as: 'followed',
            attributes: ['id', 'first_name', 'last_name', 'username']
        }
    })
        .then(followedUser => {
            User.findOne({ where: { id: req.params.followerId } })
                .then(followerUser => {
                    followedUser.removeFollowed(followerUser)
                    followedUser.decrement('num_of_follows', { by: 1 })
                        .then(data => {
                            User.findOne({
                                where: { id: followedUser['dataValues']['id'] },
                                include: {
                                    model: User, as: 'followed',
                                    attributes: ['id', 'first_name', 'last_name', 'username']
                                }
                            })
                                .then(updatedUser => {
                                    res.json({
                                        result: true,
                                        user: updatedUser['dataValues']
                                    })
                                })
                        })
                })
                .catch(error => {
                    res.json({
                        result: false,
                        error: error
                    })
                })
        })
        .catch(error => {
            res.json({
                result: false,
                error: error
            })
        })
})
// SEND MESSAGE
app.post('/db/user/message/send/:recipientId', function (req, res) {
    Conversation.findOne({
        where: {
            [Op.or]: [
                { userOneId: req.session.uId, userTwoId: req.params.recipientId },
                { userTwoId: req.session.uId, userOneId: req.params.recipientId }]
        }
    })
        .then(convoRoom => {
            if (convoRoom) {
                Message.create({
                    content: req.body.content,
                    senderId: req.session.uId,
                    recipientId: req.params.recipientId,
                    convoId: convoRoom['dataValues']['id']
                })
                    .then(() => {
                        res.json({
                            result: true
                        })
                    })
            } else {
                Conversation.create({
                    userOneId: req.session.uId,
                    userTwoId: req.params.recipientId
                })
                    .then(convoRoom => {
                        Message.create({
                            content: req.body.content,
                            senderId: req.session.uId,
                            recipientId: req.params.recipientId,
                            convoId: convoRoom['dataValues']['id']
                        })
                    })
                    .then(() => {
                        res.json({
                            result: true
                        })
                    })
            }
        })
})
// GET USER AND MESSAGES
app.get('/db/user/message/retrieve', function (req, res) {
    if (req.session.uId) {
        User.findOne({ where: { id: req.session.uId } })
            .then(user => {
                Conversation.findAll({
                    where: {
                        [Op.or]: [
                            { userOneId: req.session.uId },
                            { userTwoId: req.session.uId }
                        ]
                    },
                    include:
                        [
                            {
                                model: Message, as: 'messages'
                            },
                            {
                                model: User, as: 'userOne',
                                attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url']
                            },
                            {
                                model: User, as: 'userTwo',
                                attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url']
                            }
                        ]
                })
                    .then(convoRooms => {
                        // MAKE OTHER PERSON USER ONE
                        for (idx in convoRooms) {
                            if (convoRooms[idx]['userOne']['id'] == req.session.uId) {
                                convoRooms[idx]['dataValues']['userOne'] = convoRooms[idx]['dataValues']['userTwo']
                                delete convoRooms[idx]['dataValues']['userTwo']
                                delete convoRooms[idx]['dataValues']['userTwoId']
                            } else {
                                delete convoRooms[idx]['dataValues']['userTwo']
                                delete convoRooms[idx]['dataValues']['userTwoId']
                            }
                        }
                        res.json({
                            result: true,
                            data: convoRooms,
                            user: user['dataValues']
                        })
                    })
            })
    }
    else {
        res.json({ result: false })
    }
})
// GET MESSAGES BY CONVERSATION ID
app.get('/db/user/message/retrieve/:id', function (req, res) {
    // UPDATING READ MESSAGES
    var changed;
    sequelize.query(
        "UPDATE messages SET isRead = true WHERE convoId = " + req.params.id + " AND recipientId = " + req.session.uId)
        .spread((results) => {
            changed = results['changedRows']
        })
        .then(() => {
            // SELECTING
            Message.findAll({
                where: {
                    convoId: req.params.id
                }
            })
                .then(data => {
                    res.json({
                        result: true,
                        data: data,
                        read: changed
                    })
                })
        })
})
// GET USER--CONVO COMPONENT
app.get('/db/user/conversation/retrieve', function (req, res) {
    if (req.session.uId) {
        User.findOne({ where: { id: req.session.uId } })
            .then(user => {
                res.json({
                    result: true,
                    user: user['dataValues']
                })
            })
    }
    else {
        res.json({
            result: false
        })
    }

})
// REPLY TO MESSAGE
app.post('/db/user/message/reply/:convoId', function (req, res) {
    var recipId;
    Conversation.findOne({ where: { id: req.params.convoId } })
        .then(convo => {
            if (convo['dataValues']['userOneId'] == req.session.uId) {
                recipId = convo['dataValues']['userTwoId']
            }
            else {
                recipId = convo['dataValues']['userOneId']
            }
            Message.create({
                content: req.body.content,
                senderId: req.session.uId,
                recipientId: recipId,
                convoId: req.params.convoId
            })
                .then(() => {
                    Message.findAll({
                        where: {
                            convoId: req.params.convoId
                        }
                    })
                        .then((data) => {
                            res.json({
                                result: true,
                                data: data
                            })
                        })
                })
        })
})
// GET USER INFO FOR EDIT COMPONENT
app.get('/db/user/edit/info', function (req, res) {
    var unread = 0;
    if (req.session.uId) {
        User.findOne({
            where: { id: req.session.uId },
            include: { model: Message, as: 'recipient' }
        })
            .then((user) => {
                // UNREAD MESSAGES
                for (idx in user['dataValues']['recipient']) {
                    if (user['dataValues']['recipient'][idx]['dataValues']['isRead'] != true) {
                        unread++
                    }
                }
                res.json({
                    result: true,
                    user: user,
                    unread: unread
                })
            })
            .catch(() => {
                res.json({ result: false })
            })
    } else {
        res.json({
            result: false
        })
    }
})
// EDIT USER--EDIT COMPONENT
app.put('/db/user/edit/info/:id', function (req, res) {
    if (req.session.uId) {
        User.findOne({ where: { id: req.params.id } })
            .then((user) => {
                user.update({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    livesIn: req.body.livesIn,
                    from: req.body.from,
                    avatar_url: req.body.avatar_url,
                    cover_photo_url: req.body.cover_photo_url,
                    description: req.body.description
                })
                    .then(() => {
                        res.json({ result: true })
                    })
                    .catch((error) => {
                        if (error) {
                            res.json({
                                result: false,
                                error: error['errors']
                            })
                        }
                    })
            })
    } else {
        res.json({ result: false })
    }
})
// SEARCH COMPONENT
app.get('/db/user/search/:query', function (req, res) {
    var unread = 0;
    if (req.session.uId) {
        User.findOne({
            where: { id: req.session.uId },
            include: { model: Message, as: 'recipient' }
        })
            .then((user) => {
                for (idx in user['dataValues']['recipient']) {
                    if (user['dataValues']['recipient'][idx]['dataValues']['isRead'] != true) {
                        unread++
                    }
                }
                User.findAll({
                    where: {
                        [Op.or]: [
                            {
                                first_name: {
                                    [Op.like]: '%' + req.params.query + '%'
                                }
                            },
                            {
                                username: {
                                    [Op.like]: '%' + req.params.query + '%'
                                }
                            }],
                        [Op.not]: [
                            {
                                id: req.session.uId
                            }
                        ]
                    },
                    order: [
                        ['num_of_follows', 'DESC']
                    ]
                })
                    .then((data) => {
                        res.json({
                            result: true,
                            data: data,
                            user: user,
                            unread: unread
                        })
                    })
            })
    } else {
        res.json({
            result: false
        })
    }
})
// POST PICTURE
app.post('/db/user/post/img', function (req, res) {
    Photo.create({
        url: req.body.url,
        caption: req.body.caption,
        uploaderId: req.session.uId
    })
        .then(() => {
            User.findOne({
                where: { id: req.session.uId },
                include:
                    [{
                        model: User, as: 'followed',
                        attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url', 'num_of_follows']
                    },
                    {
                        model: User, as: 'follower',
                        attributes: ['id', 'first_name', 'last_name', 'username', 'avatar_url', 'num_of_follows']
                    },
                    {
                        model: Message, as: 'recipient'
                    }],
                order: [
                    [{ model: User, as: 'followed' }, 'num_of_follows', 'DESC'],
                    [{ model: User, as: 'follower' }, 'num_of_follows', 'DESC']

                ]
            })
                .then((user) => {
                    if (user) {
                        for (var idx in user['dataValues']['follower']) {
                            followersArr.push(user['dataValues']['follower'][idx]['dataValues']['id'])
                        }
                        // PUSH MY OWN ID
                        followersArr.push(req.session.uId)
                        Photo.findAll({
                            where: {
                                uploaderId: {
                                    [Op.in]: followersArr
                                }
                            },
                            include: [{
                                model: User, as: 'uploader',
                                attributes: ['id', 'username', 'avatar_url']
                            }],
                            order: [
                                ['createdAt', 'DESC']
                            ]
                        })
                            .then((photos) => {
                                Photo.findAll({
                                    where: {
                                        uploaderId: req.session.uId
                                    },
                                    limit: 4,
                                    order: [
                                        ['createdAt', 'DESC']
                                    ]
                                })
                                    .then((rec_photos) => {
                                        res.json({
                                            result: true,
                                            user: user['dataValues'],
                                            photos: photos,
                                            rec_photos: rec_photos
                                        })
                                    })

                            })
                    } else {
                        res.json({
                            result: false
                        })
                    }
                })

        })
        .catch((error) => {
            res.json({
                result: false,
                error: error['errors'][0]['message']
            })
        })
})
// FIND PHOTO BY ID
app.get('/db/user/photo/:id', function (req, res) {
    if (req.session.uId) {
        var unread = 0;
        Photo.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User, as: 'uploader',
                    attributes: ['id', 'username', 'avatar_url', 'first_name', 'last_name']
                },
                {
                    model: User, as: 'liker',
                    attributes: ['id', 'username', 'avatar_url', 'first_name', 'last_name']
                },
                {
                    model: Comment, as: 'photo_comments',
                    include: [
                        {
                            model: User, as: 'commenter',
                            attributes: ['id', 'username', 'avatar_url', 'first_name', 'last_name']
                        }]
                }
            ],
            order: [
                [{ model: Comment, as: 'photo_comments' }, 'createdAt', 'DESC']]
        })
            .then((photo) => {
                User.findOne({
                    where: { id: req.session.uId },
                    include: [
                        { model: Message, as: 'recipient' }
                    ]
                })
                    .then((user) => {
                        for (idx in user['dataValues']['recipient']) {
                            if (user['dataValues']['recipient'][idx]['dataValues']['isRead'] != true) {
                                unread++
                            }
                        }
                        res.json({
                            result: true,
                            photo: photo,
                            user: user,
                            unread: unread
                        })
                    })
            })
            .catch(() => {
                res.json({
                    result: false
                })
            })
    } else {
        res.json({
            result: false
        })
    }
})
// LIKE PHOTO
app.get('/db/user/photo/:id/like', function (req, res) {
    Photo.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((photo) => {
            User.findOne({
                where: {
                    id: req.session.uId
                }
            })
                .then((user) => {
                    photo.addLiker(user).then(() => {
                        photo.increment('num_of_likes', { by: 1 })
                        photo.reload().then((newly) => {
                            res.json({
                                result: true,
                                photo: newly
                            })
                        })
                    })
                })
        })
})
// UNLIKE PHOTO
app.get('/db/user/photo/:id/unlike', function (req, res) {
    Photo.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((photo) => {
            User.findOne({
                where: {
                    id: req.session.uId
                }
            })
                .then((user) => {
                    photo.removeLiker(user).then(() => {
                        photo.decrement('num_of_likes', { by: 1 })
                        photo.reload().then((newly) => {
                            res.json({
                                result: true,
                                photo: newly
                            })
                        })
                    })
                })
        })
})
// POST COMMENT
app.post('/db/user/photo/:id', function (req, res) {
    Comment.create({
        content: req.body.content,
        userId: req.session.uId,
        photoId: req.params.id
    })
        .then(() => {
            Photo.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Comment, as: 'photo_comments',
                        include: [
                            {
                                model: User, as: 'commenter',
                                attributes: ['id', 'username', 'avatar_url', 'first_name', 'last_name']
                            }]
                    }
                ],
                order: [
                    [{ model: Comment, as: 'photo_comments' }, 'createdAt', 'DESC']]
            })
                .then((photo) => {
                    photo.increment('num_of_comments', { by: 1 })
                    res.json({
                        result: true,
                        photo: photo
                    })
                })

        })
        .catch(() => {
            res.json({
                result: false
            })
        })
})
// DELETE COMMENT
app.delete('/db/user/comment/:id/:photoId', function (req, res){
    Comment.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(()=>{
        Photo.findOne({
            where: {
                id: req.params.photoId
            },
            include: [
                {
                    model: Comment, as: 'photo_comments',
                    include: [
                        {
                            model: User, as: 'commenter',
                            attributes: ['id', 'username', 'avatar_url', 'first_name', 'last_name']
                        }]
                }
            ],
            order: [
                [{ model: Comment, as: 'photo_comments' }, 'createdAt', 'DESC']]
        })
            .then((photo) => {
                photo.decrement('num_of_comments', { by: 1 })
                res.json({
                    result: true,
                    photo: photo
                })
            })
    })
    .catch(() => {
        res.json({
            result: false
        })
    })
})
// SEND PASSWORD RESET EMAIL
app.post('/db/user/password/forgot', function (req, res) {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then((user) => {
            if (user) {
                crypto.randomBytes(10, (err, buf) => {
                    var token = buf.toString('hex');
                    user.resetToken = token;
                    user.resetDeadline = Date.now() + 3600000
                    user.save().then((user) => {
                        const msg = {
                            to: req.body.email,
                            from: 'AngularGram@gmail.com',
                            subject: 'Password Reset',
                            text: 'We got a request to reset your password for Angular Gram. To reset your password click on the following link.',
                            html: '<p>We got a request to reset your password for Angular Gram.</p><p>To reset your password click on the following link:</p><a href="http://localhost:8000/reset/' + token + '">RESET PASSWORD</a><p>Token expires within an hour</p>',
                        };
                        sgMail.send(msg);
                        res.json({
                            result: true
                        })
                    })
                })
            } else {
                res.json({
                    result: false
                })
            }
        })
        .catch(() => {
            res.json({
                result: false
            })
        })
})
// VERIFY RESET TOKEN
app.get('/db/user/password/reset/:token', function (req, res) {
    User.findOne({
        where: {
            resetToken: req.params.token,
            resetDeadline: {
                [Op.gt]: new Date()
            }
        }
    })
        .then((user) => {
            if (user) {
                res.json({
                    result: true,
                    id: user['dataValues']['id']
                })
            } else {
                res.json({
                    result: false
                })
            }
        })
})
// RESET PASSWORD
app.post('/db/user/password/reset/:token', function (req, res) {
    User.findOne({
        where: {
            resetToken: req.params.token
        }
    })
        .then((user) => {
            if (user) {
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    user.password = hash;
                    user.resetToken = null;
                    user.resetDeadline = null;
                    user.save()
                        .then(() => {
                            res.json({
                                result: true
                            })
                        })
                })
            } else {
                res.json({
                    result: false
                })
            }
        })
        .catch(() => {
            res.json({
                result: false
            })
        })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./angular-app/dist/angular-app/index.html"))
});