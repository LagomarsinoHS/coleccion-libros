class Libro {
    constructor(titulo, autor, isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class UI {
    static mostrarLibros() {
        const libros = Datos.traerLibros()
        libros.forEach(libro => UI.agregarLibroLista(libro))
    }
    
    static agregarLibroLista(libro) {
        const lista = document.querySelector("#libro-list")
        const fila = document.createElement('tr')
        fila.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        lista.appendChild(fila)
    }

    static eliminarLibro(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove()
        }
    }

    static mostrarAlerta(mensaje, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(mensaje))

        const container = document.querySelector(".container")
        const form = document.querySelector("#libro-form")
        container.insertBefore(div, form)

        setTimeout(() => {
            document.querySelector(".alert").remove()
        }, 2000);
    }

    static limpiarCampos() {
        document.querySelector("#titulo").value = '';
        document.querySelector("#autor").value = '';
        document.querySelector("#isbn").value = '';
    }
}

class Datos {
    static traerLibros() {
        const libros = localStorage.getItem('libros')
        if (libros) return JSON.parse(libros)
        else return []
    }
    static agregarLibro(libro) {
        const todosLosLibros = Datos.traerLibros()
        if (todosLosLibros.some(({ titulo }) => titulo === libro.titulo)) {
            UI.mostrarAlerta('Libro ya fué ingresado', 'warning')
            return
        }
        todosLosLibros.push(libro)
        localStorage.setItem('libros', JSON.stringify(todosLosLibros))
    }
    static removerLibro(isbn) {
        const libros = Datos.traerLibros()
        const idxToRemove = libros.findIndex(libro => libro.isbn == isbn)
        console.log(idxToRemove);
        libros.splice(idxToRemove, 1)
        localStorage.setItem('libros', JSON.stringify(libros))
    }
}

//Al cargar la página
document.addEventListener('load', UI.mostrarLibros())

//Controlar evento submit
const libroForm = document.querySelector("#libro-form")
libroForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //Obtener valores campos
    const titulo = document.querySelector("#titulo").value;
    const autor = document.querySelector("#autor").value;
    const isbn = document.querySelector("#isbn").value;

    if (!titulo || !autor || !isbn) UI.mostrarAlerta('No puede haber campos vacíos', 'danger')
    else {
        const libro = new Libro(titulo, autor, isbn)
        Datos.agregarLibro(libro)
        UI.mostrarAlerta(`Libro agregado a la colección`, 'success')
        UI.limpiarCampos()
        UI.agregarLibroLista(libro)
    }

})

const listaLibros = document.querySelector("#libro-list")
listaLibros.addEventListener('click', (e) => {
    UI.eliminarLibro(e.target)
    const isbnToRemove = e.target.parentElement.previousElementSibling.textContent
    Datos.removerLibro(isbnToRemove);
})