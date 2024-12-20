let currPlayer = ''
let currPlayerName = ''
let currPlayerX = 100
let currPlayerY = 100
let currPlayerSpeed = 0

let generationCount = 0
const userSection = document.getElementById('users')
const formElements = document.getElementsByClassName('username-section')
let actualPlayers = []
let onlineUsers = []

function generateNewPlayer(isCurrentPlayer,xpos,ypos,username,speed)
{

    let newPlayer = document.createElement('div')
    userSection.appendChild(newPlayer)
    actualPlayers.push(newPlayer)
    onlineUsers.push(username)

    const R = Math.floor(Math.random() * 256)
    const G = Math.floor(Math.random() * 256)
    const B = Math.floor(Math.random() * 256)

    newPlayer.style.backgroundColor = `rgb(${R}, ${G}, ${B})`
    newPlayer.style.top = `${ypos}px`
    newPlayer.style.left = `${xpos}px`
    newPlayer.innerText = username
    newPlayer.style.color = 'white'

    if(isCurrentPlayer === true) {

        newPlayer.style.color = 'green'
        currPlayer = newPlayer
        currPlayerName = username
        currPlayerSpeed = speed
        
    }

}

function hideAllFormElements()
{

    for (let i = 0; i < formElements.length; i++) {

        formElements[i].style.display = 'none';

    }

}

async function updatePlayer(playerName,newXPos,newYPos) {

    const newCoords = {}
    newCoords["xpos"] = newXPos
    newCoords["ypos"] = newYPos

    try {

        const response = await fetch(`./players/${playerName}`,{

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCoords)
        })

        if(response.ok) {

            const result = await response.text()
        } else {

            const errorText = await response.text()
            alert('Error with players update')
        }

    } catch(error) {

        console.log(error.message)
    }

}

window.addEventListener('unload',async () => {

    try {

        const response = await fetch(`./players/${currPlayerName}`,{

            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json'
            }
        })

        if(response.ok) {

            const result = await response.json()
        } else {

            const errorText = await response.text()
            alert('Error deleting player from the database')
        }

    } catch(error) {

        console.log(error.message)
    }

})


document.getElementById('username-form').addEventListener('submit', async function (event) {

    event.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    currPlayerName = data.username
  
    try {
      const response = await fetch('./players/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const contentType = response.headers.get('Content-Type') || '';
  
      if (response.ok) {
        if (contentType.includes('application/json')) {
          const result = await response.json();
          //alert('Form submitted successfully: ' + JSON.stringify(result));
          hideAllFormElements()
          startLoop()
        } else {
          const result = await response.text();
          //alert('Form submitted successfully: ' + result);
          hideAllFormElements()
          startLoop()
        }
      } else {
        const errorText = await response.text();
        alert(`Error submitting form: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });

function startLoop() {

    setInterval(generatePlayers,1000)
}

async function generatePlayers()
{
    generationCount += 1;
    let result = {}

    try {

        const response = await fetch('./players/')

        if(response.ok) {

            result = await response.json()
        }

        if(generationCount === 1) {

            for (let i = 0; i < result.length; i++) {
    

                const name = result[i]["username"]
                const x = result[i]["xpos"]
                const y = result[i]["ypos"]
                const speed = result[i]["speed"]

                if(name === currPlayerName) {

                    generateNewPlayer(true,x,y,name,speed)
                    
                } else {

                    generateNewPlayer(false,x,y,name,speed)
                }
                
                
    
            }
    
        } else {
    

            for (let i = 0; i < result.length; i++) {
        
                const name = result[i]["username"]
                const indexOfName = onlineUsers.indexOf(name)

                if(indexOfName !== -1) {

                    actualPlayers[indexOfName].style.top = `${result[i]["ypos"]}px`
                    actualPlayers[indexOfName].style.left = `${result[i]["xpos"]}px`

                }
    
            }

            if(result.length > actualPlayers.length) {

                for (let i = actualPlayers.length; i < result.length; i++) {

                    const name = result[i]["username"]
                    const x = result[i]["xpos"]
                    const y = result[i]["ypos"]
    
                    generateNewPlayer(false,x,y,name)

                }

            } else if(result.length < actualPlayers.length) {

                for (let i = 0; i < onlineUsers.length; i++) {

                    const name = onlineUsers[i]
                    const isInGame = checkIfIsInGame(result,name)

                    if(isInGame === false) {

                        console.log('Attempting to remove ' + name)
                        actualPlayers[i].style.display = 'none';
                        
                    }
                }

            }
    
        }

    } catch(error) {

        console.log(error.message)
    }

    

}

function checkIfIsInGame(result,username) {

    for (let i = 0; i < result.length; i++) {

        if(result[i]["username"] === username) {


            return true;
        }

    }

    return false;

}


document.addEventListener('keydown', (event) => {

    if(currPlayer !== ' ') {

        switch (event.key) {

            case 'ArrowUp':

                currPlayerY -= currPlayerSpeed;
                currPlayer.style.top = `${currPlayerY}px`
                updatePlayer(currPlayerName,currPlayerX,currPlayerY)
                break;

            case 'ArrowDown':

                currPlayerY += currPlayerSpeed;
                currPlayer.style.top = `${currPlayerY}px`
                updatePlayer(currPlayerName,currPlayerX,currPlayerY)
                break;

            case 'ArrowLeft':

                currPlayerX -= currPlayerSpeed;
                currPlayer.style.left = `${currPlayerX}px`
                updatePlayer(currPlayerName,currPlayerX,currPlayerY)
                break;

            case 'ArrowRight':

                currPlayerX += currPlayerSpeed;
                currPlayer.style.left = `${currPlayerX}px`
                updatePlayer(currPlayerName,currPlayerX,currPlayerY)
                break;

        }
    }
})


