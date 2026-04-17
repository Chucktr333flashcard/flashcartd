if (!localStorage.getItem("flashcards")) {
    localStorage.setItem("flashcards", JSON.stringify({
        francais: [],
        math: [],
        ses: [],
        histoire: [],
        science: []
    }));
}

let quizCartes = [];
let indexQuiz = 0;

let matiere = "";


// Charger toutes les données (VERSION SÉCURISÉE)
function getData() {
    try {
        let data = localStorage.getItem("flashcards");

        if (!data) throw new Error("vide");

        let parsed = JSON.parse(data);

        // vérification structure minimale
        if (!parsed.francais || !parsed.math || !parsed.ses) {
            throw new Error("structure invalide");
        }

        return parsed;

    } catch (e) {
        console.log("Reset auto flashcards");

        let defaultData = {
            francais: [],
            math: [],
            ses: [],
            histoire: [],
            science: []
        };

        localStorage.setItem("flashcards", JSON.stringify(defaultData));

        return defaultData;
    }
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

    if (!data[matiere]) return;

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

// Mélange CORRECT (Fisher-Yates)
function melanger(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Lancer quiz
function lancerQuiz() {
    let data = getData();

    if (!data[matiere] || data[matiere].length === 0) {
        alert("Aucune flashcard !");
        return;
    }

    quizCartes = melanger([...data[matiere]]);
    indexQuiz = 0;

    document.getElementById("liste").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    document.querySelector(".form").classList.add("hidden");

    afficherQuestion();
}

// Afficher question (sécurisé)
function afficherQuestion() {
    if (!quizCartes[indexQuiz]) return;

    let carte = quizCartes[indexQuiz];

    document.getElementById("quizQuestion").innerText = carte.question;

    let rep = document.getElementById("quizReponse");
    rep.innerText = carte.reponse;
    rep.classList.add("hidden");

    // progression
    let prog = document.getElementById("progression");
    if (prog) {
        prog.innerText = `Question ${indexQuiz + 1} / ${quizCartes.length}`;
    }
}

// Voir réponse
function afficherReponse() {
    document.getElementById("quizReponse").classList.remove("hidden");
}

// Question suivante
function questionSuivante() {
    indexQuiz++;

    if (indexQuiz >= quizCartes.length) {
        alert("Quiz terminé !");
        quitterQuiz();
        return;
    }

    afficherQuestion();
}

// Quitter quiz
function quitterQuiz() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("liste").classList.remove("hidden");
    document.querySelector(".form").classList.remove("hidden");
}
async function initialiserData() {
    try {
        let data = localStorage.getItem("flashcards");

        if (!data) {
            const res = await fetch("./data.json");

            if (!res.ok) throw new Error("data.json introuvable");

            const json = await res.json();

            localStorage.setItem("flashcards", JSON.stringify(json));

            console.log("Import initial data.json OK");
        }

    } catch (e) {
        console.log("Fallback localStorage");

        localStorage.setItem("flashcards", JSON.stringify({
            francais: [],
            math: [],
            ses: [],
            histoire: [],
            science: []
        }));
    }
}

initialiserData();

initialiserData();

// Supprimer
function supprimer(index) {
    let data = getData();

    if (!data[matiere]) return;

    data[matiere].splice(index, 1);

    saveData(data);
    afficher();
}
