require.config({ paths: { 'vs': __vsPath }});
require(['vs/editor/editor.main'], function() {
  var editor = monaco.editor.create(document.getElementsByClassName('details')[0], {
    value: [
      'function x() {',
      '\tconsole.log("Hello world!");',
      '}'
    ].join('\n'),
    language: 'javascript'
  });
  editor.onKeyDown(function(e) {

  });
});
