chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLastVisit") {
    const fullUrl = request.domain; // The full URL (including path and domain)
    
    // Search in history with the full URL
    chrome.history.search({ text: fullUrl, maxResults: 10 }, (results) => {
      let lastVisit = null;
      
      // Loop through results and find the exact match
      results.forEach((result) => {
        if (result.url === fullUrl) {  // Ensure full URL match
          lastVisit = result.lastVisitTime;
        }
      });
      
      sendResponse({ lastVisit });
    });
    return true; // Keep the message channel open for asynchronous response
  }
});
