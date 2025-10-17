const { body, validationResult } = require('express-validator');

// Validation middleware for product creation
exports.validateProduct = [
    // Validate name
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
    
    // Validate description
    body('description')
        .trim()
        .notEmpty().withMessage('Product description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    
    // Validate price
    body('price')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price is required'),
    
    // Validate category
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports', 'Other'])
        .withMessage('Invalid category'),
    
    // Validate stock
    body('stock')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
        .notEmpty().withMessage('Stock is required'),
    
    // Handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

// Middleware to validate image files
exports.validateImages = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'At least one product image is required'
        });
    }
    
    // Check each file's mimetype
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));
    
    if (invalidFiles.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.'
        });
    }
    
    next();
};