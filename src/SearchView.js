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
        $genreDropwdownBox = null,
        $searchDropdown = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $picker = $(".picker");
            $searchDropdown = $(".search-dropdown");

            $artistDropdownBox = $("#artist-dropdown-box");
            $trackDropwdownBox = $("#track-dropdown-box");
            $genreDropwdownBox = $("#genre-dropdown-box");

            $searchField.keydown(handleSubmitForm);
            $searchField.on("click", handleSearchFieldClick);
            $searchField.select();

            $searchButton.on("click", handleSearch);
            $picker.on("click", handleTabClicked);

            $trackDropwdownBox.on("change", handleTrackDropdownChange);
        },

        handleSearch = function () {
           var visibleDropdownValue = getVisibleDropdownValue();
            if (visibleDropdownValue == "simple")
                $(that).trigger("searchButtonClickedSoundcloud", [$searchField.val()]);
            else
                //search Echonest
                $(that).trigger("searchButtonClickedEchoNest", [$searchField.val(), $(".picked").attr("id"), 10, 20, visibleDropdownValue]);
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
            $genreDropwdownBox.hide();
            $searchField.removeAttr('disabled');
        },

        trackMode = function () {
            $trackDropwdownBox.show();

            $artistDropdownBox.hide();
            $genreDropwdownBox.hide();
            if (getVisibleDropdownValue() == "hottest") {
                $searchField.attr('disabled', 'disabled');
            }
            else {
                $searchField.removeAttr('disabled');
            }
        },

        genreMode = function () {
            $genreDropwdownBox.show();

            $trackDropwdownBox.hide();
            $artistDropdownBox.hide();
            $searchField.removeAttr('disabled');
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
