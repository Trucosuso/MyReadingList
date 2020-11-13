import {Book, Booklist} from "./books.js";

var booklist = new Booklist();
window.addEventListener("load", main);

/**
 * Starts the script
 */
function main() {
    pintarTabla(document.getElementById("list"), booklist);
    document.getElementById("addBookButton").addEventListener("click", añadirLibro);
    document.getElementById("bookReaded").addEventListener("click", activarFecha);
    document.getElementById("finishCurrentBookButton").addEventListener("click", finishCurrentBook);
}

/**
 * Enables the date input if the book being added has been read and disables it if the book has not been read
 * @param {MouseEvent} e 
 */
function activarFecha(e) {
    if (e.target.checked) {
        document.getElementById("bookDate").disabled = false;
    } else {
        document.getElementById("bookDate").disabled = true;
    }
}

/**
 * Draws a table inside element and fill it with books from booklist.
 * Writes the current book being read and updates the readed book counter
 * @param {HTMLElement} element
 * @param {Booklist} booklist 
 */
function pintarTabla(element, booklist) {
    let table = document.createElement("table");
    table.classList.add("table", "table-sm", "table-striped");
    table.id = "booklistTable";

    // Create thead
    let thead = document.createElement("thead");
    let textForHeaders = ["Title", "Genre", "Author", "Has been read?", "Read date", "Actions"];
    for (const headerText of textForHeaders) {
        let th = document.createElement("th");
        let text = document.createTextNode(headerText);
        th.appendChild(text);
        thead.appendChild(th);
    }
    table.appendChild(thead);

    // Create tbody
    let tbody = document.createElement("tbody");
    tbody.id = "booklistTableBody";

    table.appendChild(tbody);
    element.appendChild(table);

    // Update text below the table
    updateCurrentAndReadedBookText();

    // Add books in booklist to table if needed
    for (const book of booklist.booklist) {
        libroATabla(tbody, book);
    }
}

/**
 * Adds a book to the table
 * @param {HTMLTableElement} tabla Table where the book will be added
 * @param {Book} book Book to be added
 */
function libroATabla(tabla, book) {
    let tr = document.createElement("tr");
    tr.bookID = book.id;
    if (book === booklist.currentBook) {
        tr.classList.add("table-primary");
    }

    // Array to store the book data and store it on the table easier
    let bookData = [book.title, book.genre, book.author];

    // If the book has been readed set readed to Yes to show it in the table
    let readed = "No";
    if (book.read) {
        readed = "Yes";
    }
    bookData.push(readed);

    // If the book has a valid date print day/month/year
    let date = "-";
    if (book.readDate instanceof Date && !isNaN(book.readDate.getDate())) {
        const options = { year: "numeric", month: "numeric", day: "numeric" };
        date = book.readDate.toLocaleDateString("es-ES", options);
    }
    bookData.push(date);

    // Add book data to table row
    for (const data of bookData) {
        let td = document.createElement("td");
        let text = document.createTextNode(data);
        td.appendChild(text);
        tr.appendChild(td);
    }

    // Add delete icon to a td and a tr
    let td = document.createElement("td");
    let deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-icons");
    deleteIcon.textContent = "delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.addEventListener("click", deleteBook);
    td.append(deleteIcon);
    tr.append(td);

    // Add row to table
    tabla.appendChild(tr);

    // Update text below the table
    updateCurrentAndReadedBookText();
}

/**
 * Adds a book from the form to the booklist and the table
 */
function añadirLibro() {
    let title = document.getElementById("bookTitle").value;
    let book;

    // Do not add the book if the title is empty
    if (title == "") {
        document.getElementById("bookTitle").style.borderColor = "red";
    } else {
        document.getElementById("bookTitle").style.borderColor = "#ced4da";
        let genre = document.getElementById("bookGenre").value;
        let author = document.getElementById("bookAuthor").value;
        let read = document.getElementById("bookReaded").checked;
        let readDate = document.getElementById("bookDate").value;
        if (read) {
            book = new Book(title, genre, author, read, new Date(readDate));
            booklist.add(book);
        } else {
            book = new Book(title, genre, author);
            booklist.add(book);
        }

        // Clear text inputs
        limpiarInputs();

        // Add book to tableBody as a row
        libroATabla(document.getElementById("booklistTableBody"), book);
    }
}

/**
 * Cleans the form
 */
function limpiarInputs() {
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookGenre").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookReaded").checked = false;
    document.getElementById("bookDate").value = "";
    document.getElementById("bookDate").disabled = true;
}

/**
 * Finish current book and redraws the table
 */
function finishCurrentBook() {
    if (booklist.currentBook) {
        // Finish current book in booklist
        booklist.finishCurrentBook();

        // Change read state and date on table
        const options = { year: "numeric", month: "numeric", day: "numeric" };
        let table = document.getElementById("booklistTableBody");
        let currentBookRow = table.getElementsByClassName("table-primary");
        currentBookRow[0].childNodes[3].firstChild.nodeValue = "Yes";
        currentBookRow[0].childNodes[4].firstChild.nodeValue = booklist.lastBook.readDate.toLocaleDateString("es-ES", options);

        // Remove color from row
        currentBookRow[0].classList.remove("table-primary");

        // Color row containing current book if there is one
        if (booklist.currentBook) {
            table.childNodes[booklist.currentBookIndex].classList.add("table-primary");
        }

        // Update text below the table
        updateCurrentAndReadedBookText();
    }
}

/**
 * Deletes a book from table and from booklist
 * @param {MouseEvent} e 
 */
function deleteBook(e) {
    // Row to delete
    let tableRow = e.target.parentElement.parentElement;

    // Book id
    let id = tableRow.bookID;

    // Delete book from booklist and from row.
    console.log(booklist.removeBookByID(id));
    tableRow.remove();

    // Color row containing current book if there is one
    if (booklist.currentBook) {
        document.getElementById("booklistTableBody").childNodes[booklist.currentBookIndex].classList.add("table-primary");
    }

    updateCurrentAndReadedBookText();
}

/**
 * Updates the text that shows what book is currently being read
 * and the counter of readed and total books
 */
function updateCurrentAndReadedBookText() {

    if (booklist.currentBook != null) {
        let currentBook = `You are now reading ${booklist.currentBook.title} by ${booklist.currentBook.author}.`;
        document.getElementById("currentBook").textContent = currentBook;
    } else {
        let currentBook = "You are not reading anything right now.";
        document.getElementById("currentBook").textContent = currentBook;
    }

    let readedBooksCounter = `You have read ${booklist.readedBooks} out of ${booklist.totalBooks} books.`;
    document.getElementById("numberOfReadedBooks").textContent = readedBooksCounter;
}
