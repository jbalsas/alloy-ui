/**
 * A Base for different ImageEditor implementations
 *
 * @module aui-image-editor
 * @submodule aui-image-editor-base
 */

var Lang = A.Lang,

    AObject = A.Object,

    _NAME = 'image-editor',

    BOUNDING_BOX = 'boundingBox',

    PROCESSORS_NODE_SELECTOR = '.processors',
    TOOLBAR_NODE_SELECTOR = '.toolbar',
    TRIGGER_NODE_SELECTOR = '.image-editor-trigger',

    STR_CLEAR = 'clear',
    STR_CLICK = 'click',
    STR_CLOSE = 'close',
    STR_PROCESSORS = 'processors',
    STR_PROCESSORS_NODE = 'processorsNode',
    STR_REDO = 'redo',
    STR_RESET = 'reset',
    STR_SAVE = 'save',
    STR_STATUS_NODE = 'statusNode',
    STR_TOOLBAR_NODE = 'toolbarNode',
    STR_TRIGGER_NODE = 'triggerNode',
    STR_UI = 'ui',
    STR_UNDO = 'undo',

    /**
     * Base class for ImageEditor.
     *
     * @class A.ImageEditorBase
     */
    ImageEditor = A.Base.create(_NAME, A.Widget, [A.ImageEditorBase, A.WidgetCssClass], {

        CLOSE_NODE_TPL: '<button class="btn btn-close btn-default" data-action="close">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</button>',

        PROCESSORS_NODE_TPL: '<div class="processors">' +
            '<div class="row ui">' +
                '<button class="btn btn-default btn-cancel col-md-1"><span class="glyphicon glyphicon-remove"></span></button>' +
                '<div class="col-md-10 widgets"></div>' +
                '<button class="btn btn-default btn-ok col-md-1"><span class="glyphicon glyphicon-ok"></span></button>'+
            '</div>' +
            '<div class="toolbar toolbar-processors"></div>' +
            '</div>',

        PROCESSOR_WIDGET_WRAPPER_TPL: '<div class="{cssClass}"></div>',

        STATUS_TOOLBAR_NODE_TPL: '<div class="toolbar toolbar-status">' +
            '<button class="btn btn-default" data-action="undo" disabled><span class="glyphicon glyphicon-chevron-left"></span></button>' +
            '<button class="btn btn-default" data-action="reset" disabled><span class="glyphicon glyphicon-trash"></span></button>' +
            '<button class="btn btn-default" data-action="redo" disabled><span class="glyphicon glyphicon-chevron-right"></span></button>' +
            '</div>',

        TOOLBAR_NODE_TPL: '<div class="toolbar toolbar-actions">' +
            '<div class="btn-group">' +
                '<button class="btn btn-default" data-action="adjust"><span class="glyphicon glyphicon-tasks"></span></button>' +
                '<button class="btn btn-default" data-action="filters"><span class="glyphicon glyphicon-tint"></span></button>' +
            '</div>' +
            '</div>',

        TRIGGER_NODE_TPL: '<button class="btn btn-default trigger">' +
            '<span class="glyphicon glyphicon-pencil"></span>' +
            '</button>',

        /**
         * Construction logic executed during ImageEditorBase instantiation.
         * Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this,
                processors;

            processors = instance.get(STR_PROCESSORS);

            if (!processors) {
                processors = instance._getDefaultProcessors();

                instance.set(STR_PROCESSORS, processors);
            }

            instance._actions = instance._getAvailableActions(processors);
        },

        /**
         * Render the ImageEditorBase component instance. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this,
                processorsNode,
                statusNode,
                toolbar,
                toolbarNode,
                triggerNode;

            statusNode = instance._createNode(instance.STATUS_TOOLBAR_NODE_TPL);
            closeNode = instance._createNode(instance.CLOSE_NODE_TPL);

            triggerNode = instance.get(STR_TRIGGER_NODE);

            if (!triggerNode) {
                triggerNode = instance._createTriggerNode();
            }

            toolbarNode = instance.get(STR_TOOLBAR_NODE);

            if (!toolbarNode) {
                toolbarNode = instance._createNode(instance.TOOLBAR_NODE_TPL);
            }
            else {
                toolbar = instance._renderToolbar(toolbarNode);
            }

            processorsNode = instance.get(STR_PROCESSORS_NODE);

            if (!processorsNode) {
                processorsNode = instance._createProcessorsNode();
            }

            instance._controls = [
                closeNode,
                toolbarNode,
                statusNode
            ];

            instance._processorsNode = processorsNode;
            instance._processorToolbarNode = processorsNode.one('.toolbar-processors');
            instance._processorWidgetsNode = processorsNode.one('.ui');
            instance._toolbar = toolbar;
            instance._toolbarNode = toolbarNode;
            instance._triggerNode = triggerNode;
        },

        /**
         * Bind the events on the ImageEditor UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this,
                boundingBox,
                clearButton,
                eventHandles,
                saveButton;

            boundingBox = instance.get('boundingBox');

            eventHandles = [
                A.Do.after(instance._resetUI, instance, STR_CLEAR, instance),
                A.Do.after(instance._resetUI, instance, STR_SAVE, instance),
                instance.on('imageProcessor:save', A.bind('_handleStateChange', instance)),
                instance.on('imageProcessor:reset', A.bind('_handleStateChange', instance)),
                instance.on('imageProcessor:clear', A.bind('_handleStateChange', instance)),
                instance._triggerNode.on(STR_CLICK, A.bind('_showControls', instance)),
                boundingBox.delegate(STR_CLICK, A.bind('_handleAction', instance), 'button')
            ];

            saveButton = instance._processorsNode.one('.btn-ok');

            if (saveButton) {
                eventHandles.push(saveButton.on(STR_CLICK, A.bind(STR_SAVE, instance)));
            }

            clearButton = instance._processorsNode.one('.btn-cancel');

            if (clearButton) {
                eventHandles.push(clearButton.on(STR_CLICK, A.bind(STR_CLEAR, instance)));
            }

            instance._eventHandles = eventHandles;
        },

        close: function() {
            var instance = this;

            instance.clear();

            A.Array.each(
                instance._controls,
                function(control) {
                    control.hide();
                }
            );

            instance._processorsNode.hide();

            instance._triggerNode.show();
        },

        _handleAction: function(event) {
            var instance = this,
                action;

            action = instance._actions[event.currentTarget.getAttribute('data-action')];

            if (Lang.isFunction(action)) {
                action();
            }
        },

        _handleStateChange: function(event) {
            var instance = this,
                boundingBox;

            boundingBox = instance.get('boundingBox');

            boundingBox.one('[data-action=undo]').set('disabled', !instance._undoManager.canUndo());
            boundingBox.one('[data-action=reset]').set('disabled', !instance._undoManager.canUndo());
            boundingBox.one('[data-action=redo]').set('disabled', !instance._undoManager.canRedo());
        },

        /**
         * Destructor lifecycle implementation for the `HSVPalette` class.
         * Lifecycle.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this;

            (new A.EventHandle(instance._eventHandles)).detach();
        },

        /**
         * [_createProcessorUIWrapper description]
         *
         * @method _createProcessorUIWrapper
         * @private
         * @param  {A.ImageFilterBase|Object} processor The processor object.
         * @param  {String} cssClass CSS Class for the wrapper node.
         * @return {Node} A Node wrapper for the processor's UI.
         */
        _createProcessorUIWrapper: function(processor, cssClass) {
            var instance = this,
                processorUI,
                processorUICfg,
                wrapper;

            wrapper = instance._processorWidgetsNode.one('.widgets').appendChild(
                Lang.sub(
                    instance.PROCESSOR_WIDGET_WRAPPER_TPL, {
                        cssClass: cssClass
                    }
                )
            );

            processorUICfg = A.instanceOf(processor, A.Base) ? processor.get(STR_UI) : processor.ui;

            if (Lang.isFunction(processorUICfg)) {
                processorUI = processorUICfg(wrapper, A.bind('process', instance, processor));
            }
            else if (Lang.isObject(processorUICfg)) {
                if (Lang.isFunction(processorUICfg.fn)) {
                    processorUI = new processorUICfg.fn(processorUICfg.cfg).render(wrapper);
                }
                else if (A.instanceOf(processorUICfg, A.Widget)) {
                    processorUI = processorUICfg;

                    if (!processorUI.get('rendered')) {
                        processorUI.render(wrapper);
                    }
                }
            }

            if (processorUI) {
                wrapper.setData('processorUI', processorUI);

                processorUI.on('valueChange', function(event) {
                    instance.process(processor, event.newVal);
                });
            }

            return wrapper;
        },

        /**
         * Creates and appends a tpl-based UI node.
         *
         * @method _createNode
         * @private
         * @return {Node} Node for an Editor's UI fragment.
         */
        _createNode: function(tpl) {
            var instance = this,
                node;

            node = A.Node.create(tpl);

            node.hide();

            instance.get('boundingBox').append(node);

            return node;
        },

        /**
         * Creates the processors UI node.
         *
         * @method _createTriggerNode
         * @private
         * @return {Node} Node for the Editor's processors UI.
         */
        _createProcessorsNode: function() {
            var instance = this,
                processorsNode;

            processorsNode = A.Node.create(instance.PROCESSORS_NODE_TPL);

            instance.get(BOUNDING_BOX).append(processorsNode);

            processorsNode.hide();

            return processorsNode;
        },

        /**
         * Creates the toolbar node.
         *
         * @method _createTriggerNode
         * @private
         * @return {Node} Node for the Editor's toolbar.
         */
        _createToolbarNode: function() {
            var instance = this,
                toolbarNode;

            toolbarNode = A.Node.create(instance.TOOLBAR_NODE_TPL);

            instance.get(BOUNDING_BOX).append(toolbarNode);

            return toolbarNode;
        },

        /**
         * Creates the trigger node.
         *
         * @method _createTriggerNode
         * @private
         * @return {Node} Node for the Editor's trigger.
         */
        _createTriggerNode: function() {
            var instance = this,
                triggerNode;

            triggerNode = A.Node.create(instance.TRIGGER_NODE_TPL);

            instance.get(BOUNDING_BOX).append(triggerNode);

            return triggerNode;
        },

        /**
         * Creates a map of available actions based on the editor
         * capabilities and the instance processors configuration.
         *
         * @method _getAvailableActions
         * @private
         * @param  {Object} processors The processors configuration object.
         * @return {Object} A map exposing the available actions based on
         * the editor capabilities and the configured processors.
         */
        _getAvailableActions: function(processors) {
            var instance = this,
                actions;

            actions = {
                'clear': A.bind(STR_CLEAR, instance),
                'close': A.bind(STR_CLOSE, instance),
                'redo': A.bind(STR_REDO, instance),
                'reset': A.bind(STR_RESET, instance),
                'save': A.bind(STR_SAVE, instance),
                'undo': A.bind(STR_UNDO, instance)
            };

            AObject.each(
                processors,
                function(item, index) {
                    actions[index] = A.bind('_renderProcessorToolbar', instance, item);
                }
            );

            return actions;
        },

        /**
         * Creates the basic processors configuration.
         *
         * @method _getDefaultProcessors
         * @private
         * @return {Object} An Object with the default processor configuration.
         */
        _getDefaultProcessors: function() {
            var processors;

            processors = {
                'adjust': {
                    'brightness': new A.ImageAdjustFilter({mode: 'brightness'}),
                    'contrast': new A.ImageAdjustFilter({mode: 'contrast'}),
                    'saturation': new A.ImageAdjustFilter({mode: 'saturation'})
                },
                'filters': {
                    'grayscale': new A.ImageGrayscaleFilter(),
                    'sepia': new A.ImageSepiaFilter(),
                    'polaroid': new A.ImagePolaroidFilter(),
                    'invert': new A.ImageInvertFilter()
                }
            };

            return processors;
        },

        /**
         * Gets
         *
         * @method _getProcessorUIWrapper
         * @private
         * @param  {A.ImageFilterBase|Object} processor The processor object.
         * @param  {String} processorName Name for the given processor.
         * @return {Node} A Node wrapper for the processor's UI.
         */
        _getProcessorUIWrapper: function(processor, processorName) {
            var instance = this,
                cssClass,
                processorUI,
                wrapper;

            cssClass = 'image-processor-ui-' + processorName;

            wrapper = instance._processorWidgetsNode.one('.widgets').one('.' + cssClass);

            if (!wrapper) {
                wrapper = instance._createProcessorUIWrapper(processor, cssClass);
            }

            processorUI = wrapper.getData('processorUI');

            if (A.instanceOf(processorUI, A.Widget)) {
                processorUI.reset();

                // https://github.com/yui/yui3/issues/1537
                if (processorUI.get('length')) {
                    processorUI.reset('value');
                }
            }

            return wrapper;
        },

        /**
         * Initializes and renders the Toolbar of the ImageEditor.
         *
         * @method _renderToolbar
         * @private
         * @param {Node} toolbarNode The Node to use as the toolbar boundingBox.
         * @return {A.Toolbar} The Toolbar for the editor.
         */
        _renderToolbar: function(toolbarNode) {
            var toolbar;

            toolbar = new A.Toolbar(
                {
                    boundingBox: toolbarNode
                }
            ).render();

            return toolbar;
        },

        /**
         * Renders a toolbar for a given processors group configuration.
         *
         * @method _renderProcessorToolbar
         * @private
         * @param  {Object} processors Processor configuration.
         */
        _renderProcessorToolbar: function(processors) {
            var instance = this,
                processorButtons = [];

            instance.clear();

            instance._processorsNode.show();
            instance._processorToolbarNode.show();
            instance._triggerNode.hide();
            instance._toolbarNode.hide();

            AObject.each(
                processors,
                function(item, index) {
                    processorButtons.push({
                        cssClass: 'btn-image-processor btn-image-processor-' + index,
                        label: index,
                        on: {
                            click: A.bind('_renderProcessorUI', instance, item, index)
                        }
                    });
                }
            );

            instance._processorToolbar = new A.Toolbar(
                {
                    boundingBox: instance._processorToolbarNode,
                    children: processorButtons
                }
            ).render();
        },

        /**
         * Renders a given processor's UI.
         *
         * @method _renderProcessorUI
         * @private
         * @param  {A.ImageFilterBase|Object} processor The processor object.
         */
        _renderProcessorUI: function(processor, processorName) {
            var instance = this,
                processorUI,
                wrapper;

            if (instance._currentWrapper) {
                instance._currentWrapper.hide();
            }

            instance._processorWidgetsNode.show();

            processorUI = A.instanceOf(processor, A.Base) ? processor.get(STR_UI) : processor.ui;

            if (!processorUI) {
                instance.process(processor);
            }
            else {
                wrapper = instance._getProcessorUIWrapper(processor, processorName);

                wrapper.show();
            }

            instance._currentWrapper = wrapper;
        },

        /**
         * Restores the ImageEditor UI to the initial state.
         *
         * @method _resetUI
         * @private
         */
        _resetUI: function() {
            var instance = this;

            if (instance._processorWidgetsNode) {
                instance._processorWidgetsNode.hide();
            }

            instance._processorsNode.hide();
            instance._toolbarNode.show();
        },

        /**
         * Shows the first-level edition controls. It also creates, renders
         * and binds the toolbar if it was not already set.
         *
         * @method _showControls
         * @private
         */
        _showControls: function() {
            var instance = this;

            instance._triggerNode.hide();

            A.Array.each(
                instance._controls,
                function(control) {
                    control.show();
                }
            );

            if (!instance._toolbar) {
                //instance._toolbar = instance._renderToolbar(instance._toolbarNode);
            }

            //instance._toolbar.show();
        }
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
         * Object hash, defining how attribute values have to be parsed from
         * markup contained in the ImageEditor's content box.
         *
         * @property HTML_PARSER
         * @type Object
         * @static
         */
        HTML_PARSER: {
            processorsNode: PROCESSORS_NODE_SELECTOR,
            toolbarNode: TOOLBAR_NODE_SELECTOR,
            triggerNode: TRIGGER_NODE_SELECTOR
        },

        /**
         * Static property used to define the default attribute
         * configuration for the ImageEditorBase.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * DOM node for the processors' User Interface.
             * @type {Node}
             */
            processorsNode: {
                setter: A.one
            },

            /**
             * DOM node with the Toolbar instance of the editor.
             * @type {Node}
             */
            toolbarNode: {
                setter: A.one
            },

            /**
             * DOM node with the Trigger button of the editor.
             * @type {Node}
             */
            triggerNode: {
                setter: A.one
            }
        }
    });

A.ImageEditor = ImageEditor;
