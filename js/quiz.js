let questions = [];

/* =========================
   Utilities
========================= */
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

/* =========================
   Load Questions
========================= */
fetch("data/questions.json")
  .then(res => res.json())
  .then(data => {
    // pick 15 random questions
    questions = shuffle(data).slice(0, 15);

    // shuffle options for each MCQ
    questions.forEach(q => {
      if (q.options) {
        q.options = shuffle(q.options);
      }
    });

    renderQuiz();
  });

/* =========================
   Render Quiz
========================= */
function renderQuiz() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>${index + 1}. ${q.question}</h3>`;

    // Image (rank insignia etc.)
    if (q.image) {
      html += `
        <img 
          src="${q.image}" 
          style="width:80px; display:block; margin:8px auto;"
        >
      `;
    }

    // True / False
    if (q.type === "true_false") {
      html += `
        <label>
          <input type="radio" name="q${index}" value="true">
          Σωστό
        </label>
        <label>
          <input type="radio" name="q${index}" value="false">
          Λάθος
        </label>
      `;
    }

    // Multiple choice / Image choice
    if (q.type === "multiple_choice" || q.type === "image_choice") {
      q.options.forEach(option => {
        html += `
          <label>
            <input type="radio" name="q${index}" value="${option}">
            ${option}
          </label>
        `;
      });
    }

    card.innerHTML = html;
    quiz.appendChild(card);
  });
}

/* =========================
   Submit Quiz
========================= */
function submitQuiz() {
  let score = 0;

  questions.forEach((q, index) => {
    const selected = document.querySelector(
      `input[name="q${index}"]:checked`
    );

    if (!selected) return;

    // true / false
    if (q.type === "true_false") {
      if (String(q.answer) === selected.value) {
        score++;
      }
    }
    // multiple choice
    else {
      if (selected.value === q.answer) {
        score++;
      }
    }
  });

  alert(`Σκορ: ${score} / ${questions.length}`);
}
