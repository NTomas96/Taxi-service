(function () {

    function editProfileClick(event) {
        document.changePage("editprofile");

        event.preventDefault();
    }

    function editLocationClick(event) {
        document.changePage("editlocation");

        event.preventDefault();
    }

    function orderRideClick(event) {
        document.changePage("orderride");

        event.preventDefault();
    }

    function createRideClick(event) {
        document.changePage("createride");

        event.preventDefault();
    }

    function createDriverClick(event) {
        document.changePage("createdriver");

        event.preventDefault();
    }

    function logoutClick(event) {

        window.common.apiRequest("Auth/Logout", {}, true, function (data) {

        });

        document.changePage("login");
        localStorage.removeItem("authToken");
        authToken = null;

        event.preventDefault();
    }

    function takeRide(rideId) {

        window.common.apiRequest("Ride/Take", {RideId: rideId}, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", { info: "You took the ride!" });
            }
            else {
                errorField.innerHTML = data.Error;
            }
        });
    }

    function giveRide(rideId) {
        document.changePage("giveride", { rideId: rideId });
    }

    function cancelRide(rideId) {
        document.changePage("cancelride", {rideId: rideId});
    }

    function commentRide(rideId, price) {
        document.changePage("commentride", { rideId: rideId});
    }

    function editRide(rideId) {
        document.changePage("editride", { rideId: rideId });
    }

    function successRide(rideId) {
        document.changePage("finishride", { rideId: rideId });
    }

    function failRide(rideId) {
        document.changePage("cancelride", { rideId: rideId });
    }

    function renderPage(pageData) {

        window.common.apiRequest("Account/Home", {}, true, function (data) {
            var content = $("#content").get(0);

            var user = data.User;

            $("#content").empty();

            var errorField = document.createElement("span");
            errorField.style.color = "red";
            errorField.innerHTML = "";

            var infoField = document.createElement("span");
            infoField.style.color = "green";
            infoField.innerHTML = "";

            if (pageData !== null) {
                if (pageData.error) {
                    errorField.innerHTML = pageData.error;
                }
                else if (pageData.info) {
                    infoField.innerHTML = pageData.info;
                }

            }

            content.appendChild(errorField);
            content.appendChild(document.createElement("br"));
            content.appendChild(infoField);

            var welcomeText = document.createElement("h4");
            welcomeText.innerHTML = "Welcome " + data.User.Firstname + " " + data.User.Lastname + "!";

            var editProfile = document.createElement("a");
            editProfile.innerHTML = "Edit profile";
            editProfile.href = "#";
            editProfile.onclick = editProfileClick;

            var logout = document.createElement("a");
            logout.innerHTML = "Logout";
            logout.href = "#";
            logout.onclick = logoutClick;

            content.appendChild(welcomeText);
            content.appendChild(document.createElement("hr"));

            content.appendChild(editProfile);
            content.appendChild(document.createTextNode("  "));

            if (data.User.Role === 2) { // Driver
                var editLocation = document.createElement("a");
                editLocation.innerHTML = "Change current location";
                editLocation.href = "#";
                editLocation.onclick = editLocationClick;
                content.appendChild(editLocation);
                content.appendChild(document.createTextNode("  "));
            }
            else if (data.User.Role === 0) { // Customer
                var orderRide = document.createElement("a");
                orderRide.innerHTML = "Order ride";
                orderRide.href = "#";
                orderRide.onclick = orderRideClick;
                content.appendChild(orderRide);
                content.appendChild(document.createTextNode("  "));
            }
            else if (data.User.Role === 1) { // Dispatcher
                var createRide = document.createElement("a");
                createRide.innerHTML = "Create ride";
                createRide.href = "#";
                createRide.onclick = createRideClick;
                content.appendChild(createRide);
                content.appendChild(document.createTextNode("  "));

                var createDriver = document.createElement("a");
                createDriver.innerHTML = "Create driver";
                createDriver.href = "#";
                createDriver.onclick = createDriverClick;
                content.appendChild(createDriver);
                content.appendChild(document.createTextNode("  "));
            }

            content.appendChild(logout);
            content.appendChild(document.createElement("hr"));

            var rideTable = document.createElement("table");
            content.appendChild(document.createTextNode("Your rides:"));
            content.appendChild(document.createElement("br"));
            content.appendChild(rideTable);

            content.appendChild(document.createElement("hr"));
            var rideTableExtra;

            if (user.Role != 0) {
                rideTableExtra = document.createElement("table");
                content.appendChild(document.createTextNode("Free rides:"));
                content.appendChild(document.createElement("br"));
                content.appendChild(rideTableExtra);
            }
            

            window.common.apiRequest("Ride/GetAll", {}, true, function (data) {
                window.common.createRidesTable(rideTable, data.Rides, user, function (ride, user, cell) {
                    if (ride.Status === 0 && user.Role === 0) {
                        var cancel = document.createElement("input");
                        cancel.type = "submit";
                        cancel.value = "Cancel";
                        cancel.className = "tableAction";
                        cancel.addEventListener("click", function (e) {
                            cancelRide(ride.Id);
                            e.preventDefault();
                        });

                        var edit = document.createElement("input");
                        edit.type = "submit";
                        edit.value = "Edit";
                        edit.className = "tableAction";
                        edit.addEventListener("click", function (e) {
                            editRide(ride.Id);
                            e.preventDefault();
                        });

                        cell.appendChild(cancel);
                        cell.appendChild(edit);
                    }
                    if (ride.Status === 5 && user.Role === 0 && ride.Comment == null) {
                        var comment = document.createElement("input");
                        comment.type = "submit";
                        comment.value = "Comment";
                        comment.className = "tableAction";
                        comment.addEventListener("click", function (e) {
                            commentRide(ride.Id, ride.Price);
                            e.preventDefault();
                        });

                        cell.appendChild(comment);
                    }
                    else if ((ride.Status === 2 || ride.Status === 3 || ride.Status === 4) && user.Role === 2) {
                        var fail = document.createElement("input");
                        fail.type = "submit";
                        fail.value = "Fail";
                        fail.className = "tableAction";
                        fail.addEventListener("click", function (e) {
                            failRide(ride.Id);
                            e.preventDefault();
                        });

                        var success = document.createElement("input");
                        success.type = "submit";
                        success.value = "Success";
                        success.className = "tableAction";
                        success.addEventListener("click", function (e) {
                            successRide(ride.Id);
                            e.preventDefault();
                        });

                        cell.appendChild(fail);
                        cell.appendChild(success);
                    }
                });

                content.appendChild(document.createElement("hr"));

                if (data.Extra != null) {
                    window.common.createRidesTable(rideTableExtra, data.Extra, user, function (ride, user, cell) {
                        if (ride.Status === 0 && user.Role === 2) {
                            var take = document.createElement("input");
                            take.type = "submit";
                            take.className = "tableAction";
                            take.value = "Take ride";
                            take.addEventListener("click", function (e) {
                                takeRide(ride.Id);
                                e.preventDefault();
                            });

                            cell.appendChild(take);
                        }
                        else if (ride.Status === 0 && user.Role === 1) {
                            var take = document.createElement("input");
                            take.type = "submit";
                            take.className = "tableAction";
                            take.value = "Give ride";
                            take.addEventListener("click", function (e) {
                                giveRide(ride.Id);
                                e.preventDefault();
                            });

                            cell.appendChild(take);
                        }
                    });
                }
            }, true);

        }, true);

        
    }

    pages["home"] = {
        name: "home",
        render: renderPage
    }
})();