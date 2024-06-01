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
    const message = event.data;
    if (message === "redraw") {
        // Rafraîchissement de l'affichage
        console.log("Redraw received. Refreshing display...");
        // Implémentez la logique de rafraîchissement de l'affichage ici
    } else {
        try {
            const jsonData = JSON.parse(message);
            console.log("Message reçu du serveur WebSocket:", jsonData);
            // Afficher les messages du chat
            displayChatMessage(jsonData);
        } catch (error) {
            console.error("Erreur lors de l'analyse du message JSON:", error);
        }
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


    function checkUpdate() {
        const url = 'https://24hweb.iutv.univ-paris13.fr/server/get-update';
        const options = {
            method: 'GET',
            headers: {
                'TeamPassword': '9hq0p6WCs',
                'TeamPlayerNb': 6
            }
        };
    
        // Retourner une promesse
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur HTTP : ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Données reçues pour /server/get-update:', data);
                if (data.player && data.team && data.layers) {
                    return data; // Retourner les données si elles sont correctes
                } else {
                    throw new Error('Réponse incorrecte pour /server/get-update');
                }
            })
            .catch(error => {
                console.error('Erreur de requête pour /server/get-update:', error);
                throw error; // Propager l'erreur
            });
    }

    

    // Fonction pour envoyer un message via la requête POST /say
    function sendMessage(message) {
        const url = 'https://24hweb.iutv.univ-paris13.fr/server/say';
    
        // Appel à la fonction checkUpdate pour récupérer les données
        checkUpdate()
            .then(data => {
                // Construire le corps de la requête avec les données récupérées
                const requestBody = {
                    id: generateUniqueId(),
                    player: data.player.id,
                    name: data.player.name,
                    team: data.player.team,
                    important: false, // Vous devez définir cela en fonction de votre logique
                    date: data.date, // Utilisation de la date provenant des données reçues
                    text: message,
                    x: data.player.x,
                    y: data.player.y
                };
    
                // Options de la requête POST
                const options = {
                    method: 'POST',
                    headers: {
                        'TeamPassword': '9hq0p6WCs',
                        'TeamPlayerNb': 6,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                };
    
                // Envoi de la requête POST
                fetch(url, options)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur HTTP : ' + response.status);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Réponse du serveur pour /server/say:', data);
                        // Traitez la réponse ici si nécessaire
                        // Envoyer un message "redraw" à tous les joueurs à proximité
                        sendRedrawMessage();
                    })
                    .catch(error => {
                        console.error('Erreur de requête pour /server/say:', error);
                    });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données avec checkUpdate:', error);
            });
    }
    
    // Fonction pour envoyer un message "redraw" à tous les joueurs à proximité
    function sendRedrawMessage() {
        const redrawMessage = "redraw";
        ws.send(redrawMessage);
    }
    
    

    function generateUniqueId() {
        // Générer un identifiant unique en combinant la date actuelle avec un nombre aléatoire
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return timestamp + '-' + random;
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
