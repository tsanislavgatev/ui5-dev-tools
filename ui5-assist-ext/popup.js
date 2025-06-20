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
