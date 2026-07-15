// function ask() {
//   const question = document.getElementById("question").value;
//   const csrfToken = document.getElementById("csrf").value;

//   console.log("Question:", question);

//   fetch("/ask/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrfToken
//     },
//     body: JSON.stringify({ question })
//   })
//   .then(res => {
//     console.log("Status:", res.status);
//     return res.json();
//   })
//   .then(data => {
//     console.log("Response:", data);
//     document.getElementById("answer").innerText = data.answer;
//   })
//   .catch(err => {
//     console.error("Fetch error:", err);
//   });
// }



const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typing");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function ask() {
  const question = document.getElementById("question").value;
  const csrf = document.getElementById("csrf").value;

  if (!question) return;

  addMessage(question, "user");
  document.getElementById("question").value = "";

  typing.style.display = "block";

  fetch("/ask/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf
    },
    body: JSON.stringify({ question })
  })
  .then(res => res.json())
  .then(data => {
    typing.style.display = "none";
    addMessage(data.answer, "ai");
  })
  .catch(() => {
    typing.style.display = "none";
    addMessage("Error occurred", "ai");
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
