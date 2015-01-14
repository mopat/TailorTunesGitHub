/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchField = null,
        $searchButton = null,
        $picker = null,
        $artistDropdownBox = null,
        $trackDropwdownBox = null,
        $genreDropdownBox = null,
        $searchDropdown = null,
        $searchIcon = null,
        mode = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $picker = $(".picker");
            $searchDropdown = $(".search-dropdown");

            $artistDropdownBox = $("#artist-dropdown-box");
            $trackDropwdownBox = $("#track-dropdown-box");
            $genreDropdownBox = $("#genre-dropdown-box");
            $searchIcon = $("#search-icon");

            mode = "artist";

            $searchField.keydown(handleSubmitForm);
            $searchField.on("click", handleSearchFieldClick);
            $searchField.select();

            $searchButton.on("click", handleSearch);
            $picker.on("click", handleTabClicked);

            $trackDropwdownBox.on("change", handleTrackDropdownChange);

            $searchIcon.on("click", function () {
                $("#options-box").slideUp(500);
                $("#search-form").slideDown(500);
                $searchField.focus();
                $searchField.on("focusout", function () {
                    $("body").on("click", function (e) {
                        if ($(e.target).attr("class") != "search-dropdown" && $(e.target).attr("id") != $searchField.attr("id") && $(e.target).hasClass("picker") == false) {
                            $("#options-box").slideDown(500);
                            $("#search-form").slideUp(500);
                        }
                    });
                });
                $("body").off("click");
            });
        },

        handleSearch = function () {
            var option = getVisibleDropdownValue();
            var query = $searchField.val();
            if (option == "simple")
                $(that).trigger("searchButtonClickedSoundcloud", [query]);
            else if (mode == "track" && option == "similar") {
                $(that).trigger("searchEchoNestSimilarTracks", [query]);
            }
            else
                $(that).trigger("searchButtonClickedEchoNest", [query, mode, option, null]);
        },

        handleSubmitForm = function (e) {
            if (e.keyCode == 13) {
                handleSearch();
            }
        },

        handleTabClicked = function (e) {
            resetDropdowns();
            $(".picked").switchClass("picked", "unpicked", 0);
            $(e.target).closest(".picker").switchClass("unpicked", "picked", 0);
            var tabId = $(this).attr("id");
            setMode(tabId);
            $searchField.focus().select();
        },

        setMode = function (tabId) {
            switch (tabId) {
                case "artist-tab":
                    artistMode();
                    break;
                case "track-tab":
                    trackMode();
                    break;
                case "genre-tab":
                    genreMode();
                    break;
            }
        },

        artistMode = function () {
            $artistDropdownBox.show();

            $trackDropwdownBox.hide();
            $genreDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "artist";
        },

        trackMode = function () {
            $trackDropwdownBox.show();

            $artistDropdownBox.hide();
            $genreDropdownBox.hide();
            if (getVisibleDropdownValue() == "hottest") {
                $searchField.attr('disabled', 'disabled');
            }
            else {
                $searchField.removeAttr('disabled');
            }
            mode = "track";
        },

        genreMode = function () {
            $genreDropdownBox.show();

            $trackDropwdownBox.hide();
            $artistDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "genre";
        },

        getVisibleDropdownValue = function(){
            var visibleDropdownValue = "";
            $searchDropdown.each(function( index ) {
                if($(this).is(":visible")){
                    visibleDropdownValue = $(this).val();
                }
            });
            return visibleDropdownValue;
        },

        handleTrackDropdownChange = function () {
            if ($(this).val() == "hottest") {
                $searchField.attr('disabled', 'disabled');
            }
            else {
                $searchField.removeAttr('disabled');
            }
        },

        resetDropdowns = function(){
            $searchDropdown.each(function() {
                $(this).find('option:first').prop('selected', 'selected');
            });
        },

        scrollToSearchField = function () {
            $('html, body').animate({
                scrollTop: $searchField.offset().top
            }, 500);
            $searchField.focus().select();
        },

        handleSearchFieldClick = function () {
            $searchField.select();
        };

    that.scrollToSearchField = scrollToSearchField;
    that.init = init;

    return that;

}());
