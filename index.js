const express = require('express')
const expressApp = express()
const path = require("path")
const fs = require('fs');
require('dotenv').config();
const port = process.env.PORT || 3003;
expressApp.use(express.static('static'))
expressApp.use(express.json());
const gTTs = require('gtts');
const {Telegraf} = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);


expressApp.listen(port, function () {
    console.log('Server listening on port ' + port);
})



expressApp.get("/", (req, res) => {
    res.json({status:200,message:"Bot is online!"});
});

bot.launch()

bot.command('start', ctx => {
    console.log(ctx.from)
        return ctx.reply(
            'Send me some text to get voice!',
        )

})


bot.on('message', ctx => {


    let text=ctx.message.text;

    let dir = 'voices/'+ctx.from.username+'/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    console.log(text);
    let file=dir+getRandomFileName()+'.mp3';
    const gtts = new gTTs(text, 'en');

    gtts.save(file, function (err, result){
        if(err) { throw new Error(err); }

        ctx.replyWithVoice({
            source: file
        })




    });




})

function getRandomFileName() {
    let timestamp = new Date().toISOString().replace(/[-:.]/g,"");
    let random = ("" + Math.random()).substring(2, 8);
    let random_number = timestamp+random;
    return random_number;
}