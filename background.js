chrome.runtime.onMessageExternal.addListener(
  async function(request, sender, sendResponse) {
    try {
      const result = await (eval(`(async function() { ${request} })`))();
      sendResponse({result});
    } catch (err) {
      sendResponse({err});
    }
  });
