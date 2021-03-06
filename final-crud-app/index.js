class Library {
    constructor(name){
        this.name = name;
        this.books = [];
    }

    addBook(title, author){
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
    static url = "https://61fda0b1a58a4e00173c9609.mockapi.io/api/v1/Library";
    
    static getLibrary(id){
        return $.get(this.url+ `/${id}`)
    }

    static getAllLibraries(){
        return $.get(this.url);
    }

    static createLibrary(library){
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(library),
            contentType: 'application/json',
            type: 'POST'
        });
    }

  static updateLibrary(library){
        return $.ajax({
            url: this.url + `/${library.id}`,
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


class DOMManager {
    static libraries = [];

    static getAllLibaries(){
        LibraryService.getAllLibraries()
            .then((libraries) => {
            //console.log(libraries)
            this.render(libraries)
        });
    }

    static createLibrary(name){
        LibraryService.createLibrary(new Library(name))
        .then(() => {
            return LibraryService.getAllLibraries();
        })
        .then((libraries) => this.render(libraries));
    }

     static deleteLibrary(id){
        LibraryService.deleteLibrary(id)
        .then(() => {
            return LibraryService.getAllLibraries();
        })
        .then((libraries) => this.render(libraries));
    } 

     static addBook(id){
        for(let library of this.libraries){
            if(library.id == id){
                library.books.push(new Book($(`#${library.id}-book-title`).val(), $(`#${library.id}-book-author`).val()))
                LibraryService.updateLibrary(library)
                .then(() => {
                    return LibraryService.getAllLibraries();
                })
                .then((libraries) => this.render(libraries));
            }
        }
    } 

    static deleteBook(libraryId, bookId){
        for(let library of this.libraries){
            if(library.id = libraryId){
                for(let book of library.books){
                    if(book.title = bookId){
                        library.books.splice(library.books.indexOf(book), 1);
                        LibraryService.updateLibrary(library)
                        .then(() => {
                            return LibraryService.getAllLibraries();
                        })
                        .then((libraries) => this.render(libraries));
                    }
                }
            }
        }
    } 

    static render(libraries){
        this.libraries = libraries;
        $('#app').empty();
        for(let library of libraries){
            $('#app').prepend(
              `<div id="${library.id}" class="card">
                <div class="card-header">
                    <h2>${library.name}</h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteLibrary('${library.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${library.id}-book-title" class="form-control" placeholder="Book Title">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${library.id}-book-author" class="form-control" placeholder="Book Author">
                            </div>
                        </div>
                        <button id="${library.id}-new-book" onclick="DOMManager.addBook('${library.id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
              </div><br>` 
            );
            for(let book of library.books){
                $(`#${library.id}`).find('.card-body').append(
                    `<p>
                    <span id="title-${book.title}"><strong>Title: </strong> ${book.title}</span>
                    <span id="author-${book.author}"><strong>Author: </strong> ${book.author}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteBook('${library.id}', '${book.title}')">Delete Book</button>
                    </p>`
                );
            }
        }
    }
}


$('#create-new-library').click(() => {
    DOMManager.createLibrary($('#new-library-name').val());
    $('#new-library-name').val('');
});

DOMManager.getAllLibaries();



