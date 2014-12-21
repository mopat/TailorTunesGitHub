/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchField = null,
        $yearSliderBox = null,
        $yearSlider = null,
        $searchButton = null,
        $picker = null,
        $hottestSwitchBox = null,
        $similarSwitchBox = null,
        $yearSwitchBox = null,
        $newSwitchBox = null,
        $hottestSwitch = null,
        $similarSwitch = null,
        $yearSwitch = null,
        $newSwitch = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $yearSliderBox = $("#year-slider-box");
            $yearSlider = $("#year-slider");
            $picker = $(".picker");
            $hottestSwitchBox = $("#hottest-switch-box");
            $similarSwitchBox = $("#similar-switch-box");
            $yearSwitchBox = $("#year-switch-box");
            $newSwitchBox = $("#new-tracks-switch-box");
            $hottestSwitch = $("#hottest-switch");
            $similarSwitch = $("#similar-switch");
            $yearSwitch = $("#year-switch");
            $newSwitch = $("#new-tracks-switch");

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
            $yearSlider.Link('lower').to($('#year-slider-value-lower'));
            $yearSlider.Link('upper').to($('#year-slider-value-upper'));
        },

        handleSearchClick = function () {
            $(that).trigger("searchButtonClicked", [$searchField.val(), $('#year-slider-value-lower').html(), $('#year-slider-value-upper').html(), $(".picked").attr("id")]);
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
            $hottestSwitchBox.show();
            $yearSliderBox.show();
            $similarSwitchBox.show();
            $newSwitchBox.show();
            $yearSwitchBox.show();
        },

        trackMode = function () {
            $hottestSwitchBox.hide();
            $yearSliderBox.hide();
            $newSwitchBox.hide();
            $yearSwitchBox.hide();
            $similarSwitchBox.show();
        },

        genreMode = function () {
            $hottestSwitchBox.show();
            $yearSliderBox.show();
            $newSwitchBox.show();
            $yearSwitchBox.show();
            $similarSwitchBox.hide();
        };


    that.init = init;

    return that;

}());
