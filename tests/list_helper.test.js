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
        expect(listHelper.favoriteBlog(blog)).toMatchObject(blog[0])
    })

    test('of multiple blogs is the one with most likes', () => {
        expect(listHelper.favoriteBlog(blogs)).toMatchObject(blogs[2])
    })
})

describe('mostBlogs', () => {
    test('of no blogs is null', () => {
        expect(listHelper.mostBlogs([])).toBe(null)
    })

    test('of one blog is the author of the blog itself', () => {
        const author = {
            author: "Michael Chan",
            blogs: 1
        }
        const blog = blogs.slice(0, 1)
        expect(listHelper.mostBlogs(blog)).toMatchObject(author)
    })

    test('of multiple blogs is from author with most blogs', () => {
        const author = {
            author: "Robert C. Martin",
            blogs: 3
        }
        expect(listHelper.mostBlogs(blogs)).toMatchObject(author)
    })
})

describe('mostLikes', () => {
    test('of no blogs is null', () => {
        expect(listHelper.mostLikes([])).toBe(null)
    })

    test('of one blog is the author of the blog itself', () => {
        const author = {
            author: "Michael Chan",
            likes: 7
        }
        const blog = blogs.slice(0, 1)
        expect(listHelper.mostLikes(blog)).toMatchObject(author)
    })

    test('of multiple blogs is from author with most likes', () => {
        const author = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }
        expect(listHelper.mostLikes(blogs)).toMatchObject(author)
    })
})