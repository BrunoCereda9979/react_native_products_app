$(document).ready(function () {
    const myAuthToken = localStorage.getItem('myAuthToken')

    const messageBox = {
        messageContainer: $('#message-container'),
        messageText: $('#message-text'),
        closeMessageButton: $('#btn-close-msg'),
    }

    const addProductForm = {
        overlay: $('#overlay'),
        formModal: $('#modal-product'),
        productNameInput: $('#product-name-input'),
        productPriceInput: $('#product-price-input'),
        addProductButton: $('#btn-send-product'),
    }

    addProductForm.addProductButton.click(function (event) {
        addProductFormData = {
            productName: $(addProductForm.productNameInput).val(),
            productPrice: $(addProductForm.productPriceInput).val()
        }

        fetch('http://localhost:3000/products', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'token': myAuthToken
            },
            'body': JSON.stringify(addProductFormData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 201) {
                messageBox.messageContainer.addClass('active success')
                messageBox.messageText.text(data.message)
                addProductForm.overlay.removeClass('active')
                addProductForm.formModal.removeClass('active')
            }
            else {
                messageBox.messageContainer.addClass('active error')
                messageBox.messageText.text(data.message)
            }
        })
        .catch(err => {
            messageBox.messageContainer.addClass('active error')
            messageBox.messageText.text(data.message)
        });
        
        event.preventDefault();
    });
});