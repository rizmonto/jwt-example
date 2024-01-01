require('dotenv').config() // make sure you create an .env file first and that environment variables are loaded

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json()) // lets app use JSON from the body passed from the request

const posts = [
    {
        username: 'Rafael',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => { // note: calls middleware authenticateToken
    res.status(200).json(posts.filter(post => post.username === req.user.name)) // filter posts to only those with the same username as the user
})

// middleware that authenticates our token 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // ensure authHeader exists and get the token from the header
    if (!token || token == null) return res.sendStatus(401) // if no token, return 401
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) // if token is invalid, return 403
        req.user = user // if token is valid, add user to request object
        next() // if token is valid, continue to next middleware
    })
}

app.listen(3000)