// Book Class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handles UI Tasks
class UI {
  static displayBooks() {
    const storedBooks = Store.getBooks();
    storedBooks.forEach((book) => UI.addBookToList(book))
  }

  static addBookToList(book) {
    const list = document.getElementById("bookList");
    const row = document.createElement("tr");

    row.innerHTML = `
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.isbn}</td>
<td id="delete"><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
  `;
    list.appendChild(row);
  }

  static deleteBook(e) {
    if (e.classList.contains("delete")) {
      e.parentElement.parentElement.remove();
    }
  }
  // <div class="alert alert-danger">whatever</div>
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.getElementById("bookForm");

    container.insertBefore(div, form);

    // Make Alert Message vanish in 2s
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static clearField() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") == null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const storedBooks = Store.getBooks();
    storedBooks.push(book);
    localStorage.setItem("books", JSON.stringify(storedBooks));
  }

  static removeBook(isbn) {
    const storedBooks = Store.getBooks();

    storedBooks.forEach((book, i) => {
      if (book.isbn == isbn) {
        storedBooks.splice(i, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(storedBooks))
  }
}


// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
const form = document.querySelector("#bookForm");
const title = document.getElementById("title");
const author = document.getElementById("author");
const isbn = document.getElementById("isbn");

form.addEventListener("submit", (e) => {

  // Prevent Actual Submit
  e.preventDefault();

  // Get Form Values
  titleValue = title.value;
  authorValue = author.value;
  isbnValue = isbn.value;

  // Validate
  if (titleValue == "" || authorValue == "" || isbnValue == "") {
    UI.showAlert("Please, fill all fields", "danger")
  } else {

    // Instantiate a Book
    const newBook = new Book(titleValue, authorValue, isbnValue);

    // Add a Book to UI
    UI.addBookToList(newBook);

    // Add Book to Store
    Store.addBook(newBook);

    // Show Alert Message
    UI.showAlert("Book Added", "success");
    // Clear Fields
    UI.clearField();

  }

});
// Event: Remove a Book
document.getElementById("bookList").addEventListener("click", (e) => {
  // Remove Book from UI
  UI.deleteBook(e.target);

  //  Remove Book from Store 
Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Success Message
  UI.showAlert("Book Removed", "info")
});