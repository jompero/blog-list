const errorHandler = (error, request, response, next) => {
    if (error.name === 'MissingArgumentsError') error.status = 400
    response.status(error.status || 500)
    response.json(error);
}

module.exports = {
    errorHandler
}