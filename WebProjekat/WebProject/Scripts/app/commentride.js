(function() {

    var descInput, reviewInput;
    var rideId;

    function saveSubmitted(event) {

        var data = {
            RideId: rideId,
            Success: true,
            Comment: {
                Description: descInput.value,
                Review: reviewInput.value
            }
        };
        
        window.common.apiRequest("Ride/Finish", data, true, function (data) {
            document.changePage("home");
        });

        event.preventDefault();
    }

    function cancelSubmitted(event) {
        document.changePage("home");

        event.preventDefault();
    }

    function renderPage(data) {

        rideId = data.rideId;

        var content = $("#content").get(0);

        var fieldSet = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.innerHTML = "Cancel ride";
        fieldSet.appendChild(legend);

        if (data !== null && data.error) {
            var error = document.createElement("span");
            error.innerHTML = data.error;
            error.style.color = "red";
            content.appendChild(error);
            content.appendChild(document.createElement("br"));
        }

        descInput = document.createElement("textarea");

        var descLabel = document.createElement("label");
        descLabel.innerHTML = "Comment:";
        descLabel.htmlFor = descInput;

        reviewInput = document.createElement("select");

        for (var i = 1; i <= 5; i++) {
            var option = document.createElement("option");
            option.innerHTML = i;
            option.value = i;
            reviewInput.appendChild(option);
        }

        var reviewLabel = document.createElement("label");
        reviewLabel.innerHTML = "Rating:";
        reviewLabel.htmlFor = reviewInput;

        fieldSet.appendChild(descLabel);
        fieldSet.appendChild(document.createElement("br"));
        fieldSet.appendChild(descInput);
        fieldSet.appendChild(document.createElement("hr"));
        fieldSet.appendChild(reviewLabel);
        fieldSet.appendChild(reviewInput);
        fieldSet.appendChild(document.createElement("hr"));

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Comment";
        submit.onclick = saveSubmitted;

        var cancel = document.createElement("input");
        cancel.type = "submit";
        cancel.value = "Cancel";
        cancel.onclick = cancelSubmitted;

        fieldSet.appendChild(submit);
        fieldSet.appendChild(document.createTextNode("  "));
        fieldSet.appendChild(cancel);

        content.appendChild(fieldSet);
    }

    pages["commentride"] = {
        name: "commentride",
        render: renderPage
    }
})();