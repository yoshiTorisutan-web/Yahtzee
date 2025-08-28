const categories = [
  "As (1)",
  "Deux (2)",
  "Trois (3)",
  "Quatre (4)",
  "Cinq (5)",
  "Six (6)",
  "Brelan",
  "Carré",
  "Full",
  "Petite suite",
  "Grande suite",
  "Yams",
  "Chance",
];
let des = [0, 0, 0, 0, 0];
let gardes = [false, false, false, false, false];
let lancersRestants = 3;
let joueurActuel = 0;
let scores = [
  Array(categories.length).fill(null),
  Array(categories.length).fill(null),
];

const desContainer = document.getElementById("des");
const relancerBtn = document.getElementById("relancer");
const lancersText = document.getElementById("lancers");
const badgeJoueur = document.getElementById("badge-joueur-actif");
const scoreboard = document.getElementById("scoreboard");
const resultat = document.getElementById("resultat");

function initScoreboard() {
  scoreboard.innerHTML = "";

  categories.forEach((cat, i) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="border p-2">${cat}</td>
      <td class="border p-2 cursor-pointer hover:bg-gray-100" id="score-0-${i}"></td>
      <td class="border p-2 cursor-pointer hover:bg-gray-100" id="score-1-${i}"></td>
    `;
    scoreboard.appendChild(row);

    document.getElementById(`score-0-${i}`).onclick = () => choisirScore(0, i);
    document.getElementById(`score-1-${i}`).onclick = () => choisirScore(1, i);

    // Ajouter Bonus juste après la sixième catégorie (index 5)
    if (i === 5) {
      let bonusRow = document.createElement("tr");
      bonusRow.innerHTML = `
        <td class="border p-2 font-bold bg-gray-100">Bonus => 63 pts</td>
        <td class="border p-2 font-bold" id="bonus-0">0</td>
        <td class="border p-2 font-bold" id="bonus-1">0</td>
      `;
      scoreboard.appendChild(bonusRow);
    }
  });

  // Ligne Total à la fin
  let totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td class="border p-2 font-bold bg-gray-100">Total</td>
    <td class="border p-2 font-bold" id="total-0">0</td>
    <td class="border p-2 font-bold" id="total-1">0</td>
  `;
  scoreboard.appendChild(totalRow);
}

function calculerBonus(joueur) {
  let somme = scores[joueur].slice(0, 6).reduce((a, b) => a + (b || 0), 0);
  return somme >= 63 ? 35 : 0;
}

function updateTotals() {
  const bonus0 = calculerBonus(0);
  const bonus1 = calculerBonus(1);
  document.getElementById("bonus-0").textContent = bonus0;
  document.getElementById("bonus-1").textContent = bonus1;
  document.getElementById("total-0").textContent =
    scores[0].reduce((a, b) => a + (b || 0), 0) + bonus0;
  document.getElementById("total-1").textContent =
    scores[1].reduce((a, b) => a + (b || 0), 0) + bonus1;
}

function lancerDes() {
  if (lancersRestants > 0) {
    for (let i = 0; i < 5; i++) {
      if (!gardes[i]) des[i] = Math.floor(Math.random() * 6) + 1;
    }
    lancersRestants--;
    majAffichage();
  }
}

function majAffichage() {
  desContainer.innerHTML = "";
  des.forEach((val, i) => {
    let de = document.createElement("div");
    de.textContent = val ? "🎲" + val : "🎲";
    de.className = `de w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold rounded-xl border shadow-md ${
      gardes[i]
        ? joueurActuel === 0
          ? "bg-indigo-400 border-indigo-600"
          : "bg-amber-400 border-amber-600"
        : "bg-gray-100 border-gray-400"
    }`;
    de.onclick = () => {
      gardes[i] = !gardes[i];
      majAffichage();
    };
    desContainer.appendChild(de);
  });
  lancersText.textContent = "Lancers restants : " + lancersRestants;

  // Badge joueur actif
  if (joueurActuel === 0) {
    badgeJoueur.innerHTML = `<span class="text-2xl">🟣</span><span class="text-2xl">🧑‍💼</span><p class="text-xl font-semibold text-indigo-700">Tour du Joueur 1</p>`;
  } else {
    badgeJoueur.innerHTML = `<span class="text-2xl">🟠</span><span class="text-2xl">👩‍💼</span><p class="text-xl font-semibold text-amber-700">Tour du Joueur 2</p>`;
  }

  highlightChoices();
}

function calculerScore(catIndex) {
  switch (catIndex) {
    case 0:
      return des.filter((d) => d === 1).reduce((a, b) => a + b, 0);
    case 1:
      return des.filter((d) => d === 2).reduce((a, b) => a + b, 0);
    case 2:
      return des.filter((d) => d === 3).reduce((a, b) => a + b, 0);
    case 3:
      return des.filter((d) => d === 4).reduce((a, b) => a + b, 0);
    case 4:
      return des.filter((d) => d === 5).reduce((a, b) => a + b, 0);
    case 5:
      return des.filter((d) => d === 6).reduce((a, b) => a + b, 0);
    case 6:
      return estBrelan() ? sommeDes() : 0;
    case 7:
      return estCarre() ? sommeDes() : 0;
    case 8:
      return estFull() ? 25 : 0;
    case 9:
      return estPetiteSuite() ? 30 : 0;
    case 10:
      return estGrandeSuite() ? 40 : 0;
    case 11:
      return estYams() ? 50 : 0;
    case 12:
      return sommeDes();
    default:
      return 0;
  }
}

function sommeDes() {
  return des.reduce((a, b) => a + b, 0);
}
function estBrelan() {
  return des.some((v) => des.filter((x) => x === v).length >= 3);
}
function estCarre() {
  return des.some((v) => des.filter((x) => x === v).length >= 4);
}
function estFull() {
  let c = {};
  des.forEach((d) => (c[d] = (c[d] || 0) + 1));
  return Object.values(c).includes(3) && Object.values(c).includes(2);
}
function estPetiteSuite() {
  let d = [...new Set(des)].sort();
  return (
    d.join("").includes("1234") ||
    d.join("").includes("2345") ||
    d.join("").includes("3456")
  );
}
function estGrandeSuite() {
  let d = [...new Set(des)].sort();
  return d.join("").includes("12345") || d.join("").includes("23456");
}
function estYams() {
  return des.every((d) => d === des[0]);
}

function highlightChoices() {
  if (lancersRestants === 3) {
    categories.forEach((_, i) => {
      document
        .getElementById(`score-0-${i}`)
        .classList.remove("jouable", "max-score", "zero-score");
      document
        .getElementById(`score-1-${i}`)
        .classList.remove("jouable", "max-score", "zero-score");
    });
    return;
  }

  // Calcul du score maximum pour ce lancer
  let maxScore = 0;
  categories.forEach((_, i) => {
    if (scores[joueurActuel][i] === null) {
      let s = calculerScore(i);
      if (s > maxScore) maxScore = s;
    }
  });

  categories.forEach((_, i) => {
    const cellActive = document.getElementById(`score-${joueurActuel}-${i}`);
    const cellInactive = document.getElementById(
      `score-${1 - joueurActuel}-${i}`
    );
    cellInactive.classList.remove("jouable", "max-score", "zero-score");

    if (scores[joueurActuel][i] === null) {
      let s = calculerScore(i);

      // Cas des nombres 1 à 6 : proposer si au moins un dé correspond
      if (i <= 5 && s > 0) {
        cellActive.classList.add("jouable");
        cellActive.classList.remove("max-score", "zero-score");
      }
      // Cas combinaisons : mettre en surbrillance selon maxScore
      else if (i > 5 && s === maxScore && s > 0) {
        cellActive.classList.add("max-score");
        cellActive.classList.remove("zero-score", "jouable");
      }
      // Si aucun point et derniers lancers : proposer 0
      else if (s === 0 && lancersRestants === 0) {
        cellActive.classList.add("zero-score");
        cellActive.classList.remove("max-score", "jouable");
      } else {
        cellActive.classList.remove("max-score", "zero-score", "jouable");
      }
    }
  });
}

function choisirScore(joueur, catIndex) {
  if (joueur !== joueurActuel) return;
  if (scores[joueur][catIndex] !== null) {
    alert("Case déjà remplie !");
    return;
  }
  scores[joueur][catIndex] = calculerScore(catIndex);
  document.getElementById(`score-${joueur}-${catIndex}`).textContent =
    scores[joueur][catIndex];
  updateTotals();

  joueurActuel = 1 - joueurActuel;
  lancersRestants = 3;
  gardes = [false, false, false, false, false];
  des = [0, 0, 0, 0, 0];
  majAffichage();

  if (scores[0].every((s) => s !== null) && scores[1].every((s) => s !== null))
    finDePartie();
}

function finDePartie() {
  let total1 = scores[0].reduce((a, b) => a + (b || 0), 0) + calculerBonus(0);
  let total2 = scores[1].reduce((a, b) => a + (b || 0), 0) + calculerBonus(1);

  const popup = document.getElementById("popup-victoire");
  const message = document.getElementById("popup-message");

  if (total1 > total2) {
    message.textContent = `🏆 Joueur 1 gagne avec ${total1} pts !`;
  } else if (total2 > total1) {
    message.textContent = `🏆 Joueur 2 gagne avec ${total2} pts !`;
  } else {
    message.textContent = "Égalité parfaite !";
  }

  popup.classList.remove("hidden");
  relancerBtn.disabled = true;

  // Fermer la popup
  document.getElementById("popup-close").onclick = () => {
    popup.classList.add("hidden");
  };
}

function resetGame() {
  // Réinitialiser toutes les variables
  des = [0, 0, 0, 0, 0];
  gardes = [false, false, false, false, false];
  lancersRestants = 3;
  joueurActuel = 0;
  scores = [
    Array(categories.length).fill(null),
    Array(categories.length).fill(null),
  ];
  relancerBtn.disabled = false;
  majAffichage();
  initScoreboard();

  // Masquer la popup
  document.getElementById("popup-victoire").classList.add("hidden");
}

// Événement sur le bouton Recommencer
document.getElementById("popup-restart").onclick = resetGame;

relancerBtn.addEventListener("click", lancerDes);
initScoreboard();
majAffichage();

// Afficher la popup règles
document.getElementById("btn-regles").onclick = () => {
  document.getElementById("popup-regles").classList.remove("hidden");
};

// Fermer la popup règles
document.getElementById("popup-regles-close").onclick = () => {
  document.getElementById("popup-regles").classList.add("hidden");
};
