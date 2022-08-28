const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const client = require('mailchimp-marketing');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

client.setConfig({
    apiKey: "cef70c6b3d8b4c109084eae4be020c28-us8",
    server: "us8"
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // console.log(`${firstName} ${lastName} ${email}`);

    // res.redirect("/");

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    let jsonData = JSON.stringify(data);


    const url = "https://us8.api.mailchimp.com/3.0/lists/4887af21a7";//
    const options = {
        method: "POST",
        auth: "lordson:cef70c6b3d8b4c109084eae4be020c28-us8"
    };

    const subRequest = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        } );
    });
    subRequest.write(jsonData);
    subRequest.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
} );

app.listen(process.env.PORT || 8080, function() {
    console.log("Server running on port 8080!");
});

// Api Key:
// cef70c6b3d8b4c109084eae4be020c28-us8
// List id:
// 4887af21a7