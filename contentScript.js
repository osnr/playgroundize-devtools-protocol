const s = document.createElement('script');
s.src = chrome.runtime.getURL('node_modules/monaco-editor/dev/vs/loader.js');
(document.head || document.documentElement).appendChild(s);

function run(code) {
  const s = document.createElement('script'); s.text = code;
  (document.head || document.documentElement).appendChild(s);
}
run(`window.__vsPath = '${chrome.runtime.getURL('node_modules/monaco-editor/dev/vs')}';`);

s.onload = function() {
  const index = document.createElement('script');
  index.src = chrome.runtime.getURL('index.js');
  (document.head || document.documentElement).appendChild(index);
};
