// Function to format the relative time (e.g., "1 hour ago")
function formatRelativeTime(lastVisitTime) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - lastVisitTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

// Function to format timestamp to a readable string (e.g., "Jan 18, 2025, 1:31:14 PM")
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

    const domain = link.href;
    if (domain) {
      chrome.runtime.sendMessage({ action: "getLastVisit", domain }, (response) => {
        const lastVisitTime = response?.lastVisit;
        if (lastVisitTime) {
          // Check if the button already exists next to the result
          if (!link.querySelector(".last-visited-button")) {
            // Create the button with relative time (no eye icon)
            const relativeTime = formatRelativeTime(new Date(lastVisitTime));
            const button = document.createElement("button");
            button.className = "last-visited-button";
            button.title = formatTimestamp(lastVisitTime); // Full date as tooltip
            button.textContent = relativeTime;

            // Add space between button and result text
            button.style.marginLeft = "15px";  // Space between result and button

            // Insert the button next to the result title
            link.appendChild(button); // Add the button after the result title
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
