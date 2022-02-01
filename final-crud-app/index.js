class Library {
    constructor(name){
        this.name = name;
        this.books = [];
    }

    addRoom(title, author){
        this.books.push(new Book(title, author));
    }
}

class Book {
    constructor(title, author){
        this.title = title;
        this.author = author;
    }
}

class LibraryService {
    static url = 'https://crudcrud.com/api/f09d683076e241c3aeb84a4ab2dd6a52/libraries';
    
    static getAllLibraries(){
        return $.get(this.url);
    }

    static getLibrary(id){
        return $.get(this.url+ `/${id}`)
    }

    static createLibrary(library){
        return $.post(this.url, library)
    }

  static updateLibrary(library){
        return $.ajax({
            url: this.url + `/${library._id}`,
            dataType: 'json',
            data: JSON.stringify(library),
            contentType: 'application/json',
            type: 'PUT'
        });
    } 

     static deleteLibrary(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    } 
}

