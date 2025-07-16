import axios from 'axios'
import express from 'express'
const app = express()
const port = 3000

/*
IMPORTANT:
this is a more advanced example of how to use authenticated sessions with the Fency backend API
this is only useful if you are using the Fency backend API with your own backend (a server like in this example)
in other words - you don't need this if you are only using the publishable key with React, without a backend
*/

// you can find your API key in the Fency dashboard
const FENCY_API_KEY = process.env.FENCY_API_KEY
if (!FENCY_API_KEY) {
    throw new Error('FENCY_API_KEY is not configured')
}

// our team is setting this variable when running a local instance of the Fency API during development, you don't have to set it
const FENCY_BASE_URL = process.env.FENCY_BASE_URL || 'https://api.fency.ai'

// Middleware to parse JSON bodies
app.use(express.json())

app.post('/create-chat-completion-session', async (req, res) => {
    /* 
    here we are creating a chat completion session, read more about it here: https://docs.fency.ai/docs/api/chat-completion-sessions
    this should only be used with authenticated users in your application
    you can attach a session to a user in your database and use it to track the user's conversation history
    a single session should only be used for a single chat completion
    */
    const response = await axios.post(
        `${FENCY_BASE_URL}/v1/chat-completion-sessions`,
        req.body,
        {
            headers: {
                Authorization: `Bearer ${FENCY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    )

    res.status(response.status).json(response.data.clientSecret)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
