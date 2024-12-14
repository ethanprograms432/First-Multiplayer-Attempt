let currPlayer = ''
let currPlayerName = ''
let currPlayerX = 100
let currPlayerY = 100
let currPlayerSpeed = 0

let generationCount = 0
const userSection = document.getElementById('users')
const formElements = document.getElementsByClassName('username-section')
let actualPlayers = []

function generateNewPlayer(isCurrentPlayer,xpos,ypos,username,speed)
{

    let newPlayer = document.createElement('div')
    userSection.appendChild(newPlayer)
    actualPlayers.push(newPlayer)

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

        const response = await fetch(`http:/localhost:3000/players/${playerName}`,{

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCoords)
        })

        if(response.ok) {

            const result = await response.json()
        } else {

            const errorText = await response.text()
            alert('Error with players update')
        }

    } catch(error) {

        console.log(error.message)
    }

}


document.getElementById('username-form').addEventListener('submit', async function (event) {

    event.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch('http://localhost:3000/players/', {
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

        const response = await fetch('http://localhost:3000/players/')

        if(response.ok) {

            result = await response.json()
            console.log(result)
        }

        if(generationCount === 1) {

            for (let i = 0; i < result.length; i++) {
    
                const name = result[i]["username"]
                const x = result[i]["xpos"]
                const y = result[i]["ypos"]
                const speed = result[i]["speed"]

                if(i === (result.length - 1)) {

                    generateNewPlayer(true,x,y,name,speed)
                    
                } else {

                    generateNewPlayer(false,x,y,name,speed)
                }
                
                
    
            }
    
        } else {
    
            
            for (let i = 0; i < actualPlayers.length; i++) {
    
                actualPlayers[i].style.top = `${result[i]["ypos"]}px`
                actualPlayers[i].style.left = `${result[i]["xpos"]}px`
    
            }

            if(result.length > actualPlayers.length) {

                for (let i = actualPlayers.length; i < result.length; i++) {

                    const name = result[i]["username"]
                    const x = result[i]["xpos"]
                    const y = result[i]["ypos"]
    
                    generateNewPlayer(false,x,y,name)

                }

            }
    
        }

    } catch(error) {

        console.log(error.message)
    }

    

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


