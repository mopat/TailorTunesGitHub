/**
 * Created by Patrick on 04.12.2014.
 */
App.AdvancedSearchView = (function () {
    var that = {},
        yearSlider = null,

        init = function () {
            yearSlider = $("#year-slider");
            yearSlider.noUiSlider({
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
            yearSlider.Link('lower').to($('#year-slider-value-lower'));
            yearSlider.Link('upper').to($('#year-slider-value-upper'));
        };


    that.init = init;

    return that;

}());
