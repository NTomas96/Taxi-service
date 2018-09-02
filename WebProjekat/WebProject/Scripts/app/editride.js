(function() {
    var errorField;
    var position, positionElement;
    var vehicleTypeInput;
    var rideId;

    function updatePositionElement() {
        if (position) {
            positionElement.innerHTML = "Changed coordinates are:<br>X: " + roundCoordinate(position[0]) + " Y: " + roundCoordinate(position[1]);
        }
        else {
            positionElement.innerHTML = "";
        }
    }

    function roundCoordinate(coord) {
        return Math.round(coord * 10000) / 10000;
    }

    function saveSubmitted(event) {

        if (position == null) {
            errorField.innerHTML = "Please select a location on the map!";
            event.preventDefault();
            return;
        }

        var data = {
            RideId: rideId,
            Location: {
                X: roundCoordinate(position[0]),
                Y: roundCoordinate(position[1])
            },
            VehicleType: vehicleTypeInput.value
        };
        
        window.common.apiRequest("Ride/Edit", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", { info: "You successfully edited a ride!" });
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

        window.common.apiRequest("Ride/Get", {RideId: data.rideId}, true, function (rideData) {
            var ride = rideData.Ride;

            rideId = data.rideId;

            $("#content").empty();

            var fieldSet = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = "Edit ride";
            fieldSet.appendChild(legend);

            errorField = document.createElement("span");
            errorField.style.color = "red";
            errorField.innerHTML = "";


            fieldSet.appendChild(errorField);
            fieldSet.appendChild(document.createElement("hr"));

            vehicleTypeInput = document.createElement("select");

            var allType = document.createElement("option");
            allType.innerHTML = "Any";
            allType.value = -1;
            allType.selected = true;
            vehicleTypeInput.appendChild(allType);

            for (var i = 0; i < vehicleTypes.length; i++) {
                var type = document.createElement("option");
                type.innerHTML = vehicleTypes[i].name;
                type.value = vehicleTypes[i].id;

                if (ride.VehicleType == vehicleTypes[i].id) {
                    type.selected = true;
                    allType.selected = false;
                }

                vehicleTypeInput.appendChild(type);
            }

            var vehicleTypeLabel = document.createElement("label");
            vehicleTypeLabel.innerText = "Vehicle type: ";
            vehicleTypeLabel.htmlFor = vehicleTypeInput;

            fieldSet.appendChild(vehicleTypeLabel);
            fieldSet.appendChild(vehicleTypeInput);
            fieldSet.appendChild(document.createElement("hr"));

            var mapdiv = document.createElement("div");
            mapdiv.style.width = "400px";
            mapdiv.style.height = "400px";
            mapdiv.style.marginLeft = "auto";
            mapdiv.style.marginRight = "auto";

            positionElement = document.createElement("span");

            fieldSet.appendChild(mapdiv);
            fieldSet.appendChild(positionElement);
            

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Save";
            submit.onclick = saveSubmitted;

            var cancel = document.createElement("input");
            cancel.type = "submit";
            cancel.value = "Cancel";
            cancel.onclick = cancelSubmitted;

            fieldSet.appendChild(document.createElement("hr"));
            fieldSet.appendChild(submit);
            fieldSet.appendChild(document.createTextNode("  "));
            fieldSet.appendChild(cancel);

            content.appendChild(fieldSet);

            var loc = [19.8305, 45.2491];

            if (ride.Origin) {
                loc = [ride.Origin.X, ride.Origin.Y];
                position = loc;
            }

            var map = new ol.Map({
                target: mapdiv,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat(loc),
                    zoom: 15
                })
            });

            map.on("click", function (e) {
                position = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
                updatePositionElement();
            });
        }, true);
    }

    pages["editride"] = {
        name: "editride",
        render: renderPage
    }
})();