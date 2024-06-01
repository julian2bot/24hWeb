const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileWidth = 16;
const tileHeight = 16;

// Charger l'image du tileset
const tileset = new Image();
tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';

const playerTileIds = {
    down: 9114,
    up: 9254,
    left: 9394,
    right: 9534
};

function drawTile(tileId, x, y, tileWidth, tileHeight, tileset) {
    const tilesPerRow = Math.floor(tileset.width / tileWidth);
    const sx = (tileId % tilesPerRow) * tileWidth;
    const sy = Math.floor(tileId / tilesPerRow) * tileHeight;
    ctx.drawImage(tileset, sx, sy, tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
}

function drawLayer(view, tileWidth, tileHeight, tileset) {
    for (let y = 0; y < view.length; y++) {
        for (let x = 0; x < view[y].length; x++) {
            const tileId = view[y][x];
            if (tileId !== -1) {
                drawTile(tileId, x, y, tileWidth, tileHeight, tileset);
            }
        }
    }
}

function drawPlayers(players, tileWidth, tileHeight, tileset) {
    players.forEach(player => {
        const playerTileId = playerTileIds[player.lastDirection];
        const playerX = player.viewX;
        const playerY = player.viewY;

        drawPlayerTile(playerTileId, playerX, playerY, tileWidth, tileHeight, tileset);

        if (player.id !== 209) { // Assuming 209 is the current player's ID
            drawPlayerName(player.name, player.team, playerX, playerY, tileWidth, tileHeight);
        }
    });
}

function drawPlayerTile(tileId, x, y, tileWidth, tileHeight, tileset) {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
            const currentTileId = tileId + (row * Math.floor(tileset.width / tileWidth)) + col;
            drawTile(currentTileId, x + col, y + row, tileWidth, tileHeight, tileset);
        }
    }
}

function drawPlayerName(name, team, x, y, tileWidth, tileHeight) {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, (x + 1) * tileWidth, y * tileHeight - 5);
    ctx.fillText(team, (x + 1) * tileWidth, y * tileHeight + tileHeight * 4 + 12);
}

function loadAndDrawMap() {
    const url = 'https://24hweb.iutv.univ-paris13.fr/server/get-update';
    const options = {
        method: 'GET',
        headers: {
            'TeamPassword': '9hq0p6WCs',
            'TeamPlayerNb': 6
        }
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données reçues :', data);
            document.getElementById('response').innerText = JSON.stringify(data, null, 2);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            data.layers.forEach(layer => {
                drawLayer(layer.view, tileWidth, tileHeight, tileset);
            });

            drawPlayers(data.players, tileWidth, tileHeight, tileset);
        })
        .catch(error => {
            console.error('Erreur de requête :', error);
        });
}

function checkHello() {
    const url = 'https://24hweb.iutv.univ-paris13.fr/server/hello';
    fetch(url)
        .then(response => response.text())
        .then(text => {
            if (text === 'Hello') {
                console.log('Réponse correcte pour /server/hello:', text);
                alert('Réponse correcte pour /server/hello: ' + text);
            } else {
                console.error('Réponse incorrecte pour /server/hello:', text);
                alert('Réponse incorrecte pour /server/hello: ' + text);
            }
        })
        .catch(error => {
            console.error('Erreur de requête pour /server/hello:', error);
        });
}

function checkUpdate() {
    const url = 'https://24hweb.iutv.univ-paris13.fr/server/get-update';
    const options = {
        method: 'GET',
        headers: {
            'TeamPassword': '9hq0p6WCs',
            'TeamPlayerNb': 6
        }
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données reçues pour /server/get-update:', data);
            if (data.player && data.team && data.layers) {
                alert('Réponse correcte pour /server/get-update');
            } else {
                console.error('Réponse incorrecte pour /server/get-update:', data);
                alert('Réponse incorrecte pour /server/get-update');
            }
        })
        .catch(error => {
            console.error('Erreur de requête pour /server/get-update:', error);
        });
}

document.getElementById('checkHello').addEventListener('click', checkHello);
document.getElementById('checkUpdate').addEventListener('click', checkUpdate);


tileset.onload = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    console.log('Tileset chargé.');
    loadAndDrawMap();
};

document.addEventListener('DOMContentLoaded', () => {
    // URL de la requête
    const url = 'https://24hweb.iutv.univ-paris13.fr/server/get-update';

    // Options de la requête GET avec en-têtes
    const options = {
        method: 'GET',
        headers: {
            'TeamPassword': '9hq0p6WCs',
            'TeamPlayerNb': 6
        }
    };

    // Envoyer la requête GET avec des en-têtes
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données reçues :', data);
            // Afficher les données sur la page
            document.getElementById('response').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Erreur de requête :', error);
        });
});

document.addEventListener('keydown', (event) =>{
    const canvas = document.getElementById('gameCanvas');
    const responseElement = document.getElementById('response');
    let lastRequestTime = 0;
    const requestInterval = 100; // 100 ms = 10 requêtes par seconde
    let blocked = false;
    const apiUrl = 'https://24hweb.iutv.univ-paris13.fr/server/move'; // Utilisez l'URL correcte pour l'endpoint /move

    canvas.focus();
    let direction;
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
    }
        
    if (direction) {
        const currentTime = Date.now();
        if (currentTime - lastRequestTime >= requestInterval) {
            lastRequestTime = currentTime;
            movePlayer(direction);
        }
    }

    async function movePlayer(direction) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'TeamPassword': '9hq0p6WCs',
                    'TeamPlayerNb': 6,
                    'Content-Type': 'application/x-www-form-urlencoded' // Utilisons le format urlencode
                },
                body: `direction=${direction}` // Formatons le corps de la requête comme x-www-form-urlencoded
            });

            if (response.ok) {
                const data = await response.json();
                responseElement.innerText = JSON.stringify(data, null, 2);
            } else if (response.status === 429) {
                handleRateLimit();
            } else {
                console.error('Erreur de requête:', response.status);
            }
        } catch (error) {
            console.error('Erreur de requête:', error);
        }
    }

    function handleRateLimit() {
        blocked = true;
        console.warn('Limite de requêtes atteinte. Attente de 10 secondes...');
        setTimeout(() => {
            blocked = false;
            console.log('Reprise des requêtes.');
        }, 10000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';
});