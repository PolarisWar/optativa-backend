const validateUserInput = (req, res, next) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Por favor, proporciona todos los campos requeridos.'
        });
    }

    next();
};

module.exports = validateUserInput;