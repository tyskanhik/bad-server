import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 30,
    message: 'Слишком много запросов с этого IP, попробуйте позже.'
});

export default limiter;