async function run(codeOrSrc) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    (document.head || document.documentElement).appendChild(s);

    if (typeof codeOrSrc === 'string') { s.text = codeOrSrc; resolve(); }
    else { s.onload = resolve; s.src = codeOrSrc.src; }
  });
}

(async function() {
  await run(` window.__extensionId = '${chrome.runtime.id}'; `);
  await run(` window.__protocolUrls = ['${chrome.runtime.getURL('vendor/js_protocol.json')}', '${chrome.runtime.getURL('vendor/browser_protocol.json')}']; `);
  await run({ src: chrome.runtime.getURL('index.js') })
})();
