require('dotenv').config() // make sure you create an .env file first and that environment variables are loaded

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json()) // lets app use JSON from the body passed from the request

let refreshTokens = [] // array to store refresh tokens, DON'T do this in production, this is just for demonstration
console.log("current refresh tokens stored: " +refreshTokens)

// if the request body contains a token, verify it
app.post('/token', (req, res) => {
    console.log(req.body)
    const refreshToken = req.body.token // get the refresh token from the request body
    console.log("current request refresh token: " + refreshToken)
    if (refreshToken == null) return res.sendStatus(401) // if no refresh token, return 401
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // if refresh token is not in the array of refresh
    
    // if refresh token is in the array, verify it
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403) // if refresh token is invalid, return 403
            
            // if refresh token is valid, generate an access token. grab just the name because the user will pass more metadata than just the name
            const accessToken = generateAccessToken({name: user.name}) 
            res.json({ accessToken:accessToken }) // send back the access token
    })
})

app.post('/login',(req, res) => { // post because we want to CREATE a token, rather than get
    
    // authenticate username, assuming you've already authenticated this user from the login screen
    const username = req.body.username // get username from request body
    const user = { name: username } // create user object with username, ideally contains as little info as possible (for security reasons) to ID the user
    console.log("current user: " + username)
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) // create a refresh token with user information inside
    refreshTokens.push(refreshToken) // add refresh token to the array of refresh tokens
    console.log("current refresh tokens after login " + refreshTokens)
    res.json({ accessToken:accessToken, refreshToken:refreshToken }) // send back the access and refresh tokens
})

// generate an access token 
function generateAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'}) // creates an access token with user information inside
    return accessToken
}


app.listen(4000)