const Message = require("../models/message");

const getChat = async (req, res) => {
  const myId = req.uid;
  const otherId = req.params.otherId;

  const chatContent = await Message.find({
    $or: [
      { from: myId, to: otherId },
      { from: otherId, to: myId },
    ],
  })
    .sort({ createdAt: "asc" })
    .limit(30);

  res.json({
    ok: true,
    message: chatContent,
  });
};

module.exports = {
  getChat,
};
