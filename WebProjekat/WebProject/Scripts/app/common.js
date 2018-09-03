
window.common = (function () {
    var common = {};

    function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = fillNumber(a.getDate(), 2);
        var hour = fillNumber(a.getHours(), 2);
        var min = fillNumber(a.getMinutes(), 2);
        var sec = fillNumber(a.getSeconds(), 2);
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    function fillNumber(number, length) {
        number = "" + number;

        while (number.length < length) {
            number = "0" + number;
        }

        return number;
    }

    function applyFilter(table) {

        var shown = [];

        for (var i = 0; i < table.rideFilter.length; i++) {
            var id = table.rideFilter[i].rideType;
            var shows = table.rideFilter[i].checked;

            shown[id] = shows;
        }

        for (var i = 0; i < table.rows.length; i++) {
            var row = table.rows[i];

            if ("ride" in row) {
                var id = row.ride.Status;

                if (shown[id]) {
                    row.style.display = "table-row";
                }
                else {
                    row.style.display = "none";
                }
            }
        }
    }

    function sortTableBy(table, by) {
        if (by === "date") {
            var rows = Array.from(table.rows);
            rows.sort(function (row1, row2) {
                if (!("ride" in row1))
                    return -1;

                if (!("ride" in row2))
                    return 1;

                if (row1.ride.Time > row2.ride.Time)
                    return -1;
                else if (row1.ride.Time < row2.ride.Time)
                    return 1;
                else
                    return 0;
            });

            table.innerHTML = "";
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                table.appendChild(row);
            }
        }
        else if (by === "rating") {
            var rows = Array.from(table.rows);
            rows.sort(function (row1, row2) {
                if (!("ride" in row1))
                    return -1;

                if (!("ride" in row2))
                    return 1;

                var rating1 = 0;
                var rating2 = 0;

                if (row1.ride.Comment != null)
                    rating1 = row1.ride.Comment.Review;

                if (row2.ride.Comment != null)
                    rating2 = row2.ride.Comment.Review;

                if (rating1 > rating2)
                    return -1;
                else if (rating1 < rating2)
                    return 1;
                else
                    return 0;
            });

            table.innerHTML = "";
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                table.appendChild(row);
            }
        }
    }

    function refreshSearchType(table) {
        var type = table.searchType.value;

        var div = table.searchDiv;
        $(div).empty();

        if (type === "date") {
            div.fromInput = document.createElement("input");
            div.fromInput.type = "datetime";
            

            var label = document.createElement("label");
            label.innerHTML = "From:";
            label.htmlFor = div.fromInput;

            div.appendChild(document.createElement("hr"));
            div.appendChild(label);
            div.appendChild(div.fromInput);
            div.appendChild(document.createElement("br"));

            div.toInput = document.createElement("input");
            div.toInput.type = "datetime";


            var label = document.createElement("label");
            label.innerHTML = "To: ";
            label.htmlFor = div.toInput;
            div.appendChild(label);
            div.appendChild(div.toInput);
            div.appendChild(document.createElement("hr"));
        }
        else if(type === "price") {
            div.fromInput = document.createElement("input");
            div.fromInput.type = "text";


            var label = document.createElement("label");
            label.innerHTML = "From: ";
            label.htmlFor = div.fromInput;

            div.appendChild(document.createElement("hr"));
            div.appendChild(label);
            div.appendChild(div.fromInput);
            div.appendChild(document.createElement("br"));

            div.toInput = document.createElement("input");
            div.toInput.type = "text";


            var label = document.createElement("label");
            label.innerHTML = "To: ";
            label.htmlFor = div.toInput;
            div.appendChild(label);
            div.appendChild(div.toInput);
            div.appendChild(document.createElement("hr"));
        }
        else if (type === "rating") {
            div.fromInput = document.createElement("input");
            div.fromInput.type = "text";


            var label = document.createElement("label");
            label.innerHTML = "From: ";
            label.htmlFor = div.fromInput;

            div.appendChild(document.createElement("hr"));
            div.appendChild(label);
            div.appendChild(div.fromInput);
            div.appendChild(document.createElement("br"));

            div.toInput = document.createElement("input");
            div.toInput.type = "text";


            var label = document.createElement("label");
            label.innerHTML = "To: ";
            label.htmlFor = div.toInput;
            div.appendChild(label);
            div.appendChild(div.toInput);
            div.appendChild(document.createElement("hr"));
        }
    }

    function searchTable(table) {
        var type = table.searchType.value;

        var div = table.searchDiv;

        if (type === "date") {
            var fromDate = new Date(div.fromInput.value).getTime() / 1000;
            var toDate = new Date(div.toInput.value).getTime() / 1000;

            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];

                if ("ride" in row) {
                    var id = row.ride.Status;

                    if (row.style.display === "" || row.style.display === "table-row") {
                        if (row.ride.Time < fromDate || row.ride.Time > toDate) {
                            row.style.display = "none";
                        }
                    }
                }
            }
        }
        else if (type === "price") {
            var fromPrice = parseFloat(div.fromInput.value);
            var toPrice = parseFloat(div.toInput.value);

            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];

                if ("ride" in row) {
                    var id = row.ride.Status;

                    if (row.style.display === "" || row.style.display === "table-row") {
                        if (row.ride.Price < fromPrice || row.ride.Price > toPrice) {
                            row.style.display = "none";
                        }
                    }
                }
            }
        }
        else if (type === "rating") {
            var fromRating = parseFloat(div.fromInput.value);
            var toRating = parseFloat(div.toInput.value);

            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];

                if ("ride" in row) {
                    var id = row.ride.Status;

                    var rating = 0;

                    if (row.ride.Comment != null)
                        rating = row.ride.Comment.Review;

                    if (row.style.display === "" || row.style.display === "table-row") {
                        if (rating < fromRating || rating > toRating) {
                            row.style.display = "none";
                        }
                    }
                }
            }
        }
    }

    common.createRidesTable = function (rideTable, rides, user, callback) {
        rideTable.style.borderCollapse = "collapse";
        rideTable.style.marginLeft = "auto";
        rideTable.style.marginRight = "auto";
        rideTable.rides = rides;
        rideTable.rideFilter = [];

        var row = rideTable.insertRow(0);

        var cell = row.insertCell(0);
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("Status filter:"));
        cell.appendChild(document.createElement("br"));

        var checkTable = document.createElement("table");
        var r = document.createElement("tr");
        var c1 = document.createElement("td");
        var c2 = document.createElement("td");

        for (var i = 0; i < rideStatuses.length; i++) {

            var input = document.createElement("input");
            input.type = "checkbox";
            input.checked = true;
            input.rideType = rideStatuses[i].id;
            input.addEventListener("change", function (e) {
                applyFilter(rideTable);
                e.preventDefault();
            });
           

            rideTable.rideFilter[i] = input;

            if (i % 2 == 0) {
                var label = document.createElement("label");
                label.innerHTML = rideStatuses[i].name;
                label.htmlFor = input;

                c1.appendChild(input);
                c1.appendChild(label);
                c1.appendChild(document.createElement("br"));
            }
            else {
                var label = document.createElement("label");
                label.innerHTML = rideStatuses[i].name;
                label.htmlFor = input;

                c2.appendChild(input);
                c2.appendChild(label);
                c2.appendChild(document.createElement("br"));
            }
        }

        r.appendChild(c1);
        r.appendChild(c2);
        checkTable.appendChild(r);
        cell.appendChild(checkTable);

        var cell = row.insertCell(1);
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell.colSpan = 3;
        cell.appendChild(document.createTextNode("Sort by:"));
        cell.appendChild(document.createElement("br"));
        cell.appendChild(document.createElement("br"));

        cell.style.textAlign = "left";
        var input1 = document.createElement("input");
        input1.type = "radio";
        input1.checked = true;
        input1.addEventListener("change", function (e) {
            if (e.target.checked) {
                input2.checked = false;
                sortTableBy(rideTable, "date");
            }
            else {
                input2.checked = true;
            }
            e.preventDefault();
        });

        var label = document.createElement("label");
        label.innerHTML = "Date";
        label.htmlFor = input1;

        cell.appendChild(input1);
        cell.appendChild(label);
        cell.appendChild(document.createTextNode(" "));

        var input2 = document.createElement("input");
        input2.type = "radio";
        input2.checked = false;
        input2.addEventListener("change", function (e) {
            if (e.target.checked) {
                input1.checked = false;
                sortTableBy(rideTable, "rating");
            }
            else {
                input1.checked = true;
            }
            
            e.preventDefault();
        });

        var label = document.createElement("label");
        label.innerHTML = "Rating";
        label.htmlFor = input2;

        cell.appendChild(input2);
        cell.appendChild(label);
        cell.appendChild(document.createElement("br"));

        var cell = row.insertCell(2);
        cell.style.textAlign = "left";
        cell.style.border = "1px solid black";
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("Search by:"));
        cell.appendChild(document.createTextNode("  "));

        var searchType = document.createElement("select");
        var option = document.createElement("option");
        option.innerHTML = "Date"
        option.value = "date";
        searchType.appendChild(option);
        option = document.createElement("option");
        option.innerHTML = "Price"
        option.value = "price";
        searchType.appendChild(option);
        option = document.createElement("option");
        option.innerHTML = "Rating"
        option.value = "rating";

        searchType.addEventListener("change", function (e) {
            refreshSearchType(rideTable);
        });

        searchType.appendChild(option);

        

        var searchDiv = document.createElement("div");
        rideTable.searchDiv = searchDiv;
        rideTable.searchType = searchType;

        refreshSearchType(rideTable);

        var searchButton = document.createElement("input");
        searchButton.type = "submit";
        searchButton.value = "Search";
        searchButton.addEventListener("click", function (e) {
            searchTable(rideTable);
        });

        var searchButtonReset = document.createElement("input");
        searchButtonReset.type = "submit";
        searchButtonReset.value = "Reset";
        searchButtonReset.addEventListener("click", function (e) {
            applyFilter(rideTable);
        });

        cell.appendChild(searchType);
        cell.appendChild(searchDiv);
        cell.appendChild(searchButton);
        cell.appendChild(document.createTextNode("  "));
        cell.appendChild(searchButtonReset);

        

        row = rideTable.insertRow(1);
        var cell = row.insertCell(0);
        cell.innerHTML = "Time";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(1);
        cell.innerHTML = "Status";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(2);
        cell.innerHTML = "Driver";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(3);
        cell.innerHTML = "Price";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(4);
        cell.innerHTML = "Vehicle type";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(5);
        cell.innerHTML = "Actions";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";
        cell = row.insertCell(6);
        cell.innerHTML = "Comment";
        cell.style.textAlign = "center";
        cell.style.border = "1px solid black";


        for (var i = 0; i < rides.length; i++) {
            var ride = rides[i];

            var row = rideTable.insertRow(i + 2);
            row.ride = ride;

            var cell = row.insertCell(0);
            cell.innerHTML = timeConverter(ride.Time);
            cell.style.border = "1px solid black";
            cell.style.textAlign = "center";

            cell = row.insertCell(1);
            cell.innerHTML = rideStatuses[ride.Status].name;
            cell.style.border = "1px solid black";
            cell.style.textAlign = "center";

            cell = row.insertCell(2);

            var driver = "/";
            if (ride.Driver) {
                driver = ride.Driver.Firstname + " " + ride.Driver.Lastname;
            }
            cell.innerHTML = driver;
            cell.style.textAlign = "center";
            cell.style.border = "1px solid black";

            cell = row.insertCell(3);
            cell.innerHTML = ride.Price;
            cell.style.textAlign = "center";
            cell.style.border = "1px solid black";

            cell = row.insertCell(4);

            var vehicleType = "Any";

            if (ride.VehicleType !== null && ride.VehicleType >= 0 && ride.VehicleType < vehicleTypes.length) {
                vehicleType = vehicleTypes[ride.VehicleType].name;
            }

            cell.innerHTML = vehicleType;
            cell.style.textAlign = "center";
            cell.style.border = "1px solid black";

            cell = row.insertCell(5);
            cell.style.textAlign = "center";
            cell.style.border = "1px solid black";
            callback(ride, user, cell);

            cell = row.insertCell(6);
            cell.style.textAlign = "left";
            cell.style.border = "1px solid black";

            if (ride.Comment != null) {
                
                cell.innerHTML = "By: " + ride.Comment.Username + "<br/>On: " + timeConverter(ride.Comment.Time) + "<br/>Comment: " + ride.Comment.Description + "<br/>Rating: " + ride.Comment.Review;
            } else {
                cell.innerHTML = "/";
            }
        }

        sortTableBy(rideTable, "date");
    }

    common.apiRequest = function (path, data, sendToken, callback, get) {

        if (sendToken) {
            data.Token = authToken;
        }

        var contentType;

        var type = "POST";
        if (get) {
            type = "GET";
            contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        }
        else {
            data = JSON.stringify(data)
            contentType = "application/json";
        }


        $.ajax({
            url: "/Api/" + path,
            type: type,
            data: data,
            dataType: "json",
            contentType: contentType
        }).done(function (data) {
            if (data.Code === 1) {
                authToken = null;
                document.changePage("login");
            }
            else {
                callback(data);
            }
        });
    }

    return common;
})();