const _ = require('lodash')
// const seq = require('lodash/seq')

// const dummy = (blogs) => {
//     return 1
//   }

const totalLikes = (blogs) => {
    return blogs.reduce((total, { likes }) => total + likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length == 0) return null
    return blogs.reduce((previous, current) => 
        previous.likes > current.likes 
            ? previous 
            : current)
}

const mostBlogs = (blogs) => {
    if (blogs.length == 0) return null
    const author = _.chain(blogs)
        .countBy((blog) => { return blog.author })
        .entries()
        .maxBy(_.last)
        .value()
    const result = { author: _.head(author), blogs: _.last(author) }
    // console.log(result)
    return result
}

const mostLikes = (blogs) => {
    if (blogs.length == 0) return null
    const author = _.chain(blogs)
        .groupBy((blog) => { return blog.author })
        .entries()
        .map((blog) => {
            const ret = {}
            ret.author = _.head(blog)
            ret.likes = _.last(blog).reduce((total, blog) => total + blog.likes, 0)
            return ret
        })
        .maxBy('likes')
        .value()
    // console.log("result:", author)
    return author
}
  
module.exports = {
    // dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}