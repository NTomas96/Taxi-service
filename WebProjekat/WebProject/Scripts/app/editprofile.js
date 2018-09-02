(function() {
    var errorField;
    var usernameInput, passwordInput;
    var firstNameInput, lastNameInput, genderInput, jmbgInput, phoneInput, emailInput;

    function saveSubmitted(event) {
        var password = passwordInput.value;
        var firstname = firstNameInput.value;
        var lastname = lastNameInput.value;
        var jmbg = jmbgInput.value;
        var phone = phoneInput.value;
        var email = emailInput.value;

        var gender = 0;
        if (genderInput.selectedIndex != -1) {
            gender = +genderInput.options[genderInput.selectedIndex].value;
        }

        var data = {
            User: {
                Password: password,
                Firstname: firstname,
                Lastname: lastname,
                Gender: gender,
                JMBG: jmbg,
                PhoneNumber: phone,
                Email: email
            }

        }

        window.common.apiRequest("Account/Edit", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", { info: "You edited your profile" });
            }
            else {
                errorField = data.Error;
            }
        });

        event.preventDefault();
    }

    function cancelSubmitted(event) {
        document.changePage("home");

        event.preventDefault();
    }

    function renderPage(data) {
        var content = $("#content").get(0);

        window.common.apiRequest("Account/Home", {}, true, function (userData) {
            var user = userData.User;

            $("#content").empty();

            var fieldSet = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = "Edit profile";
            fieldSet.appendChild(legend);

            errorField = document.createElement("span");
            errorField.innerHTML = "";
            errorField.style.color = "red";
            fieldSet.appendChild(errorField);

            fieldSet.appendChild(document.createElement("hr"));

            var userDetails = document.createElement("label");
            userDetails.innerHTML = "User Details:";
            fieldSet.appendChild(userDetails);
            fieldSet.appendChild(document.createElement("br"));

            fieldSet.appendChild(document.createElement("br"));

            usernameInput = document.createElement("input");
            usernameInput.type = "text";
            usernameInput.disabled = true;
            usernameInput.value = user.Username;

            var usernameLabel = document.createElement("label");
            usernameLabel.innerText = "Username: ";
            usernameLabel.htmlFor = usernameInput;

            passwordInput = document.createElement("input");
            passwordInput.type = "password";
            passwordInput.value = user.Password;

            var passwordLabel = document.createElement("label");
            passwordLabel.innerText = "Password: ";
            passwordLabel.htmlFor = passwordInput;

            firstNameInput = document.createElement("input");
            firstNameInput.type = "text";
            firstNameInput.value = user.Firstname;

            var firstNameLabel = document.createElement("label");
            firstNameLabel.innerText = "First name: ";
            firstNameLabel.htmlFor = firstNameInput;

            lastNameInput = document.createElement("input");
            lastNameInput.type = "text";
            lastNameInput.value = user.Lastname;

            var lastNameLabel = document.createElement("label");
            lastNameLabel.innerText = "Last name: ";
            lastNameLabel.htmlFor = lastNameInput;

            jmbgInput = document.createElement("input");
            jmbgInput.type = "text";
            jmbgInput.value = user.JMBG;

            jmbgLabel = document.createElement("label");
            jmbgLabel.innerText = "JMBG: ";
            jmbgLabel.htmlFor = jmbgInput;

            phoneInput = document.createElement("input");
            phoneInput.type = "tel";
            phoneInput.value = user.PhoneNumber;

            var phoneNumberLabel = document.createElement("label");
            phoneNumberLabel.innerText = "Phone number: ";
            phoneNumberLabel.htmlFor = phoneInput;

            emailInput = document.createElement("input");
            emailInput.type = "email";
            emailInput.value = user.Email;

            var emailLabel = document.createElement("label");
            emailLabel.innerText = "Email: ";
            emailLabel.htmlFor = emailInput;

            genderInput = document.createElement("select");

            for (var i = 0; i < genders.length; i++) {
                var gender = document.createElement("option");
                gender.innerHTML = genders[i].name;
                gender.value = genders[i].id;

                if (genders[i].id == user.Gender) {
                    gender.selected = true;
                }

                genderInput.appendChild(gender);
            }

            var genderLabel = document.createElement("label");
            genderLabel.innerText = "Gender: ";
            genderLabel.htmlFor = genderInput;

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Save";
            submit.onclick = saveSubmitted;

            var cancel = document.createElement("input");
            cancel.type = "submit";
            cancel.value = "Cancel";
            cancel.onclick = cancelSubmitted;

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
            fieldSet.appendChild(document.createElement("br"));

            fieldSet.appendChild(document.createElement("hr"));
            fieldSet.appendChild(document.createElement("br"));

            fieldSet.appendChild(submit);
            fieldSet.appendChild(document.createTextNode("  "));
            fieldSet.appendChild(cancel);

            content.appendChild(fieldSet);
        }, true);
    }

    pages["editprofile"] = {
        name: "editprofile",
        render: renderPage
    }
})();