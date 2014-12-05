/* This file is auto-generated by (yogi loader --yes --mix --js js/aui-loader.js --json js/aui-loader.json --start ../) */
/*jshint maxlen:900, eqeqeq: false */
var add = Y.Features.add;
// aui-base-html5-shiv
add('load', '0', {
    "name": "aui-base-html5-shiv",
    "trigger": "node-base",
    "ua": "ie"
});
// aui-carousel-mobile-touch
add('load', '1', {
    "name": "aui-carousel-mobile-touch",
    "test": function(A) {
    return A.UA.mobile && A.UA.touchEnabled;
},
    "trigger": "aui-carousel"
});
// aui-carousel-swipe
add('load', '2', {
    "name": "aui-carousel-swipe",
    "trigger": "aui-carousel",
    "ua": "touchEnabled"
});
// aui-event-delegate-change
add('load', '3', {
    "name": "aui-event-delegate-change",
    "trigger": "event-base-ie",
    "ua": "ie"
});
// aui-event-delegate-submit
add('load', '4', {
    "name": "aui-event-delegate-submit",
    "trigger": "event-base-ie",
    "ua": "ie"
});
// aui-event-input
add('load', '5', {
    "name": "aui-event-input",
    "test": function(A) {
    var supportsDOMEvent = A.supportsDOMEvent,
        testFeature = A.Features.test,
        addFeature = A.Features.add;

    if (testFeature('event', 'input') === undefined) {
        addFeature('event', 'input', {
            test: function() {
                return supportsDOMEvent(document.createElement('textarea'), 'input') && (!A.UA.ie || A.UA.ie > 9);
            }
        });
    }

    return !testFeature('event', 'input');
},
    "trigger": "aui-event-base"
});
// aui-image-editor-canvas
add('load', '6', {
    "name": "aui-image-editor-canvas",
    "test": function(A) {
    var DOCUMENT = A.config.doc,
        testFeature = A.Features.test,
        addFeature = A.Features.add;

    if (testFeature('supports', 'canvas') === undefined) {
        addFeature('supports', 'canvas', {
            test: function() {
                var canvas = DOCUMENT && DOCUMENT.createElement('canvas'),
                    useFlash = Y.config.defaultImageEditorEngine && Y.config.defaultImageEditorEngine == 'flash';

                return !useFlash && (canvas && canvas.getContext && canvas.getContext('2d'));
            }
        });
    }

    return testFeature('supports', 'canvas');
},
    "trigger": "aui-image-editor-base"
});
// aui-image-editor-canvas-default
add('load', '7', {
    "name": "aui-image-editor-canvas-default",
    "test": function(A) {
    var DOCUMENT = A.config.doc,
        testFeature = A.Features.test,
        addFeature = A.Features.add;

    if (testFeature('supports', 'canvas') === undefined) {
        addFeature('supports', 'canvas', {
            test: function() {
                var canvas = DOCUMENT && DOCUMENT.createElement('canvas'),
                    useFlash = Y.config.defaultImageEditorEngine && Y.config.defaultImageEditorEngine == 'flash';

                return !useFlash && (canvas && canvas.getContext && canvas.getContext('2d'));
            }
        });
    }

    return testFeature('supports', 'canvas');
},
    "trigger": "aui-image-editor-base"
});
// aui-image-editor-swf
add('load', '8', {
    "name": "aui-image-editor-swf",
    "test": function(A) {
    var DOCUMENT = A.config.doc,
        testFeature = A.Features.test,
        addFeature = A.Features.add;

    if (testFeature('notsupports', 'canvas') === undefined) {
        addFeature('notsupports', 'canvas', {
            test: function() {
                var canvas = DOCUMENT && DOCUMENT.createElement('canvas'),
                    useFlash = Y.config.defaultImageEditorEngine && Y.config.defaultImageEditorEngine == 'flash';

                return useFlash || !(canvas && canvas.getContext && canvas.getContext('2d'));
            }
        });
    }

    return testFeature('notsupports', 'canvas');
},
    "trigger": "aui-image-editor-base"
});
// aui-image-editor-swf-default
add('load', '9', {
    "name": "aui-image-editor-swf-default",
    "test": function(A) {
    var DOCUMENT = A.config.doc,
        testFeature = A.Features.test,
        addFeature = A.Features.add;

    if (testFeature('notsupports', 'canvas') === undefined) {
        addFeature('notsupports', 'canvas', {
            test: function() {
                var canvas = DOCUMENT && DOCUMENT.createElement('canvas'),
                    useFlash = Y.config.defaultImageEditorEngine && Y.config.defaultImageEditorEngine == 'flash';

                return useFlash || !(canvas && canvas.getContext && canvas.getContext('2d'));
            }
        });
    }

    return testFeature('notsupports', 'canvas');
},
    "trigger": "aui-image-editor-base"
});
// aui-image-viewer-multiple-swipe
add('load', '10', {
    "name": "aui-image-viewer-multiple-swipe",
    "trigger": "aui-image-viewer-multiple",
    "ua": "touchEnabled"
});
// aui-image-viewer-swipe
add('load', '11', {
    "name": "aui-image-viewer-swipe",
    "trigger": "aui-image-viewer-base",
    "ua": "touchEnabled"
});
// aui-modal-resize
add('load', '12', {
    "name": "aui-modal-resize",
    "test": function(A) {
    return !A.UA.mobile;
},
    "trigger": "aui-modal"
});
// aui-node-html5
add('load', '13', {
    "name": "aui-node-html5",
    "trigger": "aui-node",
    "ua": "ie"
});
// aui-scheduler-touch
add('load', '14', {
    "name": "aui-scheduler-touch",
    "trigger": "aui-scheduler",
    "ua": "touchEnabled"
});