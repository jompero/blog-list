const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await (await Blog.findById(request.params.id)).populated('user', { username: 1, name: 1 })
  response.json(blog)
})
  
router.post('/', async (request, response, next) => {
  const { body } = request

  if (!body.title || !body.url) { 
    const err = new Error()
    err.message = 'Blog must contain a title and an url'
    err.name = 'MissingArgumentsError'
    return next(err)
  }

  const user = await User.findOne({})
  const likes = body.likes ? body.likes : 0
  console.log("likes:", likes)

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    user: user._id,
    likes: likes
  })

  try {
    const savedBlog = await blog.save()
    // user.blogs = user.blogs ? user.blogs.concat(savedBlog._id) : [ savedBlog._id]
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

router.put('/:id', async (request, response, next) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.json(blog)
})

module.exports = router;