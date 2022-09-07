# Twitter Streaming Notes

## [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)

From the Developer Portal, you can go to the "Projects and Apps" section and add your apps. When you create an app, you will get an API key, an API secret key and Bearer token. This bearer token must be specified when sending the request to the API. You can either put this token in an environment variable or you can make a request to the OAuth endpoint with your API and secret API keys which will return the same token.

Dependencies:
- Express
- Socket.IO
- Needle - HTTP client to get tweets, set rules
- dotenv - For setting environment variables
- nodemon (optional) - Don't need to restart server everytime you change something.