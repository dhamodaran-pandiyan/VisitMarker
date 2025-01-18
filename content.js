// Extract the domain from a URL
function extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return null;
    }
  }
  
  // Format timestamp to a readable string
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  
  // Add last visit information to main search result titles
  function addLastVisitInfoToMainResults() {
    // Google search results typically have `h3` inside an anchor tag for main results
    const mainResults = document.querySelectorAll("a h3");
  
    mainResults.forEach((resultTitle) => {
      const link = resultTitle.parentElement; // Get the parent anchor tag
  
      // Avoid processing the same link multiple times
      if (link.dataset.lastVisitProcessed === "true") return;
  
      const domain = extractDomain(link.href);
      if (domain) {
        chrome.runtime.sendMessage({ action: "getLastVisit", domain }, (response) => {
          const lastVisitTime = response?.lastVisit;
          if (lastVisitTime) {
            // Check if the span already exists to prevent duplicates
            if (!link.querySelector(".last-visit-info")) {
              const infoSpan = document.createElement("span");
              infoSpan.className = "last-visit-info";
              infoSpan.textContent = ` (Last visited: ${formatTimestamp(lastVisitTime)})`;
              infoSpan.style.color = "gray";
              infoSpan.style.fontSize = "small";
              infoSpan.style.marginLeft = "5px";
  
              // Append the info span after the result title
              link.appendChild(infoSpan);
            }
          }
          // Mark the link as processed
          link.dataset.lastVisitProcessed = "true";
        });
      } else {
        // Mark as processed even if no domain is extracted
        link.dataset.lastVisitProcessed = "true";
      }
    });
  }
  
  // Set up a MutationObserver to monitor dynamic content
  const observer = new MutationObserver(() => {
    addLastVisitInfoToMainResults();
  });
  
  // Observe changes in the document body (subtree for dynamic updates)
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial pass to handle already-loaded results
  addLastVisitInfoToMainResults();
  