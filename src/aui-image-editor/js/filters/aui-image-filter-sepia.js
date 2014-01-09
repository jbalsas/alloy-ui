var _NAME = 'image-sepia-filter',

    MATRIX = [
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 0
    ],

    /**
     * A matrix-color-based sepia filter.
     *
     * @class A.ImageSepiaFilter
     * @extends A.ImageColorFilter
     * @constructor
     */
    ImageSepiaFilter = A.Base.create(_NAME, A.ImageColorFilter, [], {

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
                value: 'Sepia'
            },

            matrix: {
                readOnly: true,
                value: MATRIX
            }
        }
    });

A.ImageSepiaFilter = ImageSepiaFilter;