const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Uncorrect email!').isEmail(),
        check('password', 'Min length of password 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Uncorrect registration data!'
                })
            }
            const { email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'This email already exists!' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User created!' })

        } catch (e) {
            res.status(500).json({ message: "Something went wrong...try please again!" })
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter please correct email!').normalizeEmail().isEmpty(),
        check('password', 'Enter please password!').exists()
    ]
    ,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Uncorrect data entering to system!'
                })
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Not correct password, please repeat again!' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id });
            
        } catch (e) {
            res.status(500).json({ message: "Something went wrong...try please again!" })
        }
    });

module.exports = router;