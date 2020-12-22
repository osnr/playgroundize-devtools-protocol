async function runInBackgroundScript(code) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(__extensionId, code, {}, response => {
      if (response.result) resolve(response.result); else reject(response.err);
    });
  });
}

const port = chrome.runtime.connect(__extensionId);
const handlers = {};
port.onMessage.addListener(({source, method, params}) => {
  console.log(source, method, params);
  (handlers[method] || []).forEach(fn => fn(params));
});

window.fetch(__protocolUrl).then(async r => {
  const {domains} = await r.json();
  for (let {domain, commands, events} of domains) {
    if (!(window[domain])) { window[domain] = {}; }
    
    for (let command of commands) {
      window[domain][command.name] = async function(args) {
        return runInBackgroundScript(`
        return new Promise((resolve, reject) => {
          chrome.debugger.sendCommand({tabId: sender.tab.id}, "${domain}.${command.name}",
                                      ${JSON.stringify(args || {})}, result => {
            if (chrome.runtime.lastError) { console.error(chrome.runtime.lastError); reject(chrome.runtime.lastError); }
            else resolve(result);
          });
        });
        `);
      }
    }

    if (events) for (let event of events) {
      const method = `${domain}.${event.name}`;

      window[domain][event.name] = {
        async on(fn) {
          handlers[method] = handlers[method] || [];
          handlers[method].push(fn);
        },
        async once(fn) {
          
        },
        async off(fn) {

        },
      };
    }
  }
});

runInBackgroundScript(`
  chrome.debugger.detach({tabId: sender.tab.id});
  chrome.debugger.attach(
    {tabId: sender.tab.id}, "1.3",
    function() { if (chrome.runtime.lastError) console.log(chrome.runtime.lastError); }
  );
`);
