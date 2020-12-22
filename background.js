chrome.runtime.onMessageExternal.addListener(
  async function(request, sender, sendResponse) {
    try {
      const result = await (eval(`(async function() { ${request} })`))();
      sendResponse({result});
    } catch (err) {
      sendResponse({err});
    }
  });

chrome.runtime.onConnectExternal.addListener(port => {
  chrome.debugger.onEvent.addListener((source, method, params) => {
    console.log(source, method, params);
    port.postMessage({source, method, params});
  });
});
