(function () {

    var page = "login";
    var pageData = null;

    var hash = window.location.hash;

    if (hash) {
        page = hash.substring(1);
    }

    reRenderPage();

    function reRenderPage() {
        $("#content").empty();
        pages[page].render(pageData);
    }

    document.changePage = function (newPage, data) {

        if (data === undefined) {
            data = null;
        }

        page = newPage;
        pageData = data;
        window.location.hash = "#" + page;
        reRenderPage();
    }

    window.onhashchange = function () {
        var hash = window.location.hash;

        if (hash) {
            page = hash.substring(1);
        }

        reRenderPage();
    }
})();