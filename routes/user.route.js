const express = require('express');
const router  = express.Router();

const UserController  = require('../controllers/user.controller');
const { catchErrors } = require("../handlers/error-handler");

router.post("/login", catchErrors(UserController.login));
router.post("/register", catchErrors(UserController.register));

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