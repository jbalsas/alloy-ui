var _NAME  = 'image-grayscale-filter',

    MATRIX = [
        0.2225, 0.7169, 0.0606, 0, 0,
        0.2225, 0.7169, 0.0606, 0, 0,
        0.2225, 0.7169, 0.0606, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 0
    ],

    /**
     * A matrix-color-based grayscale filter.
     *
     * @class A.ImageGrayscaleFilter
     * @extends A.ImageColorFilter
     * @constructor
     */
    ImageGrayscaleFilter = A.Base.create(_NAME, A.ImageColorFilter, [], {

    }, {

        /**
         * Static property used to define the default attribute
         * configuration for the Filter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {
            label: {
                value: 'Grayscale'
            },

            matrix: {
                readOnly: true,
                value: MATRIX
            }
        }
    });

A.ImageGrayscaleFilter = ImageGrayscaleFilter;