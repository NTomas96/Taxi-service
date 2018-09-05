(function() {
    var errorField;
    var driverInput;
    var rideId;


    function saveSubmitted(event) {

        var data = {
            RideId: rideId,
            DriverId: driverInput.value
        };
        
        window.common.apiRequest("Ride/Give", data, true, function (data) {
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

        rideId = data.rideId;

        window.common.apiRequest("Ride/GetFreeDrivers", {}, true, function (driverData) {
            $("#content").empty();

            var fieldSet = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = "Give ride";
            fieldSet.appendChild(legend);

            errorField = document.createElement("span");
            errorField.style.color = "red";
            errorField.innerHTML = "";

            fieldSet.appendChild(errorField);
            fieldSet.appendChild(document.createElement("hr"));

            driverInput = document.createElement("select");

            driverData.Drivers.sort(function (driver1, driver2) {
                if (!("Location" in driver1) || driver1.Location === null)
                    return 1;
                if (!("Location" in driver2) || driver2.Location === null)
                    return -1;

                var point = data.cords;
                var point1 = [driver1.Location.X, driver1.Location.Y];
                var point2 = [driver2.Location.X, driver2.Location.Y];

                var dis1 = window.common.getCoordsDistance(point, point1);
                var dis2 = window.common.getCoordsDistance(point, point2);

                if (dis1 < dis2)
                    return -1;
                else if (dis1 > dis2)
                    return 1;
                else
                    return 0;
            });

            var len = 5;
            if (driverData.Drivers.length < 5) {
                len = driverData.Drivers.length;
            }

            for (var i = 0; i < len; i++) {
                var driver = document.createElement("option");
                driver.innerHTML = driverData.Drivers[i].Firstname + " " + driverData.Drivers[i].Lastname;
                driver.value = driverData.Drivers[i].Id;

                driverInput.appendChild(driver);
            }

            var driverLabel = document.createElement("label");
            driverLabel.innerText = "Driver: ";
            driverLabel.htmlFor = driverInput;

            fieldSet.appendChild(driverLabel);
            fieldSet.appendChild(driverInput);
            fieldSet.appendChild(document.createElement("hr"));

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Create";
            submit.onclick = saveSubmitted;

            var cancel = document.createElement("input");
            cancel.type = "submit";
            cancel.value = "Cancel";
            cancel.onclick = cancelSubmitted;
            
            fieldSet.appendChild(submit);
            fieldSet.appendChild(document.createTextNode("  "));
            fieldSet.appendChild(cancel);

            content.appendChild(fieldSet);
        }, true);
    }

    pages["giveride"] = {
        name: "giveride",
        render: renderPage
    }
})();