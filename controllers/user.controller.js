const sha256 = require("js-sha256");
const jwt    = require("jwt-then");
const User   = require('../model/user.model')

/**
 * @type {Router}
 */
const register = async (req, res) => {
    const {name, email, password} = req.body;

    const emailRegex = /@webkul.com|@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
    if (password.length < 6) throw "Password must be at least 6 characters long.";

    let user = await User.findOne({ email });

    if (user) throw "User with same email already exits.";

    user = new User({
        name,
        email,
        password: sha256(password + process.env.SALT),
    });

    await user.save();

    res.json({
        message: "User [" + name + "] registered successfully!",
    });
}

/**
 * @type {Router}
 */
const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT)
    })

    if (!user) throw "Email and Password did not match.";

    const token = await jwt.sign({id: user.id}, process.env.SECRET)

    res.json({
        message: "User logged in successfully",
        token
    })
}

module.exports = { register, login };