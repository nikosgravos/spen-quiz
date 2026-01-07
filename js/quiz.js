let questions = [];

fetch("data/questions.json")
  .then(r => r.json())
  .then(data => {
    questions = data;
    render();
  });

function render() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>${i + 1}. ${q.question}</h3>`;

    if (q.image) {
      html += `<img src="${q.image}" class="question-image">`;
    }

    if (q.type === "true_false") {
      html += tf(i);
    }

    if (q.type === "multiple_choice" || q.type === "image_choice") {
      q.options.forEach(o => {
        html += `
          <label class="option">
            <input type="radio" name="q${i}" value="${o}">
            ${o}
          </label>
        `;
      });
    }

    if (q.type === "matching") {
      q.pairs.forEach((p, idx) => {
        html += `
          <div class="option">
            ${p.left}
            <select data-q="${i}" data-idx="${idx}">
              <option value="">--</option>
              ${q.pairs.map(x => `<option>${x.right}</option>`).join("")}
            </select>
          </div>
        `;
      });
    }

    card.innerHTML = html;
    quiz.appendChild(card);
  });
}

function tf(i) {
  return `
    <label class="option"><input type="radio" name="q${i}" value="true"> Σωστό</label>
    <label class="option"><input type="radio" name="q${i}" value="false"> Λάθος</label>
  `;
}

function submitQuiz() {
  alert("Το quiz υποβλήθηκε.\nΟι ερωτήσεις αντιστοίχισης/εικόνας απαιτούν έλεγχο.");
}
