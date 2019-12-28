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
  
module.exports = {
    // dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}