const needle = require('needle');
const config = require('dotenv').config();
const TOKEN = process.env.TWITTER_BEARER_TOKEN;

console.log("Token: ", TOKEN);

// Rules and stream URL
const rulesURL = 'httsp://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';

// Tweets with this keyword
const rules = [{value: 'giveaway'}];

// Get stream rules
async function getRules(){
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    console.log(response.body);
    return response.body;
}

// Set stream rules
async function setRules(){
    // Adding from the "rules" array.
    const data = {
        add: rules
    }

    // Since we're passing in data, we must set content-type to the correct value.
    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    });

    // console.log(response.body);
    return response.body;
}

// Delete stream rules
async function deleteRules(rules){
    // Make sure rules.data is an array.
    if(!Array.isArray(rules.data)){
        return null;
    }

    // Get all IDs.
    const ids = rules.data.map((rule) => rule.id);

    // Deleting based on ID.
    const data = {
        delete: {
            ids: ids
        }
    }

    // Since we're passing in data, we must set content-type to the correct value.
    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    });

    // console.log(response.body);
    return response.body;
}

function streamTweets() {
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    // Receive data in buffers.
    stream.on('data', (data) => {
        // Leave the "catch" part empty. This keeps the connection open even if there aren't any tweets coming in.
        try {
            const json = JSON.parse(data);
            console.log(json);
        } catch (error) {}
    })
}

(async() => {
    // Set up rules first before streaming tweets.
    let currentRules;

    try{
        // Gets all stream rules.
        currentRules = await getRules();

        // Wipes all stream rules.
        await deleteRules(currentRules);

        // Sets rules based on array.
        await setRules();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    streamTweets();
})()