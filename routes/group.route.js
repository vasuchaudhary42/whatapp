const express = require('express');
const router  = express.Router();

const GroupController = require('../controllers/user/group.controller');

router
    .route('/')
        .get(GroupController.test)
        .get(GroupController.getGroups)
        .post(GroupController.createGroup)
;
router
    .route('/:id')
        .get(GroupController.getGroup)
        .put(GroupController.updateGroup)
        .delete(GroupController.removeGroup)
;


module.exports = router;