let questions = [];

function add() {
  const type = typeEl.value;
  const q = {
    id: Date.now(),
    type,
    question: question.value
  };

  if (image.value) q.image = image.value;

  if (type === "multiple_choice" || type === "image_choice") {
    q.options = options.value.split("\n");
    q.answer = answer.value;
  }

  if (type === "true_false") {
    q.answer = answer.value === "true";
  }

  if (type === "matching") {
    q.pairs = options.value.split("\n").map(l => {
      const [a, b] = l.split("=");
      return { left: a, right: b };
    });
  }

  questions.push(q);
  render();
}

function render() {
  list.innerHTML = questions.map(q =>
    `<div class="option">${q.question}</div>`
  ).join("");
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(questions, null, 2)]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "questions.json";
  a.click();
}
