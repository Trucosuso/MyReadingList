/** Class representing a book */
class Book {
    /**
     * Constructs a book
     * @param {String} title 
     * @param {String} genre 
     * @param {String} author 
     * @param {Boolean} read False by default
     * @param {Date} readDate Null by default
     */
    constructor(title, genre, author, read = false, readDate = null) {
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.read = read;
        this.readDate = readDate;
    }
}

/** Class representing a booklist */
class Booklist {
    /**
     * Constructs a booklist
     * @param {Array} booklist Array of all books
     * @param {Book} lastBook Last readed book
     */
    constructor(booklist = [], lastBook = null) {
        this.booklist = booklist;
        this.lastBook = lastBook;
    }

    // GETTERS

    /**
     * Gets the book currently being read
     * @public
     * @returns {Book}
     */
    get currentBook() {
        for (const book of this.booklist) {
            if (!book.read) {
                return book;
            }
        }
        return null;
    }

    /**
     * Gets the index of the book currently being read
     * @public
     * @returns {Number} -1 if it does not exists
     */
    get currentBookIndex() {
        for (const key in this.booklist) {
            if (this.booklist[key] == this.currentBook) {
                return parseInt(key);
            }
        }
        return -1;
    }

    /**
     * Gets the book that will be read next
     * @public
     * @returns {Book}
     */
    get nextBook() {
        for (const book of this.booklist) {
            if (!book.read && book != this.currentBook) {
                return book;
            }
        }
        return null;
    }

    /**
     * Quantity of books marked as readed
     * @public
     * @returns {Number}
     */
    get readedBooks() {
        return this.booklist.filter(book => book.read).length;
    }

    /**
     * Quantity of books not marked as readed
     * @public
     * @returns {Number}
     */
    get unreadedBooks() {
        return this.booklist.filter(book => !book.read).length;
    }

    /**
     * Total of books in the booklist
     * @public
     * @returns {Number}
     */
    get totalBooks() {
        return this.booklist.length;
    }

    // Methods

    /**
     * Adds books to the list
     * @param {...Book} book 
     */
    add(...book) {
        this.booklist.push(...book);
    }

    /**
     * Gives the current book a read date, change the last readed book to current book and sets the read state of the current book to true.
     * @returns {Book} Book that has just being read.
     */
    finishCurrentBook() {
        if (this.currentBook != null) {
            this.currentBook.readDate = new Date(Date.now());
            this.lastBook = this.currentBook;
            this.currentBook.read = true;
            return this.lastBook;
        }
        return null;
    }

    /**
     * Deletes the book that has that title, that genre and that author. Returns true if it can detele, false if it does not
     * @param {String} bookTitle Title of book to delete
     * @param {String} bookGenre Genre of book to delete
     * @param {String} bookAuthor Author of book to delete
     * @returns {Boolean} True if is able to delete the book, false if it does not
     */
    removeBook(bookTitle, bookGenre, bookAuthor) {
        let bookToDelete = this.booklist.findIndex(book => book.title == bookTitle && book.genre == bookGenre && book.author == bookAuthor);
        if (bookToDelete == -1) {
            return false;
        } else {
            this.booklist.splice(bookToDelete, 1);
            return true;
        }
    }
}

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
    let tableROw = e.target.parentElement.parentElement;

    // Book data
    let title = tableROw.childNodes[0].firstChild.nodeValue;
    let genre = tableROw.childNodes[1].firstChild.nodeValue;
    let author = tableROw.childNodes[2].firstChild.nodeValue;

    // Delete book from booklist and from row.
    booklist.removeBook(title, genre, author);
    tableROw.remove();

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
