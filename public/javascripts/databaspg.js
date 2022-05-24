const mysql = require('mysql');
const client = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "panel"
});

module.exports = {
    register_new_user: (username, email, hashed_password, time, ip_address) => {
        return new Promise((resolve, reject) => {
            client.query("INSERT INTO users (username, user_email, password_hash, registered_on, registration_ip) VALUES (?, ?, ?, ?, ?)", [username, email, hashed_password, time, ip_address], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    },
    get_user_data_username: (username) => {
        return new Promise((resolve, reject) => {
            client.query("SELECT * FROM users WHERE username = ?", [username], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    },
    update_login_information: (username, ip, time) => {
        return new Promise((resolve, reject) => {
            client.query("UPDATE users SET last_login = ?, last_ip = ? WHERE username = ?", [time, ip, username], (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(true);
            });
        });
    },
    is_username_taken: (username) => {
        return new Promise((resolve, reject) => {
            client.query("SELECT username FROM users WHERE username = ?", [username], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    },
    is_email_taken: (email) => {
        return new Promise((resolve, reject) => {
            client.query("SELECT user_email FROM users WHERE user_email = ?", [email], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    },
};