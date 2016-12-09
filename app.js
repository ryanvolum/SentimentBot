const botbuilder = require('botbuilder');
const restify = require('restify');

require('./connectorSetup.js')();

const textAnalyticsAPIKey = process.env.textAnalyticsAPIKey ? process.env.textAnalyticsAPIKey : '';

// Entry point of the bot
bot.dialog('/', [
    function (session) {
        const msg = session.message.text;
        const request = require('request');
        var JSONBody = { "documents": [{ "language": "en", "id": "string", "text": msg }] };

        request.post({
            headers: { 'content-type': 'application/json', 'Ocp-Apim-Subscription-Key': textAnalyticsAPIKey },
            url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
            json: JSONBody

        }, function (error, response, body) {
            if (error) {
                session.send(error);
            } else {
                const sentimentScore = body.documents[0].score;
                if (sentimentScore > .8) {
                    session.send(":)");
                } else if (sentimentScore > .5) {
                    session.send(":|");
                } else if (sentimentScore > .3) {
                    session.send(":O");
                } else if (sentimentScore > .1) {
                    session.send(":\\");
                } else {
                    session.send(":(");
                }
                session.send("The sentiment score for your input was: " + body.documents[0].score);
            }
        });
    }
]);







