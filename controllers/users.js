const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

router.get('/', async (request, response, next) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

router.post('/', async (request, response, next) => {
    try {
        const body = request.body
        if (!body.password || body.password.length < 3) {
            const err = new Error()
            err.message = 'Password required and must contain at least 3 characters'
            err.name = 'ValidationError'
            throw err
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })
    
        const savedUser = await user.save()
        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

module.exports = router