function(A) {
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
}
