document.getElementById('toggleSwitch').addEventListener('change', async (e) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleCompactClass,
    args: [e.target.checked]
  });
});

function toggleCompactClass(enable) {
  const body = document.body;
  if (enable) {
    body.classList.add('sapUiSizeCompact');
  } else {
    body.classList.remove('sapUiSizeCompact');
  }
}

document.getElementById('directionSelect').addEventListener('change', async (e) => {
  const direction = e.target.value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setTextDirection,
    args: [direction]
  });
});

function setTextDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
}

document.getElementById('themeSelect').addEventListener('change', async (e) => {
  const theme = e.target.value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.id) {
    updateTabTheme(tab.id, theme);
  }
});

function updateThemeParameter(url, theme) {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    params.set('sap-ui-theme', theme);
    
    // Return the updated URL
    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    return url; // Return original URL if parsing fails
  }
}

function applyThemeAndReload(theme) {
  const currentUrl = window.location.href;
  const newUrl = updateThemeParameter(currentUrl, theme);
  
  // Only reload if URL changed
  if (currentUrl !== newUrl) {
    window.location.href = newUrl;
  }
}

function updateTabTheme(tabId, theme) {
  chrome.tabs.get(tabId, (tab) => {
    const newUrl = updateThemeParameter(tab.url, theme);
    
    if (tab.url !== newUrl) {
      chrome.tabs.update(tabId, { url: newUrl });
    }
  });
}

function applyThemeToActiveTab(theme) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      updateTabTheme(tabs[0].id, theme);
    }
  });
}