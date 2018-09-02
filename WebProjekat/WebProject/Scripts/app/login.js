(function() {

    var usernameInput, passwordInput;
    var errorField, infoField;

    function loginSubmitted(event) {
        var username = usernameInput.value;
        var password = passwordInput.value;

        var data = {
            Username: username,
            Password: password
        }

        window.common.apiRequest("Auth/Login", data, false, function (data) {
            if (data.Code == 0) {
                authToken = data.Token;
                localStorage.setItem("authToken", authToken);
                document.changePage("home");
            }
            else {
                errorField.innerHTML = data.Error;
            }
        });

        event.preventDefault();
    }

    function registerClick(event) {
        document.changePage("register");
        event.preventDefault();
    }

    function renderPage(data) {
        var content = $("#content").get(0);

        var fieldSet = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.innerHTML = "Login";
        fieldSet.appendChild(legend);

        errorField = document.createElement("span");
        errorField.style.color = "red";
        errorField.innerHTML = "";

        infoField = document.createElement("span");
        infoField.style.color = "green";
        infoField.innerHTML = "";

        if (data !== null) {
            if (data.error) {
                errorField.innerHTML = data.error;
            }
            else if (data.info) {
                infoField.innerHTML = data.info;
            }

        }

        fieldSet.appendChild(errorField);
        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(infoField);
        fieldSet.appendChild(document.createElement("hr"));

        usernameInput = document.createElement("input");
        usernameInput.type = "text";

        passwordInput = document.createElement("input");
        passwordInput.type = "password";

        var usernameLabel = document.createElement("label");
        usernameLabel.innerText = "Username: ";
        usernameLabel.htmlFor = usernameInput;

        var passwordLabel = document.createElement("label");
        passwordLabel.innerText = "Password: ";
        passwordLabel.htmlFor = passwordInput;

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Login";
        submit.onclick = loginSubmitted;

        var register = document.createElement("input");
        register.type = "submit";
        register.value = "Create account";
        register.onclick = registerClick;


        fieldSet.appendChild(usernameLabel)
        fieldSet.appendChild(usernameInput);
        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(passwordLabel);
        fieldSet.appendChild(passwordInput);
        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(document.createElement("hr"));
        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(submit);
        fieldSet.appendChild(document.createTextNode("  "));
        fieldSet.appendChild(register);

        content.appendChild(fieldSet);
    }

    pages["login"] = {
        name: "login",
        render: renderPage
    }
})();