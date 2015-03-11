/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchForm = null,
        $searchField = null,
        $searchButton = null,
        $closeSearchButton = null,
        $picker = null,
        $artistDropdownBox = null,
        $trackDropdownBox = null,
        $genreDropdownBox = null,
        $searchDropdown = null,
        $searchIcon = null,
        $maxResults = null,
        $maxResultsValue = null,
        mode = null,

        init = function () {
            $searchForm = $("#search-form");
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $closeSearchButton = $("#close-search-button");
            $picker = $(".picker");
            $searchDropdown = $(".search-dropdown");
            $maxResults = $("#max-results");
            $artistDropdownBox = $("#artist-dropdown-box");
            $trackDropdownBox = $("#track-dropdown-box");
            $genreDropdownBox = $("#genre-dropdown-box");
            $searchIcon = $("#search-icon");
            $maxResultsValue = $("#max-results-value");

            mode = "artist";

            $searchField.select();

            initHandler();

            $(document).ready(function(){
                searchFieldFocusIn();
            });

            return that;
        },

        initHandler = function () {
            $searchField.keydown(handleSubmitForm);
            $searchField.on("click", handleSearchFieldClick);

            $searchButton.on("click", handleSearch);
            $closeSearchButton.on("click", handleCloseSearch);
            $picker.on("click", handleTabClicked);

            $trackDropdownBox.on("change", handleTrackDropdownChange);

            $searchIcon.on("click", function () {
                searchFieldFocusIn();
            });

            $maxResults.on("mousemove touchmove", function(){
                $(this).attr("value", $(this).val())
                $maxResultsValue.html($(this).val());
            })
        },

        searchFieldFocusIn = function () {
            $searchForm.fadeIn(500);
            $(that).trigger("searchIconFocusIn");
            $searchField.focus();
        },

        searchFieldFocusOut = function () {
            $searchForm.hide();
            $(that).trigger("searchIconFocusOut");
            $searchField.focusout();
        },

        handleSearch = function () {
            var srchObj = {};
            $searchDropdown.each(function (index) {
                if ($(this).is(":visible")) {

                    srchObj = createSrchObj($searchField.val(), $(this).attr("data-type"), $(this).val(), null, $("option:selected", this).attr("data-api"), $maxResults.val());
                }
                console.log(srchObj)
            });
            if (srchObj.dataApi == "echonest") {
                if (srchObj.type == "track" && srchObj.option == "similar")
                    $(that).trigger("searchEchoNestSimilarTracks", [srchObj]);
                else
                    $(that).trigger("searchButtonClickedEchoNest", [srchObj]);
            }
            else
                $(that).trigger("searchButtonClickedSoundcloud", [srchObj]);

            searchFieldFocusOut();
        },


        handleCloseSearch = function () {
            searchFieldFocusOut();
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

            $trackDropdownBox.hide();
            $genreDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "artist";
        },

        trackMode = function () {
            $trackDropdownBox.show();

            $artistDropdownBox.hide();
            $genreDropdownBox.hide();
            if (getSelectedDropdownValue() == "hottest") {
                $searchField.attr('disabled', 'disabled');
            }
            else {
                $searchField.removeAttr('disabled');
            }
            mode = "track";
        },

        genreMode = function () {
            $genreDropdownBox.show();

            $trackDropdownBox.hide();
            $artistDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "genre";
        },

        getSelectedDropdownValue = function () {
            var visibleDropdownValue = null;
            $searchDropdown.each(function (index) {
                if ($(this).is(":visible")) {
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

        resetDropdowns = function () {
            $searchDropdown.each(function () {
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
