document.addEventListener('DOMContentLoaded', function() {

    // Cargar productos de la categoría correspondiente

    const categoria = obtenerCategoriaDesdeURL();
    if (categoria) {
        obtenerProductos(categoria);
    } else {
        // No cargar productos si la categoría no es válida
        console.log('Categoría no válida. No se cargarán productos.');
    }

    // Mostrar el carrito de compras

    actualizarCarrito();

    // Manejar el menú desplegable

    menuDesplegable();

    // Manejar el botón de minimización del carrito

    const botonMostrarCarrito = document.querySelector('.mostrar-carrito');
    botonMostrarCarrito.addEventListener('click', function() {
        mostrarCarrito();
    });
    const botonMinimizarCarrito = document.getElementById('minimizar-carrito');
    botonMinimizarCarrito.addEventListener('click', function() {
        ocultarCarrito();
    });
});

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funcion para obtener la categoria de la URL

function obtenerCategoriaDesdeURL() {
    const url = window.location.pathname;
    if (url.includes('notebooks.html')) {
        return 'Notebook';
    } else if (url.includes('auriculares.html')) {
        return 'Auriculares';
    } else if (url.includes('monitores.html')) {
        return 'Monitor';
    } else{
        return null;
    } 
}

// Funcion para obtener los productos del JSON

function obtenerProductos(categoria) {
    fetch('js/productos.json')
        .then(response => response.json())
        .then((posts) => {
            mostrarProductos(posts, categoria);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Funcion para mostrar los productos en la pagina segun tipo de categoria 

function mostrarProductos(productos, categoria) {
    const seccion = document.querySelector('.seccion');
    seccion.innerHTML = "";
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    
    productosFiltrados.forEach((post) => {
        const html = `
            <article class="producto">
                <div class="item-producto imagen">
                    <img src="${post.imagen}" alt="${post.nombre}">
                </div>
                <div class="item-producto">
                    <h2>${formatearPrecio(post.precio)}</h2>
                    <p>${post.nombre}</p>
                    <p>${post.descripcion}</p>
                </div>
                <div class="item-producto">
                    <button onclick="agregarAlCarrito(${post.id}, '${post.nombre}', ${post.precio}, '${post.imagen}')">Añadir al carrito</button>
                </div>
            </article>
        `;
        seccion.innerHTML += html;
    });
}

// Funcion para formatear el precio de los productos a pesos argentinos

function formatearPrecio(precio) {
    return precio.toLocaleString('es-AR',{
        style: 'currency',
        currency: 'ARS',
    });
}

// Funcion para agregar productos al carrito

function agregarAlCarrito(id, nombre, precio, imagen) {
    const productoSeleccionado = carrito.find(producto => producto.id === id);
    if (productoSeleccionado) {
        productoSeleccionado.cantidad++;
    } else {
        carrito.push({ id: id, nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarCarrito();
}

// Funcion para eliminar productos del carrito

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    if (carrito.length === 0) {
        ocultarCarrito();
    }
}

// Funcion para mostrar el carrito

function mostrarCarrito() {
    const carritoLateral = document.getElementById('carrito');
    carritoLateral.style.display = 'block';
}

// Funcion para ocultar el carrito

function ocultarCarrito() {
    const carritoLateral = document.getElementById('carrito');
    carritoLateral.style.display = 'none';
}

// Funcion para actualizar el carrito

function actualizarCarrito() {
    const listaCarrito = document.querySelector('.carrito-items');
    const totalCarrito = document.querySelector('.carrito-total');
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const item = document.createElement('li');
        item.classList.add('carrito-item');
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h4>${producto.nombre}</h4>
                <p>${formatearPrecio(producto.precio)} x ${producto.cantidad}</p>
                <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
            </div>
        `;
        listaCarrito.appendChild(item);
        total += producto.precio * producto.cantidad;
    });

    totalCarrito.textContent = total === 0 ? '' : `Total: ${formatearPrecio(total)}`;
    const iconoCarrito = document.getElementById('icono-carrito');
    const cantidadProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    iconoCarrito.setAttribute('data-count', cantidadProductos);
}

// Funcion para despelgar el menu

function menuDesplegable(){
    const nav = document.querySelector("#nav")
    const abrir = document.querySelector("#abrir")
    const cerrar = document.querySelector("#cerrar")

    abrir.addEventListener("click", () => {
        nav.classList.add("visible")
    })

    cerrar.addEventListener("click", () => {
        nav.classList.remove("visible")
    })
}