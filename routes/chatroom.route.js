const express = require('express');
const router  = express.Router();

const ChatroomController  = require('../controllers/chatroom.controller');
const { catchErrors } = require("../handlers/error-handler");


router.post("/", catchErrors(ChatroomController.createChatroom));
router.get("/", catchErrors(ChatroomController.getAllChatroom));

// router
//     .route('/')
//         .get(UserController.test)
//         .get(UserController.getUsers)
//         .post(UserController.createUser)
// ;
// router
//     .route('/:id')
//         .get(UserController.getUser)
//         .put(UserController.updateUser)
//         .delete(UserController.removeUser)
// ;

module.exports = router;