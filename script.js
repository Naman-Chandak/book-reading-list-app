(function () {
  "use strict";

  var STORAGE_KEY = "naman-reading-list-v1";

  var form = document.getElementById("book-form");
  var titleInput = document.getElementById("title");
  var authorInput = document.getElementById("author");
  var errorEl = document.getElementById("form-error");
  var listEl = document.getElementById("books");
  var emptyEl = document.getElementById("empty");
  var statsEl = document.getElementById("stats");
  var chips = document.querySelectorAll(".chip");

  var books = load();
  var filter = "all";

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(data)) {
        return data.filter(function (b) {
          return b && typeof b.title === "string" && typeof b.author === "string";
        });
      }
    } catch (e) {}
    return [];
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch (e) {}
  }

  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function addBook(title, author) {
    books.unshift({ id: newId(), title: title, author: author, read: false });
    save();
    render();
  }

  function toggleRead(id) {
    books.forEach(function (b) { if (b.id === id) b.read = !b.read; });
    save();
    render();
  }

  function removeBook(id) {
    books = books.filter(function (b) { return b.id !== id; });
    save();
    render();
  }

  function makeButton(text, className, label, onClick) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = text;
    btn.setAttribute("aria-label", label);
    btn.addEventListener("click", onClick);
    return btn;
  }

  function render() {
    var visible = books.filter(function (b) {
      if (filter === "read") return b.read;
      if (filter === "unread") return !b.read;
      return true;
    });

    listEl.innerHTML = "";
    visible.forEach(function (b) {
      var li = document.createElement("li");
      li.className = "book" + (b.read ? " is-read" : "");

      var info = document.createElement("div");
      info.className = "book__info";
      var t = document.createElement("p");
      t.className = "book__title";
      t.textContent = b.title;
      var a = document.createElement("p");
      a.className = "book__author";
      a.textContent = "by " + b.author;
      info.appendChild(t);
      info.appendChild(a);

      var actions = document.createElement("div");
      actions.className = "book__actions";
      actions.appendChild(makeButton(
        b.read ? "Mark unread" : "Mark read", "icon-btn",
        "Mark " + b.title + (b.read ? " as unread" : " as read"),
        function () { toggleRead(b.id); }
      ));
      actions.appendChild(makeButton(
        "Delete", "icon-btn icon-btn--danger", "Delete " + b.title,
        function () { removeBook(b.id); }
      ));

      li.appendChild(info);
      li.appendChild(actions);
      listEl.appendChild(li);
    });

    var readCount = books.filter(function (b) { return b.read; }).length;
    statsEl.textContent = books.length + (books.length === 1 ? " book" : " books") +
      ", " + readCount + " read";

    if (visible.length === 0) {
      emptyEl.hidden = false;
      if (books.length === 0) emptyEl.textContent = "Your shelf is empty. Add your first book above.";
      else if (filter === "read") emptyEl.textContent = "No finished books yet. Mark one as read.";
      else emptyEl.textContent = "Nothing left to read. Add another book above.";
    } else {
      emptyEl.hidden = true;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    var author = authorInput.value.trim();

    if (!title || !author) {
      errorEl.textContent = "Enter both a title and an author.";
      (title ? authorInput : titleInput).focus();
      return;
    }
    var duplicate = books.some(function (b) {
      return b.title.toLowerCase() === title.toLowerCase() && b.author.toLowerCase() === author.toLowerCase();
    });
    if (duplicate) {
      errorEl.textContent = "That book is already on your list.";
      titleInput.focus();
      return;
    }

    errorEl.textContent = "";
    addBook(title, author);
    form.reset();
    titleInput.focus();
  });

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function () {
      filter = chip.getAttribute("data-filter");
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      render();
    });
  });

  render();
})();
