const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Name is required!",
        },
        email: {
            type: String,
            required: "Email is required!",
        },
        password: {
            type: String,
            required: "Password is required!",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.statics.findActiveUsers = function (callback) {
    return mongoose.model('User').find({ status: true }, callback);
}

userSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(name, 'i') })
}
userSchema.query.byEmail = function (email) {
    return this.where({ email: new RegExp(email, 'i') })
}

module.exports = mongoose.model("User", userSchema);