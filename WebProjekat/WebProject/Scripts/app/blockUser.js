(function () {

    var user;
    var blockedOrUnblockedUserInput;

    function blockOrUnblockUser(event) {

        var data = {
            UserId: blockedOrUnblockedUserInput.value,
        };

        window.common.apiRequest("Auth/blockOrUnblockUser", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home");
            }
            else {
                errorField.innerHTML = data.Error;
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

        window.common.apiRequest("Auth/GetAllUsers", {}, true, function (userData) {
            $("#content").empty();

            var fieldSet = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = "Block/Unblock a user";
            fieldSet.appendChild(legend);

            fieldSet.appendChild(document.createElement("hr"));

            blockedOrUnblockedUserInput = document.createElement("select");

            for (var i = 0; i < userData.Users.length; i++) {
                user = document.createElement("option");

                user.innerHTML = userData.Users[i].Firstname + " " + userData.Users[i].Lastname + " ( B: " + userData.Users[i].Blocked + " )";
                user.value = userData.Users[i].Id;

                blockedOrUnblockedUserInput.appendChild(user);
            }

            var blockedOrUnblockedUserLabel = document.createElement("label");
            blockedOrUnblockedUserLabel.innerText = "All users: ";
            blockedOrUnblockedUserLabel.htmlFor = blockedOrUnblockedUserInput;

            fieldSet.appendChild(blockedOrUnblockedUserLabel);
            fieldSet.appendChild(blockedOrUnblockedUserInput);

            fieldSet.appendChild(document.createElement("hr"));

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Block/Unblock";
            submit.onclick = blockOrUnblockUser;

            var cancel = document.createElement("input");
            cancel.type = "submit";
            cancel.value = "Cancel";
            cancel.onclick = cancelSubmitted;

            fieldSet.appendChild(submit);
            fieldSet.appendChild(document.createTextNode("  "));
            fieldSet.appendChild(cancel);

            fieldSet.appendChild(document.createElement("hr"));

            content.appendChild(fieldSet);
        }, true);
    }


    pages["blockUser"] = {
        name: "blockUser",
        render: renderPage
    }
})();