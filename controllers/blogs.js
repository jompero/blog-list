const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})
  
router.post('/', async (request, response, next) => {
  if (!request.body.title || !request.body.url) { 
    const err = new Error()
    err.message = 'Blog must contain a title and an url'
    err.name = 'MissingArgumentsError'
    return next(err)
  }
  const blog = new Blog(request.body)
  if (!blog.likes) blog.likes = 0

  const result = await blog.save()
  response.status(201).json(result)
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