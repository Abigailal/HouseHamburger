// Pedidos.html
const footerTab = document.getElementById('footerTab');
const templateFooter = document.getElementById('template-footerTab').content;
const items = document.getElementById('items');
const templateCarrito = document.getElementById('template-carrito').content;
const cards = document.getElementById('cards');
const templateCard = document.getElementById('template-card').content;
//fragment, es como una memoria volatil que se va o se disuelve y no genera reflw
const fragment = document.createDocumentFragment();
let carrito = {};


//Coleccion de eventos indexados
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => {fetchData();});
//Delegación de evento (click botón comprar)
cards.addEventListener('click', e => {addCarrito(e);})
//Boton aumentar-disminuir
items.addEventListener('click', e => { btnAumentarDisminuir(e)})

//Fetch Leer JSON de productos
const fetchData = async () => {
    try{
        const res = await fetch('./menu.json');
        const data = await res.json();
        //console.log(data);
        pintarCards(data);
    }catch (error){
        alert('No se puede leer la base de datos de los productos, intente más tarde.');
    }
};

//Rellenar las cards desde el menu
//Template + Fragment Pintar productos
const pintarCards = data => {
    //recorrer
    data.forEach( producto => {
        templateCard.querySelector('.card-title').textContent = producto.title;
        templateCard.querySelector('.card-text').textContent = producto.price;
        templateCard.querySelector('.card-img-top').setAttribute("src" , producto.thumbnailUrl);
        templateCard.querySelector('.btn-order').dataset.id = producto.id ;
        //clonacion
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

//Agregar elementos en forma de carrito y modificarlos
const addCarrito = e => {
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-order'));
    if(e.target.classList.contains('btn-order')){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

//Crear objetos con los datos de los productos
const setCarrito = objeto => {
    //console.log(objeto);
    const producto = {
        id : objeto.querySelector('.btn-order').dataset.id,
        title : objeto.querySelector('.card-title').textContent,
        precio : objeto.querySelector('.card-text').textContent,
        cantidad : 1
    }
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto}; //copiar las propiedades de producto
    pintarCarrito();//Cuando se cree un objeto, se pinta en el carrito
};

//Rellenar carrito
const pintarCarrito = () => {
    items.innerHTML = ''; //Limpiamos el html
    //console.log(carrito);
    //Ciclo forEach con objetos
    Object.values(carrito).forEach( producto => {
        templateCarrito.querySelector('.id-carrito').textContent = producto.id;
        templateCarrito.querySelector('.title-carrito').textContent = producto.title;
        templateCarrito.querySelector('.cantidad-carrito').textContent = producto.cantidad;
        templateCarrito.querySelector('.price-carrito').textContent = producto.precio * producto.cantidad;

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;

        //clonacion
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment)

    pintarFooterTab();
    pintarComprar();
};

//Rellenar footer del carrito para el total del pedido
const pintarFooterTab = () => {
    footerTab.innerHTML = ''; //Limpiamos el html para que no se sobreescriba el html

    if (Object.keys(carrito).length === 0) { //Si el usuario limpia el carrito, se vuelve a escribir lo que ya teniamos
        footerTab.innerHTML = 
        `<th scope="row" colspan="5" class="letraBebas">Empty cart - start shopping! innerHTML</th>`;
        return;
    }

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0);
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[1].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    //Clonar
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footerTab.appendChild(fragment);

    //boton de vaciar
    const boton = document.querySelector('#vaciar-carrito');
    boton.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
        pintarComprar();
    });
    const botonComprar = document.querySelector('#comprar-carrito');
    botonComprar.addEventListener('click', () => {
        alert('Pedido completado');
        carrito = {};
        pintarCarrito();
        pintarComprar();
    });
};

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito();
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito();
    }
    e.stopPropagation();
};