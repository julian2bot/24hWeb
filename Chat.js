const canvas = document.getElementById('gameCanvas');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const responseElement = document.getElementById('response');
let lastRequestTime = 0;
const requestInterval = 100; // 100 ms = 10 requêtes par seconde
let blocked = false;
const apiUrl = 'https://24hweb.iutv.univ-paris13.fr/server/move'; // URL correcte pour l'endpoint /move
const wsUrl = 'wss://24hweb.iutv.univ-paris13.fr/server'; // URL du serveur WebSocket

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
    const message = JSON.parse(event.data);
    if (message.action === "redraw") {
        // Rafraîchissement de l'affichage
        console.log("Redraw received. Refreshing display...");
        // Implémentez la logique de rafraîchissement de l'affichage ici
    } else {
        console.log("Message reçu du serveur WebSocket:", message);
        // Afficher les messages du chat
        displayChatMessage(message);
    }
};

ws.onclose = function(event) {
    console.log("Connexion WebSocket fermée.");
};

ws.onerror = function(error) {
    console.error("Erreur WebSocket:", error);
};


document.addEventListener('DOMContentLoaded', () => {


    if (canvas) {
        canvas.focus();
    }

    if (chatInput) {
        // Ajoutez vos écouteurs d'événements ici
        const sendMessageButton = document.getElementById('sendMessageButton');
        if (sendMessageButton) {
            sendMessageButton.addEventListener('click', () => {
                const message = chatInput.value.trim();
                if (message !== '') {
                    sendMessage(message);
                    chatInput.value = ''; // Effacer le contenu de la zone de texte après l'envoi du message
                }
            });
        } else {
            console.error("L'élément avec l'ID 'sendMessageButton' n'a pas été trouvé.");
        }
    } else {
        console.error("L'élément avec l'ID 'chatInput' n'a pas été trouvé.");
    }

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



    

    // Fonction pour envoyer un message via la requête POST /say
    async function sendMessage(message) {
        try {
            const response = await fetch('https://24hweb.iutv.univ-paris13.fr/server/say', {
                method: 'POST',
                headers: {
                    'TeamPassword': '9hq0p6WCs',
                    'TeamPlayerNb': 6,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    x: playerPosition.x,
                    y: playerPosition.y
                })
            });

            if (response.ok) {
                console.log('Message envoyé avec succès.');
            } else {
                console.error('Erreur lors de l\'envoi du message:', response.status);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    }

    // Fonction pour afficher les messages du chat
    function displayChatMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        if (message.important) {
            messageElement.classList.add('important-message');
        }
        messageElement.innerText = `${message.name}: ${message.text}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll automatique vers le bas
    }

    // Exemple de position actuelle du joueur (à remplacer par votre logique de positionnement)
    const playerPosition = {
        x: 10,
        y: 15
    };
});
