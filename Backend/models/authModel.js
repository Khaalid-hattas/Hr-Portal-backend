import db from '../../config/db.js';

const getUserByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    return rows[0];
};

export {
    getUserByUsername
};
