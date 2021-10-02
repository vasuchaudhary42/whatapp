const sha256   = require("js-sha256");
const jwt      = require("jwt-then");
const Chatroom = require('../model/chatroom.model')

/**
 * @type {Router}
 */
const createChatroom = async (req, res) => {
    const { name } = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

    const chatroomExists = await Chatroom.findOne({ name });

    if (chatroomExists) throw "Chatroom with that name already exists!";

    const chatroom = new Chatroom({
        name,
    });
    Chatroom.find({}).count()
    await chatroom.save();

    res.json({
        message: "Chatroom created!",
        chatroom: chatroom
    });
};

const getAllChatroom = async (req, res) => {
    res.json(await Chatroom.find({}));
};
module.exports = { createChatroom, getAllChatroom };
