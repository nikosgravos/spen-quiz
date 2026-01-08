let questions = [];
let quizSubmitted = false;

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
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.id = `question-${q.id}`;

    let html = `<h3>${index + 1}. ${q.question}</h3>`;

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
          <input type="radio" name="q${q.id}" value="true"> Σωστό
        </label>
        <label>
          <input type="radio" name="q${q.id}" value="false"> Λάθος
        </label>
      `;
    }

    // Multiple choice / Image choice
    if (q.type === "multiple_choice" || q.type === "image_choice") {
      q.options.forEach(option => {
        html += `
          <label>
            <input type="radio" name="q${q.id}" value="${option}">
            ${option}
          </label>
        `;
      });
    }

    questionDiv.innerHTML = html;
    quiz.appendChild(questionDiv);
  });
}

/* =========================
   Submit / New Quiz
========================= */
function submitQuiz() {
  // Second click → reload page
  if (quizSubmitted) {
    location.reload();
    return;
  }

  quizSubmitted = true;
  let score = 0;

  questions.forEach(q => {
    const questionEl = document.getElementById(`question-${q.id}`);
    const selected = document.querySelector(
      `input[name="q${q.id}"]:checked`
    );

    let feedback = document.createElement("div");
    feedback.classList.add("answer-feedback");

    let userAnswer = null;

    if (selected) {
      if (q.type === "true_false") {
        userAnswer = selected.value === "true";
      } else {
        userAnswer = selected.value;
      }
    }

    if (userAnswer !== null && userAnswer === q.answer) {
      score++;
      questionEl.classList.add("correct");
      feedback.classList.add("correct");
      feedback.innerHTML = "✔ Σωστή απάντηση";
    } else {
      questionEl.classList.add("wrong");
      feedback.classList.add("wrong");

      const displayUserAnswer =
        userAnswer === null
          ? "Καμία απάντηση"
          : q.type === "true_false"
          ? userAnswer ? "Σωστό" : "Λάθος"
          : userAnswer;

      const displayCorrectAnswer =
        q.type === "true_false"
          ? q.answer ? "Σωστό" : "Λάθος"
          : q.answer;

      feedback.innerHTML = `
        ✖ Λάθος απάντηση<br>
        <strong>Δική σου:</strong> ${displayUserAnswer}
        <div class="correct-answer">
          <strong>Σωστή:</strong> ${displayCorrectAnswer}
        </div>
      `;
    }

    questionEl.appendChild(feedback);
  });

  showScoreModal(score, questions.length);

  // Change button text
  const btn = document.getElementById("submitBtn");
  if (btn) {
    btn.textContent = "Νέο Quiz";
  }
}

/* =========================
   Score Modal
========================= */
function showScoreModal(score, total) {
  const modal = document.createElement("div");
  modal.className = "score-modal";

  modal.innerHTML = `
    <div class="score-box">
      <h2>Αποτέλεσμα</h2>
      <p>${score} / ${total} σωστές απαντήσεις</p>
      <button onclick="this.closest('.score-modal').remove()">
        Κλείσιμο
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}
