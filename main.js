var carritoVisible = false;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}
document.querySelector('.menu-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
});

const getProductos = async () => {
    const response = await fetch("carrito.json");
    const data = await response.json();
    console.log(data);
};

getProductos();

function ready() {
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
    loadCartFromLocalStorage();
}

if (document.getElementsByClassName('carrito-items')[0].childElementCount === 0) {
    ocultarCarrito();
}

function pagarClicked() {
    Swal.fire({
        title: 'Gracias por tu compra!',
        text: 'Tu pedido ha sido procesado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            var carritoItems = document.getElementsByClassName('carrito-items')[0];
            while (carritoItems.hasChildNodes()) {
                carritoItems.removeChild(carritoItems.firstChild);
            }
            actualizarTotalCarrito();
            ocultarCarrito();
            localStorage.removeItem('carrito');
        }
    });
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
    saveCartToLocalStorage(); 
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';
    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            Toastify({
                text: "Este producto ya se encuentra en el carrito! Chequealo y elige la cantidad que desees en el.",
                duration: 4000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                gravity: "top",
                stopOnFocus: true,
                style: {
                    background: "#00000",
                    color: "f2ebd9",
                    borderRadius: ".5rem"
                },
            }).showToast();
            return;
        }
    }

    Toastify({
        text: "Agregaste un nuevo producto al carrito.",
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top",
        stopOnFocus: true,
        style: {
            background: "#177433",
            color: "f2ebd9",
            borderRadius: ".5rem"
        },
    }).showToast();

    var item = document.createElement('div');
    item.classList.add('item');
    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);
    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
    Toastify({
        text: "Sumaste otro producto al carrito!",
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top",
        stopOnFocus: true,
        style: {
            background: "#177433",
            color: "f2ebd9",
            borderRadius: ".5rem"
        },
    }).showToast();
    saveCartToLocalStorage(); 
}

function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
        Toastify({
            text: "Restaste un producto del carrito!",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            gravity: "top",
            stopOnFocus: true,
            style: {
                background: "#9c0808",
                color: "f2ebd9",
                borderRadius: ".5rem"
            },
        }).showToast();
        saveCartToLocalStorage(); 
    }
}

function eliminarItemCarrito(event) {
    Toastify({
        text: "Eliminaste un producto del carrito!",
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top",
        stopOnFocus: true,
        style: {
            background: "#9c0808",
            color: "f2ebd9",
            borderRadius: ".5rem"
        },
    }).showToast();
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
    saveCartToLocalStorage(); 
}

function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;
        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}


function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;
    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";
}

function saveCartToLocalStorage() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0].innerHTML;
    localStorage.setItem('carrito', carritoItems);
}

function loadCartFromLocalStorage() {
    var carritoItems = localStorage.getItem('carrito');
    if (carritoItems) {
        document.getElementsByClassName('carrito-items')[0].innerHTML = carritoItems;
        var items = document.getElementsByClassName('carrito-items')[0].getElementsByClassName('carrito-item');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
            var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
            botonRestarCantidad.addEventListener('click', restarCantidad);
            var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
            botonSumarCantidad.addEventListener('click', sumarCantidad);
        }
        actualizarTotalCarrito();
        hacerVisibleCarrito();
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('active');
    });
});
