const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    }]

const dummyBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
}

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the initial blogs are present', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

test('id of blog is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('new blog can be added', async () => {
    const postResponse = await api
        .post('/api/blogs')
        .send(dummyBlog)
        .expect(201)
    expect(postResponse.body.id).toBeDefined()

    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body.length).toBe(initialBlogs.length + 1)
})

test('new blog has 0 likes', async () => {
    const postResponse = await api
        .post('/api/blogs')
        .send(dummyBlog)
    expect(postResponse.body.likes).toBe(0)
})

test('new blog fails with empty content', async () => {
    await api.post('/api/blogs')
        .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})