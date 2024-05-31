


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Charger l'image du tileset
const tileset = new Image();
tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';

// Fonction pour dessiner une tuile sur le canvas
function drawTile(tileId, x, y, tileWidth, tileHeight, tileset) {
    const tilesPerRow = Math.floor(tileset.width / tileWidth);
    const sx = (tileId % tilesPerRow) * tileWidth;
    const sy = Math.floor(tileId / tilesPerRow) * tileHeight;
    ctx.drawImage(tileset, sx, sy, tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
}

// Fonction pour dessiner une couche
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

// Fonction pour dessiner un joueur sur le canvas
function drawPlayers(players, tileWidth, tileHeight) {
    players.forEach(player => {
        const playerX = player.x;
        const playerY = player.y;

        // Adapter les coordonnées du joueur pour qu'il soit visible sur le canvas
        const canvasX = playerX % (canvas.width / tileWidth);
        const canvasY = playerY % (canvas.height / tileHeight);

        // Dessiner un cercle représentant le joueur
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(canvasX * tileWidth + tileWidth / 2, canvasY * tileHeight + tileHeight / 2, tileWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Dessiner le nom du joueur au-dessus de sa tête
        drawPlayerName(player.name, canvasX, canvasY, tileWidth, tileHeight);
    });
}

// Fonction pour dessiner le nom du joueur
function drawPlayerName(name, x, y, tileWidth, tileHeight) {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, x * tileWidth + tileWidth / 2, y * tileHeight - 5);
}

// Charger les données JSON depuis l'API et dessiner les couches et les joueurs
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

            const tileWidth = 16;
            const tileHeight = 16;
            data.layers.forEach(layer => {
                drawLayer(layer.view, tileWidth, tileHeight, tileset);
            });

            const players = [data.player, ...data.player.messages.map(m => ({
                name: m.name,
                x: m.x,
                y: m.y
            }))];
            drawPlayers(players, tileWidth, tileHeight);
        })
        .catch(error => {
            console.error('Erreur de requête :', error);
        });
}

// Vérifier que la requête "hello" répond bien "Hello"
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

// Vérifier que la requête "get-update" renvoie bien un objet JSON contenant "player", "team", "layers"
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

// Initialiser et charger la carte une fois le tileset chargé
tileset.onload = () => {
    console.log('Tileset chargé.');
    loadAndDrawMap();
};

document.addEventListener('DOMContentLoaded', () => {
    tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';
});
