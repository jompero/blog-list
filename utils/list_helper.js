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
  
module.exports = {
    // dummy,
    totalLikes,
    favoriteBlog
}