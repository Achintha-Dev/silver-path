import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,                // max 10 login attempts per 15 minutes
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});


export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,               // max 100 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many requests. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});