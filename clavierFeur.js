document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const responseElement = document.getElementById('response');
    let lastRequestTime = 0;
    const requestInterval = 100; // 100 ms = 10 requêtes par seconde
    let blocked = false;
    const apiUrl = 'https://24hweb.iutv.univ-paris13.fr/server/move'; // URL correcte pour l'endpoint /move
    const wsUrl = 'wss://24hweb.iutv.univ-paris13.fr/server'; // URL du serveur WebSocket

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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ direction: direction })
            });

            if (response.ok) {
                const data = await response.json();
                responseElement.innerText = JSON.stringify(data, null, 2);
            } else if (response.status === 429) {
                handleRateLimit();
            } else {
                console.error('Erreur de requête:', response.status);
                responseElement.innerText = `Erreur de requête: ${response.status}`;
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

    // Connexion WebSocket
    const ws = new WebSocket(wsUrl);

    ws.onopen = function(event) {
        // Enregistrement au WebSocket
        const registrationMessage = {
            action: "register",
            teamPassword: "9hq0p6WCs",
            teamPlayerNb: 6
        };
        ws.send(JSON.stringify(registrationMessage));
    };

    ws.onmessage = function(event) {
        const message = event.data;
        if (message === "redraw") {
            // Rafraîchissement de l'affichage
            console.log("Redraw received. Refreshing display...");
            // Implémentez la logique de rafraîchissement de l'affichage ici
        } else {
            console.log("Message reçu du serveur WebSocket:", message);
        }
    };

    ws.onclose = function(event) {
        console.log("Connexion WebSocket fermée.");
    };

    ws.onerror = function(error) {
        console.error("Erreur WebSocket:", error);
    };
});
