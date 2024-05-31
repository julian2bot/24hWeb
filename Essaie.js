const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileset = new Image();
tileset.src = 'https://24hweb.iutv.univ-paris13.fr/tileset.png';

tileset.onload = () => {
    const tileWidth = 16;
    const tileHeight = 16;
    const tilesPerRow = tileset.width / tileWidth;
    const map = [
        [73,74,73,74,73,74,73,74,73,74,73,74,73,74,713,714,73,74,73,74,73],
        [108,109,108,109,108,109,108,109,108,109,108,109,108,109,748,749,108,109,108,109,108],
        [73,74,73,74,73,74,73,74,73,74,73,74,73,74,748,749,73,74,73,74,73],
        [108,109,108,109,108,109,108,109,108,109,108,109,108,109,748,749,108,109,108,109,108],
        [283,283,283,283,283,284,73,74,73,74,73,74,73,74,748,749,73,74,73,74,73],
        [318,318,318,318,283,283,283,284,108,109,108,109,108,109,748,749,108,109,108,109,108],
        [73,74,73,74,318,318,283,283,284,74,73,74,73,74,748,749,73,74,73,74,73],
        [108,109,108,109,108,109,318,283,284,109,108,109,108,109,748,749,108,109,108,109,108],
        [73,74,73,74,73,74,73,283,284,74,73,74,73,74,748,749,73,74,73,74,73],
        [108,109,108,109,108,109,108,283,284,109,108,109,108,109,748,749,108,109,108,109,108],
        [73,74,73,74,73,74,73,283,284,74,73,74,73,74,748,749,73,74,73,74,73],
        [108,109,108,109,108,109,108,283,284,109,108,109,108,109,748,749,108,109,108,109,108],
        [713,713,713,713,714,74,73,283,284,74,73,74,73,74,748,749,73,74,73,74,73],
        [748,748,748,748,713,713,713,713,713,713,713,713,713,713,748,749,108,109,108,109,108],
        [73,74,73,74,748,748,748,748,748,748,748,748,748,748,748,749,73,74,73,74,73],
        [108,109,108,109,108,109,108,283,284,109,108,109,108,109,108,109,108,109,108,109,108],
        [73,74,73,74,73,74,73,3853,3854,74,93,93,93,74,93,74,93,74,93,74,73],
        [108,109,108,109,108,109,108,3888,3889,109,108,109,93,109,93,109,93,109,93,109,108],
        [73,74,73,74,73,74,73,3923,3924,74,93,93,93,74,93,93,93,74,93,93,93],
        [108,109,108,109,108,109,108,3958,3959,109,93,109,108,109,108,109,93,109,93,109,93],
        [73,74,73,74,73,74,73,3993,3994,74,93,93,93,74,73,74,93,74,93,74,93]
    ];


    canvas.width = map[0].length * tileWidth; // Définir la largeur du canvas en fonction de la largeur de la carte
    canvas.height = map.length * tileHeight; // Définir la hauteur du canvas en fonction de la hauteur de la carte

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tileId = map[y][x];
            const sx = (tileId % tilesPerRow) * tileWidth;
            const sy = Math.floor(tileId / tilesPerRow) * tileHeight;
            drawTile(sx, sy, tileWidth, tileHeight, x * tileWidth, y * tileHeight);
        }
    }
};

fetch('map-layers.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(layer => {
      drawLayer(layer.view);
    });
  });

function drawLayer(layerData) {
  for (let y = 0; y < layerData.length; y++) {
    for (let x = 0; x < layerData[y].length; x++) {
      const tileId = layerData[y][x];
      // Dessiner le tile correspondant en fonction de son ID
      drawTile2(tileId, x, y);
    }
  }
}


function drawTile2(tileId, x, y) {
    ctx.drawImage(tileId, sx, sy, tileWidth, tileHeight, x, y, tileWidth, tileHeight);
}

function drawTile(sx, sy, tileWidth, tileHeight, dx, dy) {
    ctx.drawImage(tileset, sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
}