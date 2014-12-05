/**
 * Created by Patrick on 04.12.2014.
 */
App.SearchView = (function () {
    var that = {},
        $searchField = null,
        $yearSlider = null,
        $searchButton = null,

        init = function () {
            $searchField = $("#search-field");
            $searchButton = $("#search-button");
            $yearSlider = $("#year-slider");

            initYearSlider();

            $searchButton.on("click", handleSearchClick);
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
            $(that).trigger("searchButtonClicked", [$searchField.val(), $('#year-slider-value-lower').html(), $('#year-slider-value-upper').html()]);
        };


    that.init = init;

    return that;

}());
