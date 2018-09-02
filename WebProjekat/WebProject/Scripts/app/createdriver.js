(function() {

    var usernameInput, passwordInput;
    var firstNameInput, lastNameInput, genderInput, jmbgInput, phoneInput, emailInput;
    var vehicleYearInput, vehicleLicenseInput, vehicleTaxiNumInput, vehicleTypeInput;
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

        if (vehicleLicenseInput.value.length == 0 || vehicleTaxiNumInput.value.length == 0) {
            errorField.innerHTML = "Invalid Vehicle info!";
            event.preventDefault();
            return;
        }

        var gender = 0;
        if (genderInput.selectedIndex != -1) {
            gender = +genderInput.options[genderInput.selectedIndex].value;
        }

        var data = {
            Driver: {
                Username: username,
                Password: password,
                Firstname: firstname,
                Lastname: lastname,
                Gender: gender,
                JMBG: jmbg,
                PhoneNumber: phone,
                Email: email,
                Vehicle: {
                    Year: vehicleYearInput.value,
                    License: vehicleLicenseInput.value,
                    TaxiID: vehicleTaxiNumInput.value,
                    Type: vehicleTypeInput.value
                }
            }

        }

        window.common.apiRequest("Auth/CreateDriver", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", { info: "You successfully created a driver!" });
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

    function cancelSubmitted() {
        document.changePage("home");
    }

    function renderPage(data) {
        var content = $("#content").get(0);

        var fieldSet = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.innerHTML = "Register Driver";
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
        
        fieldSet.appendChild(document.createElement("br"));

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

        vehicleYearInput = document.createElement("input");
        vehicleYearInput.type = "text";

        var vehicleYearLabel = document.createElement("label");
        vehicleYearLabel.innerText = "Vehicle year: ";
        vehicleYearLabel.htmlFor = vehicleYearInput;

        vehicleLicenseInput = document.createElement("input");
        vehicleLicenseInput.type = "text";

        var vehicleLicenseLabel = document.createElement("label");
        vehicleLicenseLabel.innerText = "Vehicle license: ";
        vehicleLicenseLabel.htmlFor = vehicleLicenseInput;

        vehicleTaxiNumInput = document.createElement("input");
        vehicleTaxiNumInput.type = "text";

        var vehicleTaxiNumLabel = document.createElement("label");
        vehicleTaxiNumLabel.innerText = "Vehicle taxi number: ";
        vehicleTaxiNumLabel.htmlFor = vehicleTaxiNumInput;

        vehicleTypeInput = document.createElement("select");

        for (var i = 0; i < vehicleTypes.length; i++) {
            var type = document.createElement("option");
            type.innerHTML = vehicleTypes[i].name;
            type.value = vehicleTypes[i].id;
            vehicleTypeInput.appendChild(type);
        }

        var vehicleTypeLabel = document.createElement("label");
        vehicleTypeLabel.innerText = "Vehicle type: ";
        vehicleTypeLabel.htmlFor = vehicleTypeInput;

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Create";
        submit.onclick = registerSubmitted;

        var cancel = document.createElement("input");
        cancel.type = "submit";
        cancel.value = "Cancel";
        cancel.onclick = cancelSubmitted;

        var table = document.createElement("table");
        var row1 = document.createElement("tr");
        var row2 = document.createElement("tr");
        var t1 = document.createElement("th");
        var t2 = document.createElement("th");
        var content1 = document.createElement("td");
        var content2 = document.createElement("td");

        var driverDetails = document.createElement("label");
        driverDetails.innerText = "Driver Details: ";
        t1.appendChild(driverDetails);

        var vehicleDetails = document.createElement("label");
        vehicleDetails.innerText = "Vehicle Details: ";
        t2.appendChild(vehicleDetails);

        content1.appendChild(usernameLabel);
        content1.appendChild(usernameInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(passwordLabel);
        content1.appendChild(passwordInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(firstNameLabel);
        content1.appendChild(firstNameInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(lastNameLabel);
        content1.appendChild(lastNameInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(genderLabel);
        content1.appendChild(genderInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(jmbgLabel);
        content1.appendChild(jmbgInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(phoneNumberLabel);
        content1.appendChild(phoneInput);
        content1.appendChild(document.createElement("br"));

        content1.appendChild(emailLabel);
        content1.appendChild(emailInput);
        content1.appendChild(document.createElement("br"));

        content2.appendChild(vehicleYearLabel);
        content2.appendChild(vehicleYearInput);
        content2.appendChild(document.createElement("br"));

        content2.appendChild(vehicleLicenseLabel);
        content2.appendChild(vehicleLicenseInput);
        content2.appendChild(document.createElement("br"));

        content2.appendChild(vehicleTaxiNumLabel);
        content2.appendChild(vehicleTaxiNumInput);
        content2.appendChild(document.createElement("br"));

        content2.appendChild(vehicleTypeLabel);
        content2.appendChild(vehicleTypeInput);

        row1.appendChild(t1);
        row1.appendChild(t2);
        row2.appendChild(content1);
        row2.appendChild(content2);
        table.appendChild(row1);
        table.appendChild(row2);

        fieldSet.appendChild(table);

        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(document.createElement("hr"));
        fieldSet.appendChild(document.createElement("br"));

        

        fieldSet.appendChild(submit);
        fieldSet.appendChild(document.createTextNode("  "));
        fieldSet.appendChild(cancel);

        content.appendChild(fieldSet);
    }

    pages["createdriver"] = {
        name: "createdriver",
        render: renderPage
    }
})();