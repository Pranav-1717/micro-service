const jwt = require('jsonwebtoken')
const axios = require('axios')

module.exports.AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);


        if (!token) {
            return res.json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const response = await axios.get(`${process.env.BASE_URI}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error in middleware:", error.message); // Debugging error message
        res.status(500).json({ message: error.message });
    }
};

module.exports.captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/captain/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const captain = response.data;

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = captain;

        next();

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

