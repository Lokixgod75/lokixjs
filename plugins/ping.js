const { Module, isPrivate } = require("../lib/");

Module(
    {
      pattern: "ping",
      fromMe: isPrivate,
      desc: "try",
      type: "fixing",
    },
    async (message, match, m) => {
        await message.reply("hi");
    });