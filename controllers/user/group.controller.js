const Group = require('../../model/group.model');

/**
 *
 * @type {Router}
 */
const test = async (req, res) => { res.json({}) };

/**
 *
 * @type {Router}
 */
const getGroups = async (req, res) => {
    Group.find((error, groups) => {

        if (error !== null){
            console.log(error);
            res.json([]);
            return;
        }

        res.json(groups.map((group) => group.toJSON({versionKey: false})))
    });
}

/**
 *
 * @type {Router}
 */
const getGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        res.json({
            group: group.toJSON({versionKey: false})
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
const updateGroup = async (req, res) => {

    const { id } = req.params;
    let group;

    try {
        group = await Group.findById(id);
    } catch (err) {
        res.json({
            success: false,
            errors: {message: "Not found!"}
        })
    }

    const { name, userLimit } = req.body;

    try {

        group.name = name;
        group.userLimit = userLimit;

        group.save();

        res.json({
            success: true,
            group: group.toJSON({versionKey: false})
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
const createGroup = async (req, res) => {
    try {
        const group = await Group.create(req.body);
        res.json({
            success: true,
            group: group.toJSON({versionKey: false})
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
const removeGroup = async (req, res) => {
    const { id } = req.params;
    let group;

    try {
        group = await Group.findById(id);
    } catch (err) {
        res.json({
            success: false,
            errors: {message: "Not found!"}
        })
    }

    try {

        group.remove();

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

module.exports = { test, getGroups, getGroup, createGroup, updateGroup, removeGroup };



