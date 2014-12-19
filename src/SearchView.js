/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchField = null,
        $yearSlider = null,
        $searchButton = null,
        $picker = null,
        $advancedSearchBox = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $yearSlider = $("#year-slider");
            $picker = $(".picker");

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

        handleTabClicked = function(e){
            $(".picked").switchClass("picked", "unpicked", 0);
            $(e.target).closest(".picker").switchClass("unpicked", "picked");
        },

        handleSwitchClicked = function(e){
            e.preventDefault();
            $(".checked").removeAttr("checked").removeClass("checked");
            $(e.target).closest("input").attr("checked", true).addClass("checked");
        };


    that.init = init;

    return that;

}());
