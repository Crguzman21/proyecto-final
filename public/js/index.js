document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const formNewProduct = document.getElementById("formNewProduct");
    const productsList = document.getElementById("productsList");

    //Añadimos un nuevo producto
    formNewProduct.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(formNewProduct);
        const productData = {};

        formData.forEach((value, key) =>{
            productData[key] = value;
        });

        socket.emit("newProduct", productData);    
    });

    socket.on("productAdded", (newProduct)=>{
        const productsList = document.getElementById("productsList");

        productsList.innerHTML += `<li>${newProduct.title} - ${newProduct.price}</li>`;
    });


    //Eliminamos un productos
    productsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const productId = event.target.getAttribute("data-id");
        socket.emit("deleteProduct", productId);
    }
});

    socket.on("productDeleted", (productId) => {
        const productItem = document.querySelector(`li[data-id="${productId}"]`);
        if (productItem) {
            productItem.remove();
        }
    });


});
