const Pool = require('pg').Pool;
const pool = new Pool({

    connectionString: 'postgresql://programmer:qhzbge0exQokwBlUP2yvpFfEJkkTlcNU@dpg-ct160fm8ii6s73fd37bg-a.oregon-postgres.render.com/user_coordinates_database',
    ssl: {
        rejectUnauthorized: false
    }
})

const getUsers = (request,response) => {

    pool.query('SELECT * FROM User_Coordinates',

        (error,results) => {

            if(error) {

                throw(error)
            }
            response.status(200).json(results.rows)
        }
    )

}

const getUserByUsername = (request,response) => {

    const username = request.params.username

    pool.query('SELECT * FROM User_Coordinates WHERE Username = $1',[username],

        (error,results) => {

            if(error) {

                throw(error)
            }
            response.status(200).json(results.rows)
        }

    )

}

const addUser = (request,response) => {

    const username = request.body["username"];
    const speed = request.body["speed"]
    const xPos = 100
    const yPos = 100

    pool.query(
        'INSERT INTO User_Coordinates(username, xpos, ypos, speed) VALUES ($1, $2, $3, $4) RETURNING *',
        [username,xPos,yPos,speed],
        (error, results) => {
          if (error) {
            console.log(error.message);
          }
          response.status(201).send(`User added with username: ${username}`);
        }
    );

}

const updateUser = (request,response) => {

    const username = request.params.username

    const xPos = request.body["xpos"]
    const yPos = request.body["ypos"]

    pool.query(
        'UPDATE User_Coordinates SET xpos = $1, ypos = $2 WHERE username = $3',
        [xPos,yPos,username],
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(200).send(`User modified with username: ${username}`);
        }
      );

}

const getNumUsers = (request,response) => {

    pool.query('SELECT COUNT(*) FROM User_Coordinates',

        (error,results) => {

            if(error) {

                throw(error)
            }
            response.status(200).json(results.rows)
        }
    )

}

const deleteUser = (request,response) => {

    const username = request.params.username

    pool.query('DELETE FROM User_Coordinates WHERE username = $1',[username],
        (error,results) => {

            if(error) {

                throw(error)
            }
            response.status(204).send('User deleted with username ' + username)

        }
    )

}

module.exports = {

    updateUser,
    addUser,
    getUserByUsername,
    getUsers,
    getNumUsers,
    deleteUser
}