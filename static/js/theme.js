// // ============================================
// KnowBase AI — interactions
// theme toggle · drag & drop · index-field bars
// ============================================

(function () {
  "use strict";

  /* ---- dark / light toggle ---- */
  var root = document.documentElement;
  var toggleBtn = document.getElementById("darkToggle");
  var stored = null;
  try { stored = localStorage.getItem("kb-theme"); } catch (e) {}

  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }

  window.toggleDark = function () {
    var current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", current);
    try { localStorage.setItem("kb-theme", current); } catch (e) {}
  };

  if (toggleBtn) {
    toggleBtn.addEventListener("click", window.toggleDark);
  }

  /* ---- signature background: vector index bars ---- */
  var field = document.getElementById("indexField");
  if (field) {
    var barCount = window.innerWidth < 600 ? 28 : 48;
    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement("span");
      var height = 20 + Math.random() * 90;
      bar.style.height = height + "px";
      bar.style.animationDelay = (Math.random() * 3.6).toFixed(2) + "s";
      bar.style.animationDuration = (2.8 + Math.random() * 2).toFixed(2) + "s";
      field.appendChild(bar);
    }
  }

  /* ---- dropzone: click, drag, and file preview ---- */
  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var fileNameEl = document.getElementById("fileName");
  var fileSizeEl = document.getElementById("fileSize");
  var removeBtn = document.getElementById("removeFile");
  var submitBtn = document.getElementById("submitBtn");

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function showFile(file) {
    if (!file) return;
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatSize(file.size);
    dropzone.classList.add("has-file");
    submitBtn.disabled = false;
  }

  function clearFile() {
    fileInput.value = "";
    dropzone.classList.remove("has-file");
    submitBtn.disabled = true;
  }

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) {
        showFile(fileInput.files[0]);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      clearFile();
    });
  }

  if (dropzone) {
    ["dragenter", "dragover"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("drag-over");
      });
    });

    dropzone.addEventListener("drop", function (e) {
      var dropped = e.dataTransfer.files;
      if (dropped && dropped[0]) {
        fileInput.files = dropped;
        showFile(dropped[0]);
      }
    });
  }

  /* ---- submit state: gentle "indexing" feedback ---- */
  var form = document.getElementById("uploadForm");
  if (form) {
    form.addEventListener("submit", function () {
      if (submitBtn.disabled) return;
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-label").textContent = "Indexing…";
    });
  }
})();