const errorHandler = (error, request, response, next) => {
    if (error.name === 'MissingArgumentsError' || error.name === 'ValidationError') {
        error.status = 400
    } else if (error.name === 'AuthenticationError' || error.name === 'JsonWebTokenError' || error.name === 'AuthorizationError') {
        error.status = 401
    } else {
        error.status = 500
    }
    response.status(error.status)
    response.json(error)
}

const tokenExtractor = (request, response, next) => {
    console.log('Extracting token ...')
    const authorization = request.get('authorization')
    console.log('Auth:', authorization)

    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        request.token = authorization.substring(7)
        console.log('Token:', request.token)
    } else {
        console.log('No token')
    }

    return next()
}

module.exports = {
    errorHandler,
    tokenExtractor
}