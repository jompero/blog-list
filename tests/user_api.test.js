const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

const initialUsers = [
    {
        username: "Master",
        name: "Jackie Chan",
        password: "kungfu123"
    },
    {
        username: "TheQueen",
        name: "Elizabeth II",
        password: "rocknrolla123"
    }
]

const dummyUser = {
        username: "Dummy",
        name: "Mr. Bean",
        password: "password123"
    }

const invalidUsers = [{
        username: "ab",
        password: "password123"
    },
    {
        username: "abc",
        password: "p"
    },
    {
        password: "password123"
    },
    {
        username: "username"
    }
]

beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('get', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('the initial users are present', async () => {
        const response = await api.get('/api/users')
        expect(response.body.length).toBe(initialUsers.length)
    })
    
    test('id of user is defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('post', () => {
    test('user is added to database', async () => {
        await api
            .post('/api/users')
            .send(dummyUser)
            .expect(200)
        
        const usersAfter = await helper.usersInDb()
        expect(usersAfter.length).toBe(initialUsers.length + 1)
        usernames = usersAfter.map(user => user.username)
        expect(usernames).toContain(dummyUser.username)
    })

    test('user must contain more than 3 characters', async () => {
        await api
            .post('/api/users')
            .send(invalidUsers[0])
            .expect(400)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter.length).toBe(initialUsers.length)
        usernames = usersAfter.map(user => user.username)
        expect(usernames).not.toContain(invalidUsers[0].username)
    })

    test('password must contain more than 3 characters', async () => {
        await api
            .post('/api/users')
            .send(invalidUsers[1])
            .expect(400)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter.length).toBe(initialUsers.length)
        usernames = usersAfter.map(user => user.username)
        expect(usernames).not.toContain(invalidUsers[1].username)
    })



    test('username is required', async () => {
        await api
            .post('/api/users')
            .send(invalidUsers[2])
            .expect(400)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter.length).toBe(initialUsers.length)
        usernames = usersAfter.map(user => user.username)
        expect(usernames).not.toContain(invalidUsers[2].username)
    })

    test('password is required', async () => {
        await api
            .post('/api/users')
            .send(invalidUsers[3])
            .expect(400)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter.length).toBe(initialUsers.length)
        usernames = usersAfter.map(user => user.username)
        expect(usernames).not.toContain(invalidUsers[3].username)
    })
})