let matiere = "";

// Charger toutes les données
function getData() {
    let data = localStorage.getItem("flashcards");
    return data ? JSON.parse(data) : {
        francais: [],
        math: [],
        ses: [],
        histoire: [],
        science: []
    };
}

// Sauvegarder
function saveData(data) {
    localStorage.setItem("flashcards", JSON.stringify(data));
}

// Choisir matière
function choisirMatiere(m) {
    matiere = m;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("titre").innerText = m;

    afficher();
}

// Retour
function retour() {
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
}

// Ajouter flashcard
function ajouter() {
    const question = document.getElementById("question").value;
    const reponse = document.getElementById("reponse").value;

    if (!question || !reponse) return;

    let data = getData();

    data[matiere].push({
        question: question,
        reponse: reponse
    });

    saveData(data);

    document.getElementById("question").value = "";
    document.getElementById("reponse").value = "";

    afficher();
}

// Afficher flashcards
function afficher() {
    let data = getData();
    let liste = document.getElementById("liste");

    liste.innerHTML = "";

    data[matiere].forEach((c, i) => {
        let div = document.createElement("div");
        div.className = "flashcard";

        div.innerHTML = `
            <b>Q:</b> ${c.question}<br>
            <b>R:</b> ${c.reponse}<br>
            <button onclick="supprimer(${i})">Supprimer</button>
        `;

        liste.appendChild(div);
    });
}

// Supprimer
function supprimer(index) {
    let data = getData();

    data[matiere].splice(index, 1);

    saveData(data);
    afficher();
}