const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
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

module.exports = router;