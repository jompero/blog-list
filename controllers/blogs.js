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

  //const user = await User.findOne({})
  const likes = body.likes ? body.likes : 0
  console.log("likes:", likes)

  console.log('user,', request.user)

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    user: request.user._id,
    likes: likes
  })

  try {
    const savedBlog = await blog.save()
    console.log('blog saved', savedBlog)
    const user = request.user
    user.blogs = user.blogs ? user.blogs.concat(savedBlog._id) : [ savedBlog._id ]
    const savedUser = await user.save()
    console.log('user saved', savedUser)
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
    const user = request.user
    user.blogs = user.blogs.filter(id => id.toString() !== blog._id.toString())
    console.log('Updated blogs', user.blogs)
    user.save()
    blog.delete()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true }).populate('user', { username: 1, name: 1 })
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router;