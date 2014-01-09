var _NAME = 'image-invert-filter',

    MATRIX = [
        -1, 0, 0, 0, 255,
        0, -1, 0, 0, 255,
        0, 0, -1, 0, 255,
        0, 0, 0, 1, 0
    ],

    /**
     * A matrix-color-based invert filter.
     *
     * @class A.ImageInvertFilter
     * @extends A.ImageColorFilter
     * @constructor
     */
    ImageInvertFilter = A.Base.create(_NAME, A.ImageColorFilter, [], {

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
                value: 'Invert'
            },

            matrix: {
                readOnly: true,
                value: MATRIX
            }
        }
    });

A.ImageInvertFilter = ImageInvertFilter;