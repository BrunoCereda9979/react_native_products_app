$(document).ready(function () {
    const addProductButton = $('#btn-add-product')

    const messageBox = {
        messageContainer: $('#message-container'),
        messageText: $('#message-text'),
        closeMessageButton: $('#btn-close-msg'),
    }

    const loginForm = {
        emailLoginInput: $("#email-login-input"),
        passwordLoginInput: $("#password-login-input"),
        loginButton: $("#btn-send-login"),
    }

    const signupForm = {
        emailSignupInput: $("#signup-email-input"),
        passwordSignupInput: $("#signup-password-input"),
        signupButton: $("#btn-send-signup"),
    }

    //LOGIN USER
    $(loginForm.loginButton).click(function (event) {
        loginFormData = {
            userEmail: $(loginForm.emailLoginInput).val(),
            userPassword: $(loginForm.passwordLoginInput).val()
        }

        fetch('http://localhost:3000/users/login', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(loginFormData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                localStorage.setItem('myAuthToken', data.token)
                messageBox.messageContainer.addClass('active success')
                messageBox.messageText.text(data.message)
                var myAuthToken = localStorage.getItem('myAuthToken')
            }
            else {
                messageBox.messageContainer.addClass('active error')
                messageBox.messageText.text(data.message)
            }
        })
        .catch(err => {
            messageBox.messageContainer.addClass('active error')
            messageBox.messageText.text(err.message)
        });

        event.preventDefault();
    });

    //SIGNUP USER
    $(signupForm.signupButton).click(function (event) {
        signupFormData = {
            userEmail: $(signupForm.emailSignupInput).val(),
            userPassword: $(signupForm.passwordSignupInput).val()
        }

        fetch('http://localhost:3000/users/signup', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(signupFormData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                messageBox.messageContainer.addClass('active success')
                messageBox.messageText.text(data.message)
            }
            else {
                messageBox.messageContainer.addClass('active error')
                messageBox.messageText.text(data.message)
            }
        })
        .catch(err => {
            messageBox.messageContainer.addClass('active error')
            messageBox.messageText.text(data.message)
        })

        event.preventDefault()
    });

    $(messageBox.closeMessageButton).click(function (event) {
        messageBox.messageContainer.removeClass('active')
    });
});