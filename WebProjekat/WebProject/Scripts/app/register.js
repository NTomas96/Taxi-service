(function() {

    var usernameInput, passwordInput;
    var firstNameInput, lastNameInput, genderInput, jmbgInput, phoneInput, emailInput;
    var errorField, infoField;

    function registerSubmitted(event) {
        var username = usernameInput.value;
        var password = passwordInput.value;
        var firstname = firstNameInput.value;
        var lastname = lastNameInput.value;
        var jmbg = jmbgInput.value;
        var phone = phoneInput.value;
        var email = emailInput.value;

        if (!validateUsername(username)) {
            errorField.innerHTML = "Invalid Username!";
            event.preventDefault();
            return;
        }

        if (!validatePassword(password)) {
            errorField.innerHTML = "Invalid Password!";
            event.preventDefault();
            return;
        }

        if (!validateName(firstname)) {
            errorField.innerHTML = "Invalid Firstname!";
            event.preventDefault();
            return;
        }

        if (!validateName(lastname)) {
            errorField.innerHTML = "Invalid Lastname!";
            event.preventDefault();
            return;
        }

        if (!validateEmail(email)) {
            errorField.innerHTML = "Invalid E-mail!";
            event.preventDefault();
            return;
        }

        if (!validateJMBG(jmbg)) {
            errorField.innerHTML = "Invalid JMBG!";
            event.preventDefault();
            return;
        }

        if (!validatePhone(phone)) {
            errorField.innerHTML = "Invalid Phone!";
            event.preventDefault();
            return;
        }

        var gender = 0;
        if (genderInput.selectedIndex != -1) {
            gender = +genderInput.options[genderInput.selectedIndex].value;
        }

        var data = {
            User: {
                Username: username,
                Password: password,
                Firstname: firstname,
                Lastname: lastname,
                Gender: gender,
                JMBG: jmbg,
                PhoneNumber: phone,
                Email: email
            }
        }

        window.common.apiRequest("Auth/Register", data, false, function (data) {
            if (data.Code == 0) {
                document.changePage("login", {info: "You successfully registered!"});
            }
            else {
                errorField.innerHTML = data.Error;
            }
        });

        event.preventDefault();
    }



    function removeWhiteSpace(string) {
        return String(string).replace(/\s/g, '');
    }

    function validateUsername(username) {
        username = String(username);
        return username === removeWhiteSpace(username) && username.length > 0;
    }

    function validatePassword(password) {
        return String(password).length > 0;
    }

    function validateName(name) {
        return removeWhiteSpace(name).length > 0;
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phone).toLowerCase());
    }

    function validateJMBG(jmbg) {
        return String(jmbg).length === 13 && /^\d+$/.test(jmbg);
    }

    function registerClick() {
        document.changePage("register");
    }

    function renderPage(data) {
        var content = $("#content").get(0);

        if (authToken) {
            document.changePage("home");
        }

        var fieldSet = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.innerHTML = "Register";
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

        var usernameLabel = document.createElement("label");
        usernameLabel.innerText = "Username: ";
        usernameLabel.htmlFor = usernameInput;

        passwordInput = document.createElement("input");
        passwordInput.type = "password";

        var passwordLabel = document.createElement("label");
        passwordLabel.innerText = "Password: ";
        passwordLabel.htmlFor = passwordInput;

        firstNameInput = document.createElement("input");
        firstNameInput.type = "text";

        var firstNameLabel = document.createElement("label");
        firstNameLabel.innerText = "First name: ";
        firstNameLabel.htmlFor = firstNameInput;

        lastNameInput = document.createElement("input");
        lastNameInput.type = "text";

        var lastNameLabel = document.createElement("label");
        lastNameLabel.innerText = "Last name: ";
        lastNameLabel.htmlFor = lastNameInput;

        jmbgInput = document.createElement("input");
        jmbgInput.type = "text";

        jmbgLabel = document.createElement("label");
        jmbgLabel.innerText = "JMBG: ";
        jmbgLabel.htmlFor = jmbgInput;

        phoneInput = document.createElement("input");
        phoneInput.type = "tel";

        var phoneNumberLabel = document.createElement("label");
        phoneNumberLabel.innerText = "Phone number: ";
        phoneNumberLabel.htmlFor = phoneInput;

        emailInput = document.createElement("input");
        emailInput.type = "email";

        var emailLabel = document.createElement("label");
        emailLabel.innerText = "Email: ";
        emailLabel.htmlFor = emailInput;

        genderInput = document.createElement("select");

        for (var i = 0; i < genders.length; i++) {
            var gender = document.createElement("option");
            gender.innerHTML = genders[i].name;
            gender.value = genders[i].id;
            genderInput.appendChild(gender);
        }

        var genderLabel = document.createElement("label");
        genderLabel.innerText = "Gender: ";
        genderLabel.htmlFor = genderInput;

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Register";
        submit.onclick = registerSubmitted;

        fieldSet.appendChild(usernameLabel);
        fieldSet.appendChild(usernameInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(passwordLabel);
        fieldSet.appendChild(passwordInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(firstNameLabel);
        fieldSet.appendChild(firstNameInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(lastNameLabel);
        fieldSet.appendChild(lastNameInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(genderLabel);
        fieldSet.appendChild(genderInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(jmbgLabel);
        fieldSet.appendChild(jmbgInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(phoneNumberLabel);
        fieldSet.appendChild(phoneInput);
        fieldSet.appendChild(document.createElement("br"));

        fieldSet.appendChild(emailLabel);
        fieldSet.appendChild(emailInput);
        fieldSet.appendChild(document.createElement("hr"));

        fieldSet.appendChild(submit);

        content.appendChild(fieldSet);
    }

    pages["register"] = {
        name: "register",
        render: renderPage
    }
})();