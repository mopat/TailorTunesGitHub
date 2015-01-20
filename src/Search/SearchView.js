/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchForm = null,
        $searchField = null,
        $searchButton = null,
        $picker = null,
        $artistDropdownBox = null,
        $trackDropdownBox = null,
        $genreDropdownBox = null,
        $searchDropdown = null,
        $searchIcon = null,
        $optionsBox = null,
        mode = null,

        init = function () {
            $searchForm = $("#search-form");
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $picker = $(".picker");
            $searchDropdown = $(".search-dropdown");
            $optionsBox = $("#options-box");

            $artistDropdownBox = $("#artist-dropdown-box");
            $trackDropdownBox = $("#track-dropdown-box");
            $genreDropdownBox = $("#genre-dropdown-box");
            $searchIcon = $("#search-icon");

            mode = "artist";

            initHandler();
            openSearchOnEmpty();

            return that;
        },

        initHandler = function () {
            $searchField.keydown(handleSubmitForm);
            $searchField.on("click", handleSearchFieldClick);
            $searchField.select();

            $searchButton.on("click", handleSearch);
            $picker.on("click", handleTabClicked);

            $trackDropdownBox.on("change", handleTrackDropdownChange);

            $searchIcon.on("click", function () {
                searchFieldFocusIn();
                $searchField.on("focusout", function () {
                    $("body").on("click", function (e) {
                        var target = $(e.target);
                        if (needFocusOut(target)) {
                            searchFieldFocusOut();
                            $("body").off("click");
                        }
                        else {
                            $("body").off("click");
                        }
                    });
                });

            });
        },

        searchFieldFocusIn = function () {
            $optionsBox.slideUp(500);
            $searchForm.slideDown(500, function () {
                $(that).trigger("searchIconFocusIn");
            });
            $searchField.focus();
        },

        searchFieldFocusOut = function () {
            $optionsBox.slideDown(500);
            $searchForm.slideUp(500, function () {
                $(that).trigger("searchIconFocusOut");
            });
        },

        openSearchOnEmpty = function () {
            searchFieldFocusIn();
            $("body").on("click", function (e) {
                var target = $(e.target);
                if (needFocusOut(target)) {
                    searchFieldFocusOut();
                    $("body").off("click");
                }
                else {
                    $("body").off("click");
                }
            });
        },

        needFocusOut = function (target) {
            if (target.attr("class") != "search-dropdown" && target.attr("id") != $searchField.attr("id") && target.hasClass("picker") == false)
                return true;
            else return false;
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

            $trackDropdownBox.hide();
            $genreDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "artist";
        },

        trackMode = function () {
            $trackDropdownBox.show();

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

            $trackDropdownBox.hide();
            $artistDropdownBox.hide();
            $searchField.removeAttr('disabled');

            mode = "genre";
        },

        getVisibleDropdownValue = function () {
            var visibleDropdownValue = "";
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
