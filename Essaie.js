const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Charger l'image du tileset
const tileset = new Image();
tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';

// Charger les données JSON depuis un fichier externe
fetch('laMap.json')
  .then(response => response.json())
  .then(data => {
    // Parcourir chaque couche et les dessiner sur le canvas
    data.forEach(layer => {
      drawLayer(layer.view);
    });
  });

// Fonction pour dessiner une couche
function drawLayer(view) {
  // Parcourir les données de vue et dessiner chaque tuile
  for (let y = 0; y < view.length; y++) {
    for (let x = 0; x < view[y].length; x++) {
      const tileId = view[y][x];
      // Dessiner la tuile si ce n'est pas un espace vide
      if (tileId !== -1) {
        drawTile(tileId, x, y);
      }
    }
  }
}

// Fonction pour dessiner une tuile sur le canvas
function drawTile(tileId, x, y) {
  // Calculer les coordonnées de la tuile dans le tileset
  const tileWidth = 16;
  const tileHeight = 16;
  const tilesPerRow = Math.floor(tileset.width / tileWidth);
  const sx = (tileId % tilesPerRow) * tileWidth;
  const sy = Math.floor(tileId / tilesPerRow) * tileHeight;
  // Dessiner la tuile sur le canvas
  ctx.drawImage(tileset, sx, sy, tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
}

tileset.onload = () => {
    // Définir la largeur et la hauteur du canvas en fonction de la taille de l'image
    canvas.width= canvas.clientWidth;
    canvas.height= canvas.clientHeight;
    
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