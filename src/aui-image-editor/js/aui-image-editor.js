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

    PROCESSORS_NODE_SELECTOR = '.image-editor-processors',
    TOOLBAR_NODE_SELECTOR = '.toolbar',
    TRIGGER_NODE_SELECTOR = '.image-editor-trigger',

    STR_CLEAR = 'clear',
    STR_CLICK = 'click',
    STR_PROCESSORS = 'processors',
    STR_PROCESSORS_NODE = 'processorsNode',
    STR_REDO = 'redo',
    STR_RESET = 'reset',
    STR_SAVE = 'save',
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

        PROCESSORS_NODE_TPL: '<div class="image-editor-processors">' +
            '<div class="image-processor-widgets"></div>' +
            '<div class="image-processor-toolbar toolbar"></div>' +
            '<div class="image-processor-status row">' +
                '<button class="btn btn-default btn-cancel col-md-1"><span class="glyphicon glyphicon-remove"></span></button>' +
                '<div class="col-md-10 image-processor-info"></div>' +
                '<button class="btn btn-default btn-ok col-md-1"><span class="glyphicon glyphicon-ok"></span></button>'+
            '</div>' +
            '</div>',

        PROCESSOR_WIDGET_WRAPPER_TPL: '<div class="{cssClass}"></div>',

        TOOLBAR_NODE_TPL: '<div class="toolbar image-editor-toolbar hide">' +
            '<div class="btn-group">' +
                '<button class="btn btn-default" data-action="undo"><span class="glyphicon glyphicon-arrow-left"></span></button>' +
                '<button class="btn btn-default" data-action="redo"><span class="glyphicon glyphicon-arrow-right"></span></button>' +
            '</div>' +
            '<div class="btn-group">' +
                '<button class="btn btn-default" data-action="adjust"><span class="glyphicon glyphicon-adjust"></span></button>' +
                '<button class="btn btn-default" data-action="filters"><span class="glyphicon glyphicon-picture"></span></button>' +
                '<button class="btn btn-default" data-action="scale"><span class="glyphicon glyphicon-resize-small"></span></button>' +
            '</div>' +
            '</div>',

        TRIGGER_NODE_TPL: '<button class="btn btn-default image-editor-trigger image-editor-trigger-default">' +
            '<span class="glyphicon glyphicon-edit"></span>' +
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
                toolbar,
                toolbarNode,
                triggerNode;

            triggerNode = instance.get(STR_TRIGGER_NODE);

            if (!triggerNode) {
                triggerNode = instance._createTriggerNode();
            }

            toolbarNode = instance.get(STR_TOOLBAR_NODE);

            if (!toolbarNode) {
                toolbarNode = instance._createToolbarNode();
            }
            else {
                toolbar = instance._renderToolbar(toolbarNode);
            }

            processorsNode = instance.get(STR_PROCESSORS_NODE);

            if (!processorsNode) {
                processorsNode = instance._createProcessorsNode();
            }

            instance._processorsNode = processorsNode;
            instance._processorStatusNode = processorsNode.one('.image-processor-status');
            instance._processorInfo = instance._processorStatusNode.one('.image-processor-info');
            instance._processorToolbarNode = processorsNode.one('.image-processor-toolbar');
            instance._processorWidgetsNode = processorsNode.one('.image-processor-widgets');
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
                clearButton,
                eventHandles,
                saveButton;

            eventHandles = [
                A.Do.after(instance._resetUI, instance, STR_CLEAR, instance),
                A.Do.after(instance._resetUI, instance, STR_SAVE, instance)
            ];

            eventHandles.push(instance._triggerNode.on(STR_CLICK, A.bind('_showControls', instance)));

            saveButton = instance._processorsNode.one('.btn-ok');

            if (saveButton) {
                eventHandles.push(saveButton.on(STR_CLICK, A.bind(STR_SAVE, instance)));
            }

            clearButton = instance._processorsNode.one('.btn-cancel');

            if (clearButton) {
                eventHandles.push(clearButton.on(STR_CLICK, A.bind(STR_CLEAR, instance)));
            }

            if (instance._toolbar) {
                eventHandles.push(instance._bindToolbarUI());
            }

            instance._eventHandles = eventHandles;
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
         * Binds the toolbar buttons with the available actions.
         *
         * @method _bindToolbarUI
         * @private
         * @return {EventHandle} The toolbar event handle.
         */
        _bindToolbarUI: function() {
            var instance = this,
                eventHandle;

            eventHandle = instance._toolbarNode.delegate(
                STR_CLICK,
                function(event) {
                    action = instance._actions[event.currentTarget.getAttribute('data-action')];

                    if (Lang.isFunction(action)) {
                        action();
                    }
                },
                'button'
            );

            return eventHandle;
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

            wrapper = instance._processorWidgetsNode.appendChild(
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
                },
                'scale': {
                    'mirror-x': new A.ImageScaleFilter({scaleX: -1}),
                    'mirror-y': new A.ImageScaleFilter({scaleY: -1})
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

            wrapper = instance._processorWidgetsNode.one('.' + cssClass);

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
            instance._toolbar.hide();
            instance._triggerNode.hide();

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

            instance._processorStatusNode.show();
            instance._processorWidgetsNode.show();
            instance._processorToolbarNode.hide();

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

            if (instance._processorStatusNode) {
                instance._processorStatusNode.hide();
            }

            if (instance._processorWidgetsNode) {
                instance._processorWidgetsNode.hide();
            }

            instance._triggerNode.show();
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

            if (!instance._toolbar) {
                instance._toolbar = instance._renderToolbar(instance._toolbarNode);
                instance._eventHandles.push(instance._bindToolbarUI());
            }

            instance._toolbar.show();
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
