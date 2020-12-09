async function runInBackgroundScript(code) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(__extensionId, code, {}, response => {
      resolve(response);
    });
  });
}

const indexEl = document.querySelector("[protocol-search-index]");
window.fetch(indexEl.getAttribute("base-url") + indexEl.getAttribute("protocol-search-index")).then(async r => {
  const index = await r.text();
  runInBackgroundScript(`buildWrappersForIndex({tabId: sender.tab.id}, ${index})`);
});

runInBackgroundScript(`
  chrome.debugger.detach({tabId: sender.tab.id});
  chrome.debugger.attach(
    {tabId: sender.tab.id}, "1.3",
    function() { if (chrome.runtime.lastError) console.log(chrome.runtime.lastError); }
  );
`);

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
    const parent = document.createElement('div');
    parent.style.width = '50%';
    parent.style.float = 'right';

    const run = document.createElement('button');
    run.innerText = 'Run';
    parent.appendChild(run);

    const container = document.createElement('div');
    container.style.height = '200px';
    container.style.width = '100%';
    parent.appendChild(container);

    details.prepend(parent);

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
    run.addEventListener('click', async e => {
      console.log(await runInBackgroundScript(editor.getValue()));
    });
  }

  [...document.getElementsByClassName('details')].forEach(makeEditor);
});
