const db = require("../../config/db");

const getUserByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    return rows[0];
};

module.exports = {
    getUserByUsername
};