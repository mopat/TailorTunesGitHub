/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchField = null,
        $yearSliderBox = null,
        $yearSlider = null,
        $yearSliderValueLower = null,
        $yearSliderValueUpper = null,
        $searchButton = null,
        $picker = null,
        $artistDropdownBox = null,
        $trackDropwdownBox = null,
        $genreDropwdownBox = null,
        selectedDropdownValue = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $yearSliderBox = $("#year-slider-box");
            $yearSlider = $("#year-slider");
            $yearSliderValueLower = $('#year-slider-value-lower')
            $yearSliderValueUpper = $('#year-slider-value-upper')
            $picker = $(".picker");



            $artistDropdownBox = $("#artist-dropdown-box");
            $trackDropwdownBox = $("#track-dropdown-box");
            $genreDropwdownBox = $("#genre-dropdown-box");
            initYearSlider();

            $searchButton.on("click", handleSearchClick);
            $picker.on("click", handleTabClicked);

            $("#advanced-search-box .switch").on("click", handleSwitchClicked);
        },

        initYearSlider = function () {
            $yearSlider.noUiSlider({
                start: [1950, 2015],
                connect: true,
                range: {
                    'min': 1950,
                    'max': 2015
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $yearSlider.Link('lower').to($yearSliderValueLower);
            $yearSlider.Link('upper').to($yearSliderValueUpper);
        },

        handleSearchClick = function () {
           var visibleDropdownValue = getVisibleDropdownValue();
            if(visibleDropdownValue == "newest" || visibleDropdownValue == "year"){
                //search Spotify
                $(that).trigger("searchButtonClickedSpotify", [$searchField.val(), $(".picked").attr("id"), $yearSliderValueLower.html(), $yearSliderValueUpper.html(), visibleDropdownValue]);
            }
            else{
                //search Echonest
                $(that).trigger("searchButtonClickedEchoNest", [$searchField.val(), $(".picked").attr("id"), $yearSliderValueLower.html(), $yearSliderValueUpper.html(), visibleDropdownValue]);
            }
        },

        handleTabClicked = function (e) {
            $(".picked").switchClass("picked", "unpicked", 0);
            $(e.target).closest(".picker").switchClass("unpicked", "picked", 0);
            var tabId = $(this).attr("id");
            setMode(tabId);
        },

        handleSwitchClicked = function (e) {
            e.preventDefault();
            $(".checked").removeAttr("checked").removeClass("checked");
            $(e.target).closest("input").attr("checked", true).addClass("checked");
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
            $yearSliderBox.show();

            $trackDropwdownBox.hide();
            $genreDropwdownBox.hide();
        },

        trackMode = function () {
            $trackDropwdownBox.show();

            $artistDropdownBox.hide();
            $genreDropwdownBox.hide();
            $yearSliderBox.hide();
        },

        genreMode = function () {
            $genreDropwdownBox.show();
            $yearSliderBox.show();

            $trackDropwdownBox.hide();
            $artistDropdownBox.hide();
        },

        getVisibleDropdownValue = function(){
            var visibleDropdownValue = "";
            $( ".search-dropdown" ).each(function( index ) {
                if($(this).is(":visible")){
                    visibleDropdownValue = $(this).val();
                }
            });
            return visibleDropdownValue;
        };

    that.init = init;

    return that;

}());
