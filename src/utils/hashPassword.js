const bcrypt = require('bcrypt');

const saltRounds = 10;
const generateHashedPassword = async (plainTextPassword) =>  {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainTextPassword, salt);
}

const comparePassword = async (plainTextPassword, hashedPassword) => bcrypt.compare(plainTextPassword, hashedPassword);

module.exports = { generateHashedPassword, comparePassword }  