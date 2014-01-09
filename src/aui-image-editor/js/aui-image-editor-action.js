/**
 * An undoable action for image processing.
 *
 * @module aui-image-editor-action
 */

var _NAME = 'ImageEditorAction',

    STR_EDITOR = 'editor',
    STR_NEW_VAL = 'newVal',
    STR_PREV_VAL = 'prevVal',

    /**
     * An undoable action for image processing.
     *
     * @class A.ImageEditorAction
     * @extends A.UndoableAction
     * @param {Object} config Object literal specifying widget configuration
     *     properties.
     * @constructor
     */
    ImageEditorAction = A.Base.create(_NAME, A.Base, [],
    {
        /**
         * Construction logic executed during ImageEditorAction
         * instantiation. Lifecycle.
         *
         * @protected
         */
        initializer: function() {},

        /**
         * Redo implementation for image processing actions.
         *
         * @method redo
         */
        redo: function() {
            var instance = this,
                editor = instance.get(STR_EDITOR),
                newVal = instance.get(STR_NEW_VAL);

            if (editor.putImage) {
                editor.putImage(newVal);
            }
        },

        /**
         * Undo implementation for image processing actions.
         *
         * @method undo
         */
        undo: function() {
            var instance = this,
                editor = instance.get(STR_EDITOR),
                prevVal = instance.get(STR_PREV_VAL);

            if (editor.putImage) {
                editor.putImage(prevVal);
            }
        }
    }, {
        ATTRS: {

            /**
             * The ImageEditor working with the image.
             * @type {A.ImageEditorBase}
             */
            editor: {},

            /**
             * The new image resulting of the image filter application. Datatype
             * depend on the editor implementation. Default ones are
             * {ImageData} for the canvas implementation and {String} for the
             * flash implementation.
             * @type {Object}
             */
            newVal: {},

            /**
             * The image previous to the image filter application. Datatype
             * depend on the editor implementation. Default ones are
             * {ImageData} for the canvas implementation and {String} for the
             * flash implementation.
             * @type {Object}
             */
            prevVal: {}
        }
    });

A.ImageEditorAction = ImageEditorAction;