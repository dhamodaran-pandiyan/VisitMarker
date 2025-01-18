chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLastVisit") {
      chrome.history.search({ text: request.domain, maxResults: 1 }, (results) => {
        const lastVisit = results.length > 0 ? results[0].lastVisitTime : null;
        sendResponse({ lastVisit });
      });
      return true; // Keep the message channel open for asynchronous response
    }
  });
  