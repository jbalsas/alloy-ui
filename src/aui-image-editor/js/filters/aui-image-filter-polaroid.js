var _NAME = 'image-polaroid-filter',

    MATRIX = [
        1.438, -0.122, -0.016, 0, 0.03 * 255,
        -0.062, 1.378, -0.016, 0, 0.05 * 255,
        -0.062, -0.122, 1.483, 0, -0.02 * 255,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 255
    ],

    /**
     * A matrix-color-based polaroid filter.
     *
     * @class A.ImagePolaroidFilter
     * @extends A.ImageColorFilter
     * @constructor
     */
    ImagePolaroidFilter = A.Base.create(_NAME, A.ImageColorFilter, [], {

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
                value: 'Polaroid'
            },

            matrix: {
                readOnly: true,
                value: MATRIX
            }
        }
    });

A.ImagePolaroidFilter = ImagePolaroidFilter;