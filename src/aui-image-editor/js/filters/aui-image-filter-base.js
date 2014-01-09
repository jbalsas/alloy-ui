/**
 * The Image Filter Base
 *
 * @module aui-image-filter-base
 */

var Lang = A.Lang,

    _NAME = 'image-filter',

    _NS = 'imageFilter',

    /**
     * Base class for image filters.
     *
     * @class A.ImageFilterBase
     */
    ImageFilterBase = A.Base.create(_NAME, A.Base, [],
    {
        /**
         * Applies the filter transformation to the given data.
         *
         * @method process
         * @param {Object} drawingContext Object with the relevant drawing
         * context information.
         * @param {Object} cfg Configuration parameters for the filter.
         */

    }, {

        /**
         * Static property provides a string to identify the class.
         *
         * @property NAME
         * @type String
         * @static
         */
        NAME: _NAME,

        /**
         * Static property provides a string to identify the namespace.
         *
         * @property NS
         * @type String
         * @static
         */
        NS: _NS,

        /**
         * Static property used to define the default attribute
         * configuration for the ImageFilter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * The image processing is asynchronous.
             *
             * @attribute async
             * @type {Boolean}
             * @default false
             */
            async: {
                validator: Lang.isBoolean,
                value: false
            },

            /**
             * The image processing works at bitmap level.
             *
             * @attribute bitmap
             * @type {Boolean}
             * @default false
             */
            bitmap: {
                validator: Lang.isBoolean,
                value: false
            },

            /**
             * The label of the filter.
             *
             * @type {String}
             * @attribute label
             * @default filter
             */
            label: {
                validator: Lang.isString,
                value: 'filter'
            },

            /**
             * Configuration for the flash fallback implementation of the
             * filter.
             *
             * @attribute swfCfg
             * @type {Object}
             */
            swfCfg: {
                readonly: true,
                value: {
                    processFn: _NS
                }
            },

            /**
             * Configuration for the filter UI generation.
             *
             * @type {Object|Function|Widget}
             */
            ui: {}
        }
    });

A.ImageFilterBase = ImageFilterBase;