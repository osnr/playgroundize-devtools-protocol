require.config({ paths: { 'vs': __monacoBaseUrl + 'vs' }});


// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
// the default worker url location (used when creating WebWorkers). The problem here is that
// HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
// a web worker through a same-domain script
window.MonacoEnvironment = {
  getWorkerUrl: function(workerId, label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
    self.MonacoEnvironment = {
      baseUrl: '${__monacoBaseUrl}'
    };
    importScripts('${__monacoBaseUrl}vs/base/worker/workerMain.js');`
      )}`;
  }
};

require(['vs/editor/editor.main'], function() {
  function makeEditor(details) {
    const container = document.createElement('div');
    container.style.height = '200px';
    details.appendChild(container);

    var editor = monaco.editor.create(container, {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      language: 'javascript',
      scrollbar: { handleMouseWheel: false },
      scrollBeyondLastLine: false
    });
    details.addEventListener('keydown', e => {
      e.stopPropagation();
    });
  }

  [...document.getElementsByClassName('details')].forEach(makeEditor);
});
