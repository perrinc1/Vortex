const client = new Appwrite.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('alexandrelevet1971'); 

const storage = new Appwrite.Storage(client);
const BUCKET_ID = 'alexandrelevet1972'; 

async function uploadGame() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const status = document.getElementById('status');
    
    if (!file) return alert("Choisis un fichier ZIP !");
    
    status.innerText = "🚀 TRANSFERT EN COURS...";
    try {
        await storage.createFile(BUCKET_ID, Appwrite.ID.unique(), file);
        status.innerText = "✅ REÇU ! Le robot prépare le jeu...";
        fileInput.value = "";
        setTimeout(loadGames, 3000); 
    } catch (e) {
        status.innerText = "❌ ERREUR : " + e.message;
    }
}

async function loadGames() {
    const list = document.getElementById('gameList');
    try {
        const res = await storage.listFiles(BUCKET_ID);
        if (res.files.length === 0) {
            list.innerHTML = "<p>Aucun fichier trouvé.</p>";
            return;
        }
        list.innerHTML = res.files.map(file => {
            const isHTML = file.name.toLowerCase().endsWith('.html');
            return `
                <div class="game-card">
                    <span>${isHTML ? '🕹️' : '📦'} ${file.name}</span>
                    <div>
                        ${isHTML ? `<button class="btn btn-play" onclick="playGame('${file.$id}')">LANCER</button>` : ''}
                        <button class="btn btn-delete" onclick="deleteGame('${file.$id}')">SUPPRIMER</button>
                    </div>
                </div>`;
        }).join('');
    } catch (e) {
        console.error(e);
    }
}

function playGame(fileId) {
    window.open(storage.getFileView(BUCKET_ID, fileId), '_blank');
}

async function deleteGame(fileId) {
    if (!confirm("Supprimer ce fichier ?")) return;
    try {
        await storage.deleteFile(BUCKET_ID, fileId);
        loadGames();
    } catch (e) {
        alert("Erreur : " + e.message);
    }
}

loadGames();
setInterval(loadGames, 10000);
