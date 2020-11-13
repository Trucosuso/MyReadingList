/** Class representing a book */
class Book {
    /**
     * Constructs a book
     * @param {String} title 
     * @param {String} genre 
     * @param {String} author 
     * @param {Boolean} read False by default
     * @param {Date} readDate Null by default
     * @param {Number} id BookID
     */
    constructor(title, genre, author, read = false, readDate = null, id = null) {
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.read = read;
        this.readDate = readDate;
        this.id = id;
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
        this.bookID = 0;
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
     * @param {...Book} books 
     */
    add(...books) {
        for (const book of books) {
            book.id = this.bookID++;
        }
        this.booklist.push(...books);
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

export {Book, Booklist};