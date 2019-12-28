const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')

// test('dummy returns one', () => {
//   const blogs = []
// 
//   const result = listHelper.dummy(blogs)
//   expect(result).toBe(1)
// })

describe('totalLikes', () => {
    test('of no blogs is 0', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
    
    test('of one blog is the same as the blog\'s', () => {
        const blog = blogs.slice(0, 1)
        expect(listHelper.totalLikes(blog)).toBe(7)
    })
    
    test('of multiple blogs is all combined', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })
})

describe('favoriteBlog', () => {
    test('of no blogs is null', () => {
        expect(listHelper.favoriteBlog([])).toBe(null)
    })

    test('of one blog is the blog itself', () => {
        const blog = blogs.slice(0, 1)
        expect(listHelper.favoriteBlog(blog)).toBe(blog[0])
    })

    test('of multiple blogs is the one with most likes', () => {
        expect(listHelper.favoriteBlog(blogs)).toBe(blogs[2])
    })
})