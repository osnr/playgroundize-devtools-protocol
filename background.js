function buildWrappersForIndex(target, index) {
  for (let method of Object.values(index).map(x => x.keyword).filter(x => x)) {
    const [domain, methodName] = method.split('.');
    if (!(window[domain])) { window[domain] = {}; }
    window[domain][methodName] = async function(args) {
      return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(target, method, args, result => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(result);
        });
      });
    }
  }
}

chrome.runtime.onMessageExternal.addListener(
  async function(request, sender, sendResponse) {
    const result = await (eval(`(async function() { ${request} })`))();
    sendResponse(result);
  });
