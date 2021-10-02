const mongoose = require('mongoose');

/**
 * @typedef {EnforceDocument} Group
 * @property {string} name
 * @property {number} userLimit
 */

/**
 * @typedef {Model} GroupModel
 * @property {string} name
 * @property {number} userLimit
 */


module.exports = mongoose.model("Group", new mongoose.Schema({
        name: {
            type: mongoose.SchemaTypes.String,
            required: "Required"
        },
        userLimit: {
            type: mongoose.SchemaTypes.Number,
            min: 0,
            max: 10
        }
    })
);