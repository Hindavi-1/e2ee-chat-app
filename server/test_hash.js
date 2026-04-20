const { hashPassword, comparePassword } = require('./crypto/hash');

(async () => {
    try {
        const password = "test123";

        const hashed = await hashPassword(password);
        console.log("Hashed Password:", hashed);

        const isMatch = await comparePassword(password, hashed);
        console.log("Password Match:", isMatch);

    } catch (error) {
        console.error(error);
    }
})();