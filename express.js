const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./queries.js')

const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(cors())

app.get('/players/',db.getUsers)

app.get('/players/:username',db.getUserByUsername)

app.get('/numUsers/',db.getNumUsers)

app.post('/players/',db.addUser)

app.put('/players/:username',db.updateUser)

app.delete('/players/:username',db.deleteUser)

app.listen(PORT,() => {

    console.log('Listening on port ' + PORT)

})