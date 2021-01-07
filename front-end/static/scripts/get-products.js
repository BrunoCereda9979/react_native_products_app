$(document).ready(function () {

const getProductsButton = $('#get-products-btn')
const allProducts = document.querySelector('#products')
const myAuthToken = localStorage.getItem('myAuthToken')

const messageBox = {
    messageContainer: $('#message-container'),
    messageText: $('#message-text'),
    closeMessageButton: $('#btn-close-msg'),
}

console.log('Fetching products...')
fetch('http://localhost:3000/products', {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'token': myAuthToken
        },
    })
    .then(data => data.json())
    .then(productsList => {
        allProducts.innerHTML = ''
        for (const product of productsList.products) {
            allProducts.innerHTML += `
                <tr class="products-table-body">
                    <td id="product-name">${product.productName}</td>
                    <td id="product-price">${product.productPrice}</td>
                    <td><button data-modal-target="#modal-edit-product" onClick="editProduct('${product.productId}', '${product.productName}', '${product.productPrice}')" class="table-btn btn-edit-product" id="btn-edit-product">Edit</button></td>
                    <td><button onClick="deleteProduct('${product.productId}')" class="table-btn btn-delete-product" id="btn-delete-product">Delete</button></td>
                </tr>
            `
        }
        console.log('Done!')
    })
    .catch(err => {
        console.log(err)
        messageBox.messageContainer.addClass('active error')
        messageBox.messageText.text(err.message)
    })
});