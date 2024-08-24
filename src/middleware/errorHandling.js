// middleware/errorMiddleware.js

// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware for handling all other errors
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    console.error("errorHandler : ", err.stack);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};


module.exports = { notFound, errorHandler };
