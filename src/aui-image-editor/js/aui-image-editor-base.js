/**
 * A Base for different ImageEditor implementations
 *
 * @module aui-image-editor
 * @submodule aui-image-editor-base
 */

var Lang = A.Lang,

    _NAME = 'image-editor-base',

    IMAGE_NODE_SELECTOR = 'img',

    IMAGE_TYPE_JPEG = 'image/jpeg',
    IMAGE_TYPE_PNG = 'image/png',

    REGEXP_IMAGE_EXT = /\.([^.]*)$/,
    REGEXP_JPG_IMAGE_EXT = /jpe?g$/i,

    STR_IMAGE_NODE = 'imageNode',
    STR_IMAGE_TYPE = 'imageType',
    STR_UNDO = 'undo',

    UNDO_DEPENDENCIES = ['aui-undo-redo', 'aui-image-editor-action'],

    ImageEditorBase = function() {};

/**
 * Base class for ImageEditor.
 *
 * @class A.ImageEditorBase
 */
ImageEditorBase.prototype = {

    /**
     * Construction logic executed during ImageEditorBase instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    _initEditorBase: function() {
        var instance = this,
            imageExtension,
            imageNode,
            imageSrc,
            imageType,
            srcNode,
            undo;

        srcNode = instance.get('srcNode');

        srcNode.addClass('yui3-image-editor');

        undo = instance.get(STR_UNDO);

        if (undo && undo.enabled) {
            A.use(UNDO_DEPENDENCIES, A.bind('_createUndoManager', instance, undo));
        }

        imageNode = instance.get(STR_IMAGE_NODE);

        if (!imageNode) {
            imageNode = srcNode.one(IMAGE_NODE_SELECTOR);

            instance.set(STR_IMAGE_NODE, imageNode);
        }

        imageType = instance.get(STR_IMAGE_TYPE);

        if (!imageType) {
            imageSrc = imageNode.get('src');
            imageType = IMAGE_TYPE_PNG;

            if (REGEXP_IMAGE_EXT.test(imageSrc)) {
                imageExtension = REGEXP_IMAGE_EXT.exec(imageSrc)[1];

                if(REGEXP_JPG_IMAGE_EXT.test(imageExtension)) {
                    imageType = IMAGE_TYPE_JPEG;
                }
            }

            instance.set(STR_IMAGE_TYPE, imageType);
        }
    },

    /**
     * Discards any unsaved changes on the editor.
     *
     * @method clear
     */

    /**
     * Obtains a representation of the current image on the editor,
     * including unsaved changes.
     *
     * @method getImage
     * @return {Object} An Object representing the current state. The type
     * of object depends on the editor's implementation.
     */

    /**
     * Obtains a data:URL with a representation of the current image on the
     * editor, including unsaved changes.
     *
     * @method getImageData
     * @return {String} A data:URL with a representation of the image.
     */

    /**
     * Runs a processing action over the current state of the image in the editor.
     *
     * @method process
     * @param {A.ImageFilterBase|Object} processor The processor object to apply.
     * @param {Object} cfg Additional config parameters for the processor.
     * @param {Function} callback Callback for processing complete.
     */

    /**
     * Puts an image on the editor.
     *
     * @method putImage
     * @param {Object} imageData An Object representing the image to set
     * inside the editor. The type of object depends on the editor's
     * implementation.
     * @param {Number} offsetX Horizontal offset.
     * @param {Number} offsetY Vertical offset.
     */

    /**
     * Resets the editor state discarding all the applied changes.
     *
     * @method reset
     */

    /**
     * Saves the current changes.
     *
     * @method save
     */

    /**
     * Initializes the UndoManager once it's been loaded.
     *
     * @method _createUndoManager
     * @private
     * @param {Object} config ImageEditor undo configuration settings.
     */
    _createUndoManager: function(config) {
        var instance = this;

        instance._undoManager = new A.UndoRedo(
            {
                limit: config.limit
            }
        );
    },

    /**
     * Fires a state change event.
     *
     * @method _notifyStateChange
     * @protected
     * @param  {String} state The state change.
     * @param  {Object} prevVal Image data before the change.
     * @param  {Object} newVal Image data after the change.
     */
    _notifyStateChange: function(state, prevVal, newVal) {
        var instance = this,
            eventName;

        eventName = 'imageProcessor:' + state;

        instance.fire(
           eventName,
           {
               newVal: newVal,
               prevVal: prevVal
           }
        );

        if (instance._undoManager && state === 'save') {
            instance._undoManager.add(
                new A.ImageEditorAction(
                    {
                        editor: instance,
                        newVal: newVal,
                        prevVal: prevVal
                    }
                )
            );
        }
    },

    undo: function() {
        var instance = this;

        if (instance._undoManager) {
            instance._undoManager.undo();
        }
    },

    redo: function() {
        var instance = this;

        if (instance._undoManager) {
            instance._undoManager.redo();
        }
    }

};

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
ImageEditorBase.NAME = _NAME;

/**
 * Static property used to define the default attribute
 * configuration for the ImageEditorBase.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
ImageEditorBase.ATTRS = {

    /**
     * MIME type of the image. If not defined, the editor will try to
     * guess based on the image source url.
     * @type {String}
     */
    imageNode: {
        setter: A.one
    },

    /**
     * MIME type of the image. If not defined, the editor will try to
     * guess based on the image source url.
     * @type {String}
     */
    imageType: {
        validator: Lang.isString
    },

    /**
     * [srcNode description]
     * @type {Object}
     */
    srcNode: {
        setter: A.one
    },

    /**
     * Undo configuration for the image editor. By default, undo is
     * enabled with unlimited number of levels.
     * @type {Object}
     */
    undo: {
        validator: Lang.isObject,
        value: {
            enabled: true,
            limit: 0
        }
    }
};

A.ImageEditorBase = ImageEditorBase;
