(function() {
    var errorField;
    var position, positionElement;

    function updatePositionElement() {
        if (position) {
            positionElement.innerHTML = "Your new coordinates are:</br>X: " + roundCoordinate(position[0]) + " Y: " + roundCoordinate(position[1]);
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
            Location: {
                X: roundCoordinate(position[0]),
                Y: roundCoordinate(position[1])
            }
        };
        
        window.common.apiRequest("Account/EditLocation", data, true, function (data) {
            if (data.Code == 0) {
                document.changePage("home", {info: "You changed your location"});
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

        window.common.apiRequest("Account/Home", {}, true, function (userData) {
            var user = userData.User;

            if (data !== null) {
                var error = document.createElement("span");
                error.innerHTML = data.error;
                error.style.color = "red";
                content.appendChild(error);
                content.appendChild(document.createElement("br"));
            }

            $("#content").empty();

            var fieldSet = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = "Edit location";
            fieldSet.appendChild(legend);

            fieldSet.appendChild(document.createElement("hr"));

            errorField = document.createElement("span");
            errorField.style.color = "red";
            errorField.innerHTML = "";

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

            var location = user.Location;

            var loc = [19.8468, 19.8468];

            if (location) {
                loc = [location.X, location.Y];
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

    pages["editlocation"] = {
        name: "editlocation",
        render: renderPage
    }
})();