const User = require('../../model/user.model');

/**
 *
 * @type {Router}
 */
const test = async (req, res) => {
    try {
        res.json({ user: await User.findOne().byName(req.query.name) });
        return;
        User.findActiveUsers((error, users) => res.json({ users }));
    } catch (err) {
        res.json({err})
    }
}

/**
 *
 * @type {Router}
 */
const getUsers = async (req, res) => {
    User.find((error, users) => {

        if (error !== null){
            console.log(error);
            res.json([]);
            return;
        }

        res.json(users.map((user) => user.toJSON({versionKey: false})))
    });
}

/**
 *
 * @type {Router}
 */
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.json({
            user: user.toJSON({versionKey: false})
        });
    } catch (err) {
        res.json({
            errors: {message: "Not found!"}
        })
    }
}

/**
 *
 * @type {Router}
 */
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({
            success: true,
            user: user.toJSON({versionKey: false})
        });
    } catch (err) {
        res.json({
            success: false,
            errors: { message: err.message }
        })
    }
}


/**
 *
 * @type {Router}
 */
const updateUser = async (req, res) => {

    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        res.json({
            success: false,
            errors: {message: "Not found!"}
        })
    }

    const { name, email, status } = req.body;

    try {

        user.name = name;
        user.email = email;
        user.status = status;

        user.save();

        res.json({
            success: true,
            user: user.toJSON({versionKey: false})
        });

    } catch (err) {

        res.json({
            success: false,
            errors: { message: err.message }
        })
    }
}

/**
 *
 * @type {Router}
 */
const removeUser = async (req, res) => {
    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        res.json({
            success: false,
            errors: {message: "Not found!"}
        })
    }

    try {

        user.remove();

        res.json({
            success: true
        });

    } catch (err) {

        res.json({
            success: false,
            errors: { message: err.message }
        })
    }
}

module.exports = { test, getUsers, getUser, createUser, updateUser, removeUser };



