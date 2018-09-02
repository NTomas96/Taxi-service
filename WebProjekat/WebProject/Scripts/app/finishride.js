(function() {
    var errorField;
    var position, positionElement;
    var priceInput;
    var rideId;

    function updatePositionElement() {
        if (position) {
            positionElement.innerHTML = "Destination coordinates are:<br>X: " + roundCoordinate(position[0]) + " Y: " + roundCoordinate(position[1]);
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

        if (! validateFloat(priceInput.value)) {
            errorField.innerHTML = "Invalid price!";
            event.preventDefault();
            return;
        }

        var data = {
            RideId: rideId,
            Destination: {
                X: roundCoordinate(position[0]),
                Y: roundCoordinate(position[1])
            },
            Price: parseFloat(priceInput.value),
            Success: true
        };
        
        window.common.apiRequest("Ride/Finish", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", { info: "You successfully finished a ride!" });
            }
            else {
                errorField.innerHTML = data.Error;
            }
        });

        event.preventDefault();
    }

    function validateFloat(number) {
        return ! isNaN(parseFloat(number));
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
            legend.innerHTML = "Finish ride";
            fieldSet.appendChild(legend);

            errorField = document.createElement("span");
            errorField.style.color = "red";
            errorField.innerHTML = "";

            fieldSet.appendChild(errorField);
            fieldSet.appendChild(document.createElement("hr"));

            priceInput = document.createElement("input");
            priceInput.type = "text";
            
            var priceLabel = document.createElement("label");
            priceLabel.innerText = "Price: ";
            priceLabel.htmlFor = priceInput;

            fieldSet.appendChild(priceLabel);
            fieldSet.appendChild(priceInput);
            fieldSet.appendChild(document.createElement("hr"));

            var mapdiv = document.createElement("div");
            mapdiv.style.width = "400px";
            mapdiv.style.height = "400px";
            mapdiv.style.marginLeft = "auto";
            mapdiv.style.marginRight = "auto";

            positionElement = document.createElement("span");

            fieldSet.appendChild(mapdiv);
            fieldSet.appendChild(positionElement);
            fieldSet.appendChild(document.createElement("hr"));

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Save";
            submit.onclick = saveSubmitted;

            var cancel = document.createElement("input");
            cancel.type = "submit";
            cancel.value = "Cancel";
            cancel.onclick = cancelSubmitted;
            
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

    pages["finishride"] = {
        name: "finishride",
        render: renderPage
    }
})();