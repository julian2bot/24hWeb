document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const responseElement = document.getElementById('response');
    let lastRequestTime = 0;
    const requestInterval = 100; // 100 ms = 10 requêtes par seconde
    let blocked = false;
    const apiUrl = 'https://24hweb.iutv.univ-paris13.fr/server/move'; // Utilisez l'URL correcte pour l'endpoint /move

    canvas.focus();

    canvas.addEventListener('keydown', (event) => {
        if (blocked) return;

        const directionMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const direction = directionMap[event.key];
        if (direction) {
            const currentTime = Date.now();
            if (currentTime - lastRequestTime >= requestInterval) {
                lastRequestTime = currentTime;
                movePlayer(direction);
            }
        }
    });

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
