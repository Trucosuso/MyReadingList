//@ts-check
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
}

window.addEventListener("load", main);
var booklist = new Booklist();

function main() {
    let libro1 = new Book("Fundación", "Ciencia Ficción", "Isaac Asimov", true, new Date(Date.now()));
    let libro2 = new Book("Hyperion", "Ciencia Ficción", "Dan Simmons");
    let libro3 = new Book("Ensayo sobre la ceguera", "Novela", "José Saramago");
    let libro4 = new Book("El señor de los anillos", "Fantasía", "J. R. R. Tolkien");
    booklist.add(libro1, libro2, libro3, libro4);
    pintarTabla(document.getElementById("list"), booklist);
    document.getElementById("addBookButton").addEventListener("click", añadirLibro);
    document.getElementById("bookReaded").addEventListener("click", activarFecha);
}

/**
 * 
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
 * Draws a table inside element and fill it with books from booklist
 * @param {HTMLElement} element
 * @param {Booklist} booklist 
 */
function pintarTabla(element, booklist) {
    let table = "";
    table += "<table style=\"width: 100%;\" id=\"booklistTable\"><caption>Booklist</caption>";
    table += "<thead><th>Title</th><th>Genre</th><th>Author</th><th>Has been read?</th><th>Read date</th></thead>";
    booklist.booklist.forEach(book => {
        table += "<tr>";
        for (const key in book) {
            if (book[key] === false) {
                table += "<td>No</td>";
            } else if (book[key] === true) {
                table += "<td>Sí</td>";
            } else if (book[key] === null) {
                table += "<td>-</td>";
            } else if (book[key] instanceof Date) {
                /* HAY MÉTODOS QUE MAQUETAN FECHAS */
                table += "<td>" + book[key].getDate() + "/" + book[key].getMonth() + "/" + book[key].getFullYear() + "</td>";
            } else {
                table += "<td>" + book[key] + "</td>";
            }
        }
        table += "</tr>";
    });
    element.innerHTML = table;
}

function añadirLibro() {
    let title = document.getElementById("bookTitle").value;
    let genre = document.getElementById("bookGenre").value;
    let author = document.getElementById("bookAuthor").value;
    let read = document.getElementById("bookReaded").checked;
    let readDate = document.getElementById("bookDate").value;
    if (read) {
        booklist.add(new Book(title, genre, author, read, new Date(readDate)));
    } else {
        booklist.add(new Book(title, genre, author));
    }
    limpiarInputs();
    pintarTabla(document.getElementById("list"), booklist);
}

function limpiarInputs() {
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookGenre").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookReaded").checked = false;
    document.getElementById("bookDate").value = "";
    document.getElementById("bookDate").disabled = true;
}