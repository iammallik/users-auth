const Pool = require('pg').Pool
const jwt = require('./jwt_helper')
const bcrypt = require('bcrypt');
const utils = require('./utils')
/** 
 * read info from env file
 */
const pool = new Pool({
    user: 'mallik',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
})

const getUserProfile = (request, response) => {

    if (!request.headers || !request.headers.authorization) {
        response.status(400).json({
            "success": false,
            "message": "Auth token is not supplied!"
        })
        return;
    }

    try {
        user_name = jwt.verifyToken(request)
        pool.query('SELECT * FROM ausers WHERE name = $1', [user_name], (error, results) => {
            if (error) {
                // throw error
                response.status(400).json({
                    "success": true,
                    message: error.message
                })
            } else if(results.rows.length <= 0){
                response.status(200).json({
                    "success": true,
                    message: "Token is invalid"
                })
            }else{
                new_response = results.rows[0]
                delete new_response['password']
                response.status(200).json({
                    "success": true,
                    message: results.rows[0]
                })
            }
        })
    } catch (err) {
        response.status(403).json({
            "success": false,
            "message": "unauthorized"
        })
    }
}

const signInUser = (request, response) => {
    var {
        email,
        password
    } = request.body

    if ( !email || !password) {
        response.status(400).json({
            "success": false,
            "message": "ensure email, password fields are present!"
        })
        return;
    }

    pool.query('SELECT * FROM ausers WHERE email = $1', [email], (error, results) => {
        if (error) {
            response.status(400).json({
                "success": false,
                message: error.message
            })
            return;

        }else if(results.rows.length <= 0){
            response.status(400).json({
                "success": false,
                message: "No user found with given email"
            })
            return;
        } 
        else{
            hash_password = results.rows[0].password
            user_name = results.rows[0].name
            bcrypt.compare(password, hash_password, function(err, res) {
                if(res) {
                    try {
                        token = jwt.generateToken(user_name)
                        response.status(200).send({
                            "success": true,
                            "message": "",
                            "token": token
                        })
                    } catch (err) {
                        response.status(500).send({
                            "success": false,
                            "message": err.message
                        })
                    }
                 
                } else {
                    response.status(400).json({
                        "success": false,
                        message: "Password entered is wrong"
                    })
                    return;
                } 
              });
        }
    })
}

const signUpUser = (request, response) => {
    var {
        name,
        email,
        password
    } = request.body

    if (!name || !email || !password) {
        response.status(400).json({
            "success": false,
            "message": "ensure name, email, password fields are present!"
        })
        return;
    }

    if (!utils.validateEmail(email)) {
        response.status(400).json({
            "success": false,
            "message": "enter valid email address!"
        })
        return;
    }

    // console.log("values: %s, %s, %s ", name, email, password)

    bcrypt.hash(password, parseInt(process.env.PASSWORD_SALTING_ROUNDS, 10), function(err, hash) {
        // Store hash in your password DB.

        if (err) {
            response.status(500).json({
                "success": false,
                "message": err.message
            })
            return;
        }

        pool.query('INSERT INTO ausers (name, email, password) VALUES ($1, $2, $3)', [name, email, hash], (error, results) => {
            if (error) {
                response.status(400).send({
                    "success": false,
                    "message": error.message
                })
            } else {
                try {
                    console.log("%s %s", "here is name sending to bycrypt", name)
                    console.log(results)
                    token = jwt.generateToken(name)
                    response.status(201).send({
                        "success": true,
                        "message": "User is added",
                        "token": token
                    })
                } catch (err) {
                    response.status(500).send({
                        "success": false,
                        "message": err.message
                    })
                }
            }
        })
      });
}

const updateProfile = (request, response) => {
    const {
        name,
        password
    } = request.body

    if (!name || !password) {
        response.status(400).json({
            "success": false,
            "message": "ensure name, password fields are present!"
        })
        return;
    }

    pool.query('SELECT * FROM ausers WHERE name = $1', [name], (error, results) => {
        if (error) {
            response.status(400).json({
                "success": false,
                message: error.message
            })
            return;

        }else if(results.rows.length <= 0){
            response.status(400).json({
                "success": false,
                message: "No user found with given name"
            })
            return;
        } 
        else{
            hash_password = results.rows[0].password
            console.log("reading from console")
            console.log(hash_password)
            bcrypt.compare(password, hash_password, function(err, res) {
                if(res) {
                    pool.query(
                        'UPDATE ausers SET email = $1 WHERE name = $2',
                        [results.rows[0].email, name],
                        (error, results) => {
                            if (error) {
                                response.status(400).send({
                                    "success": false,
                                    "message": error.message
                                })
                                return;
                            }
                            response.status(200).send({
                                "success": true,
                                "message": "succefully updated"
                            })
                        }
                    )
                 
                } else {
                    response.status(400).json({
                        "success": false,
                        message: "Password entered is wrong"
                    })
                    return;
                } 
              });
        }
    })
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM ausers WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else response.status(200).send(`User deleted with ID: ${id}`)
    })
}

const getUsers = (request, response) => {
    pool.query('SELECT * FROM ausers ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        } else response.status(200).json({
            "success": true,
            "message": results.rows
        })
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM ausers WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).json({
                "success": false,
                message: error.message
            })
        } else response.status(200).json({
            "success": true,
            message: results.rows
        })
    })
}

module.exports = {
    getUsers,
    getUserById,
    signUpUser,
    deleteUser,
    signInUser,
    getUserProfile,
    updateProfile
}