
// Rate limit middleware

function limiter(req, res, next) {
    res.set('X-RateLimit-Limit', 5);
    res.set('X-RateLimit-Remaining', 0);
    res.set('X-RateLimit-Reset', 0);

    next();
}









//  apply to all requests
app.use(limiter);
