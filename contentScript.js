const s = document.createElement('script');
s.src = chrome.runtime.getURL('node_modules/monaco-editor/dev/vs/loader.js');
(document.head || document.documentElement).appendChild(s);

function run(code) {
  const s = document.createElement('script'); s.text = code;
  (document.head || document.documentElement).appendChild(s);
}

s.onload = function() {
  run(`
require.config({ paths: { 'vs': '${chrome.runtime.getURL('node_modules/monaco-editor/dev/vs')}' }});
    require(['vs/editor/editor.main'], function() {
        var editor = monaco.editor.create(document.getElementsByClassName('details')[0], {
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\\n'),
            language: 'javascript'
        });
    });
`);
};
