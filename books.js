// =========================
// 📚 簡易版書架
// =========================


// =========================
// 讀取已儲存的書籍
// =========================

let books = [];

const savedBooks =
  localStorage.getItem("simpleBooks");


if (savedBooks) {

  try {

    books = JSON.parse(savedBooks);

  } catch (error) {

    books = [];

  }

}


// =========================
// 第一次使用：匯入 books-data.js
// =========================

if (
  books.length === 0 &&
  typeof importedBooks !== "undefined" &&
  importedBooks.length > 0
) {

  books = importedBooks.map(function(book) {

    return {
      id: Date.now() + Math.random(),
      title: book.title,
      author: book.author || "作者未詳",
      category: book.category || "其他",
      status: book.status || "reading"
    };

  });

  saveBooks();

}


// =========================
// 舊資料補分類
// =========================

books.forEach(function(book) {

  if (!book.category) {

    book.category = "其他";

  }

  if (!book.author) {

    book.author = "作者未詳";

  }

});


saveBooks();


// =========================
// 頁面切換
// =========================

function showPage(pageId) {

  const pages =
    document.querySelectorAll(".page");


  pages.forEach(function(page) {

    page.classList.remove("active");

  });


  const target =
    document.getElementById(pageId);


  if (target) {

    target.classList.add("active");

  }

}


// =========================
// 儲存
// =========================

function saveBooks() {

  localStorage.setItem(
    "simpleBooks",
    JSON.stringify(books)
  );

}


// =========================
// 顯示書籍
// =========================

function renderBooks(type) {

  let list;
  let search;
  let category;


  if (type === "reading") {

    list =
      document.getElementById("readingList");

    search =
      document
        .getElementById("readingSearch")
        .value
        .trim()
        .toLowerCase();

    category =
      document
        .getElementById("readingCategory")
        .value;

  } else {

    list =
      document.getElementById("finishedList");

    search =
      document
        .getElementById("finishedSearch")
        .value
        .trim()
        .toLowerCase();

    category =
      document
        .getElementById("finishedCategory")
        .value;

  }


  const filteredBooks =
    books.filter(function(book) {

      const correctStatus =
        type === "reading"
          ? book.status === "reading"
          : book.status === "finished";


      const title =
        String(book.title || "")
          .toLowerCase();


      const author =
        String(book.author || "")
          .toLowerCase();


      const correctSearch =
        title.includes(search) ||
        author.includes(search);


      const correctCategory =
        category === "all" ||
        book.category === category;


      return (
        correctStatus &&
        correctSearch &&
        correctCategory
      );

    });


  list.innerHTML = "";


  if (filteredBooks.length === 0) {

    list.innerHTML =
      '<div class="empty">沒有找到書籍</div>';

    updateCounts();

    return;

  }


  filteredBooks.forEach(function(book) {

    const bookElement =
      document.createElement("div");


    bookElement.className = "book";


    const title =
      document.createElement("div");

    title.className = "book-title";

    title.textContent =
      "《" + book.title + "》";


    const author =
      document.createElement("div");

    author.className = "book-author";

    author.textContent =
      book.author;


    const category =
      document.createElement("div");

    category.className =
      "book-category";

    category.textContent =
      book.category;


    const actions =
      document.createElement("div");

    actions.className =
      "book-actions";


    const statusButton =
      document.createElement("button");

    statusButton.type = "button";


    statusButton.textContent =
      type === "reading"
        ? "✓ 已讀完"
        : "↩ 移回待閱";


    statusButton.addEventListener(
      "click",
      function() {

        changeStatus(book.id);

      }
    );


    const deleteButton =
      document.createElement("button");


    deleteButton.type = "button";


    deleteButton.textContent =
      "🗑 刪除";


    deleteButton.addEventListener(
      "click",
      function() {

        deleteBook(book.id);

      }
    );


    actions.appendChild(statusButton);
    actions.appendChild(deleteButton);


    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(category);
    bookElement.appendChild(actions);


    list.appendChild(bookElement);

  });


  updateCounts();

}


// =========================
// 新增視窗
// =========================

function openAddModal() {

  document
    .getElementById("addModal")
    .classList.add("active");


  document
    .getElementById("bookTitle")
    .value = "";


  document
    .getElementById("bookAuthor")
    .value = "";


  document
    .getElementById("bookCategory")
    .value = "文學小說";


  document
    .getElementById("bookTitle")
    .focus();

}


function closeAddModal() {

  document
    .getElementById("addModal")
    .classList.remove("active");

}


// =========================
// 新增書籍
// =========================

function addBook() {

  const title =
    document
      .getElementById("bookTitle")
      .value
      .trim();


  const author =
    document
      .getElementById("bookAuthor")
      .value
      .trim();


  const category =
    document
      .getElementById("bookCategory")
      .value;


  if (!title) {

    alert("請填寫書名。");

    return;

  }


  const newBook = {

    id: Date.now(),

    title: title,

    author: author || "作者未詳",

    category: category,

    status: "reading"

  };


  books.push(newBook);

  saveBooks();

  closeAddModal();

  renderBooks("reading");

}


// =========================
// 改變閱讀狀態
// =========================

function changeStatus(id) {

  const book =
    books.find(function(item) {

      return item.id === id;

    });


  if (!book) {

    return;

  }


  if (book.status === "reading") {

    book.status = "finished";

    saveBooks();

    renderBooks("reading");

  } else {

    book.status = "reading";

    saveBooks();

    renderBooks("finished");

  }

}


// =========================
// 刪除
// =========================

function deleteBook(id) {

  const book =
    books.find(function(item) {

      return item.id === id;

    });


  if (!book) {

    return;

  }


  const confirmed =
    confirm(
      "確定要刪除《" +
      book.title +
      "》嗎？"
    );


  if (!confirmed) {

    return;

  }


  const oldStatus =
    book.status;


  books =
    books.filter(function(item) {

      return item.id !== id;

    });


  saveBooks();


  renderBooks(oldStatus);

}


// =========================
// 數量
// =========================

function updateCounts() {

  const readingCount =
    books.filter(function(book) {

      return book.status === "reading";

    }).length;


  const finishedCount =
    books.filter(function(book) {

      return book.status === "finished";

    }).length;


  document
    .getElementById("readingCount")
    .textContent =
    "共 " + readingCount + " 本";


  document
    .getElementById("finishedCount")
    .textContent =
    "共 " + finishedCount + " 本";

}


// =========================
// 按鈕
// =========================

document
  .getElementById("goReading")
  .addEventListener(
    "click",
    function() {

      showPage("reading");

      renderBooks("reading");

    }
  );


document
  .getElementById("goFinished")
  .addEventListener(
    "click",
    function() {

      showPage("finished");

      renderBooks("finished");

    }
  );


document
  .getElementById("backReading")
  .addEventListener(
    "click",
    function() {

      showPage("home");

    }
  );


document
  .getElementById("backFinished")
  .addEventListener(
    "click",
    function() {

      showPage("home");

    }
  );


document
  .getElementById("openAdd")
  .addEventListener(
    "click",
    function() {

      openAddModal();

    }
  );


document
  .getElementById("cancelAdd")
  .addEventListener(
    "click",
    function() {

      closeAddModal();

    }
  );


document
  .getElementById("saveBook")
  .addEventListener(
    "click",
    function() {

      addBook();

    }
  );


// =========================
// 搜尋
// =========================

document
  .getElementById("readingSearch")
  .addEventListener(
    "input",
    function() {

      renderBooks("reading");

    }
  );


document
  .getElementById("readingCategory")
  .addEventListener(
    "change",
    function() {

      renderBooks("reading");

    }
  );


document
  .getElementById("finishedSearch")
  .addEventListener(
    "input",
    function() {

      renderBooks("finished");

    }
  );


document
  .getElementById("finishedCategory")
  .addEventListener(
    "change",
    function() {

      renderBooks("finished");

    }
  );


// =========================
// 初始化
// =========================

updateCounts();
