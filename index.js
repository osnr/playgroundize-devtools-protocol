require.config({ paths: { 'vs': __vsPath }});
require(['vs/editor/editor.main'], function() {
  function makeEditor(details) {
    var editor = monaco.editor.create(details, {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      language: 'javascript'
    });
    details.addEventListener('keydown', e => {
      e.stopPropagation();
    });
  }

  [...document.getElementsByClassName('details')].forEach(makeEditor);
});
