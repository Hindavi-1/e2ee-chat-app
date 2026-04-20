require('dotenv').config();
const { signToken, verifyToken } = require('./crypto/jwt');

const token = signToken("12345");
console.log("Generated Token:", token);

const decoded = verifyToken(token);
console.log("Decoded Token:", decoded);
