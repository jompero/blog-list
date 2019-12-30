const router = require('express').Router()
const jwt = require ('jsonwebtoken')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const authError = () => {
  const err = new Error()
  err.name = 'AuthenticationError'
  err.message = 'Valid JSONWebToken must be provided to perform this request'
  return err
}

const authenticate = async (request, response, next) => {
  try {
    if (!request.token) return next(authError())
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken.id) {
      return next(authError())
    }
    request.user = await User.findById(decodedToken.id)
    // console.log("USER:", request.user)
    return next()
  } catch (error) {
    return next(error)
  }

}

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  response.json(blog)
})
  
router.post('/', authenticate, async (request, response, next) => {
  if (!request.user) return next()

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
    user: request.user._id,
    likes: likes
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', authenticate, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== request.user.id) {
      return next(authError())
    }
    blog.delete()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body)
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router;