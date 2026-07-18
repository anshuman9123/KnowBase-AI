// // function ask() {
// //   const question = document.getElementById("question").value;
// //   const csrfToken = document.getElementById("csrf").value;

// //   console.log("Question:", question);

// //   fetch("/ask/", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       "X-CSRFToken": csrfToken
// //     },
// //     body: JSON.stringify({ question })
// //   })
// //   .then(res => {
// //     console.log("Status:", res.status);
// //     return res.json();
// //   })
// //   .then(data => {
// //     console.log("Response:", data);
// //     document.getElementById("answer").innerText = data.answer;
// //   })
// //   .catch(err => {
// //     console.error("Fetch error:", err);
// //   });
// // }



// const chatBox = document.getElementById("chat-box");
// const typing = document.getElementById("typing");

// function addMessage(text, sender) {
//   const div = document.createElement("div");
//   div.className = sender;
//   div.innerText = text;
//   chatBox.appendChild(div);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// function ask() {
//   const question = document.getElementById("question").value;
//   const csrf = document.getElementById("csrf").value;

//   if (!question) return;

//   addMessage(question, "user");
//   document.getElementById("question").value = "";

//   typing.style.display = "block";

//   fetch("/ask/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrf
//     },
//     body: JSON.stringify({ question })
//   })
//   .then(res => res.json())
//   .then(data => {
//     typing.style.display = "none";
//     addMessage(data.answer, "ai");
//   })
//   .catch(() => {
//     typing.style.display = "none";
//     addMessage("Error occurred", "ai");
//   });
// }

// function toggleTheme() {
//   document.body.classList.toggle("dark");
// }
// ============================================
// KnowBase AI — chat / ask page interactions
// composer · thinking states · message rendering
// ============================================

(function () {
  "use strict";

  var DEMO_MODE = false; // set to false once wired to your Django endpoint below

  var chatScroll = document.getElementById("chatScroll");
  var emptyState = document.getElementById("emptyState");
  var messagesEl = document.getElementById("messages");
  var thinkingEl = document.getElementById("thinking");
  var thinkingLabel = document.getElementById("thinkingLabel");
  var form = document.getElementById("composerForm");
  var input = document.getElementById("queryInput");
  var sendBtn = document.getElementById("sendBtn");
  var suggestions = document.getElementById("suggestions");

  /* ---- background index bars (same signature as upload page) ---- */
  var field = document.getElementById("indexField");
  if (field) {
    var barCount = window.innerWidth < 600 ? 20 : 36;
    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement("span");
      bar.style.height = 20 + Math.random() * 90 + "px";
      bar.style.animationDelay = (Math.random() * 3.6).toFixed(2) + "s";
      bar.style.animationDuration = (2.8 + Math.random() * 2).toFixed(2) + "s";
      field.appendChild(bar);
    }
  }

  /* ---- textarea auto-resize + send button state ---- */
  function autoResize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  }

  function refreshSendState() {
    sendBtn.disabled = input.value.trim().length === 0;
  }

  input.addEventListener("input", function () {
    autoResize();
    refreshSendState();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  /* ---- suggestion chips ---- */
  if (suggestions) {
    suggestions.addEventListener("click", function (e) {
      var chip = e.target.closest(".suggestion-chip");
      if (!chip) return;
      input.value = chip.dataset.prompt;
      autoResize();
      refreshSendState();
      input.focus();
    });
  }

  /* ---- scroll helper ---- */
  function scrollToBottom() {
    requestAnimationFrame(function () {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    });
  }

  /* ---- render a user message ---- */
  function addUserMessage(text) {
    var msg = document.createElement("div");
    msg.className = "msg user";
    msg.innerHTML = '<div class="msg-bubble"></div>';
    msg.querySelector(".msg-bubble").textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  /* ---- render an AI message with citations ---- */
  function addAIMessage(answer, sources, grounded) {
    var msg = document.createElement("div");
    msg.className = "msg ai";

    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = answer;
    msg.appendChild(bubble);

    var meta = document.createElement("div");
    meta.className = "msg-meta";

    var badge = document.createElement("span");
    badge.className = "grounded-badge" + (grounded ? "" : " low");
    badge.textContent = grounded ? "Answered from source" : "Low confidence match";
    meta.appendChild(badge);

    if (sources && sources.length) {
      var pills = document.createElement("div");
      pills.className = "source-pills";
      sources.forEach(function (s) {
        var pill = document.createElement("span");
        pill.className = "source-pill";
        pill.textContent = "\ud83d\udcc4 " + s;
        pills.appendChild(pill);
      });
      meta.appendChild(pills);
    }

    msg.appendChild(meta);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  /* ---- thinking indicator staging ---- */
  var thinkingTimers = [];

  function showThinking() {
    thinkingEl.hidden = false;
    thinkingLabel.textContent = "Searching document\u2026";
    scrollToBottom();
    thinkingTimers.push(setTimeout(function () {
      thinkingLabel.textContent = "Drafting answer\u2026";
    }, 750));
  }

  function hideThinking() {
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];
    thinkingEl.hidden = true;
  }

  /* ---- demo answer bank (remove once DEMO_MODE = false) ---- */
  function getDemoAnswer(question) {
    var q = question.toLowerCase();
    if (q.indexOf("summar") !== -1) {
      return {
        answer: "The document covers quarterly performance, highlighting a 12% rise in operating revenue, two new regional partnerships, and a revised risk outlook for the upcoming fiscal year.",
        sources: ["Page 2", "Page 3", "Page 9"],
        grounded: true
      };
    }
    if (q.indexOf("risk") !== -1) {
      return {
        answer: "Three risks are called out: currency exposure in the APAC region, a pending regulatory review, and dependency on a single logistics vendor for fulfillment.",
        sources: ["Page 14", "Page 15"],
        grounded: true
      };
    }
    if (q.indexOf("date") !== -1 || q.indexOf("deadline") !== -1) {
      return {
        answer: "Key dates mentioned: the board review on August 4th, the vendor contract renewal by September 1st, and the fiscal year close on December 31st.",
        sources: ["Page 6", "Page 21"],
        grounded: true
      };
    }
    return {
      answer: "I couldn't find a section of the document that directly addresses that. Could you rephrase, or point me to a specific page or topic?",
      sources: [],
      grounded: false
    };
  }

  /* ---- real API call (wire this up, then set DEMO_MODE = false) ---- */
  function getCookie(name) {
    var match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return match ? match.pop() : "";
  }

  function askBackend(question) {
    console.log("askBackend called:", question);

    return fetch("/ask/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: JSON.stringify({ question: question })
    })
    .then(function (res) {
        console.log("Response status:", res.status);
        return res.json();
    })
    .then(function (data) {
        console.log("Backend data:", data);
        return data;
    });
}

  /* ---- submit flow ---- */
form.addEventListener("submit", function (e) {
    console.log("FORM SUBMITTED");
    e.preventDefault();
  
  
    var question = input.value.trim();
    if (!question) return;

    if (emptyState && !emptyState.hidden) {
      emptyState.style.display = "none";
    }

    addUserMessage(question);
    input.value = "";
    autoResize();
    refreshSendState();
    showThinking();

    var resolve = DEMO_MODE
      ? new Promise(function (res) {
          setTimeout(function () { res(getDemoAnswer(question)); }, 1400);
        })
      : askBackend(question);

    resolve
      .then(function (data) {
        hideThinking();
        addAIMessage(data.answer, data.sources, data.grounded);
      })
      .catch(function () {
        hideThinking();
        addAIMessage("Something went wrong reaching the document index. Please try again.", [], false);
      });
  });

  refreshSendState();
})();