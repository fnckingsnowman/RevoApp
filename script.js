const { ipcRenderer } = require('electron');

function showTab(tabId) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

let tabCount = 1;

function addNewTab() {
  tabCount += 1;
  const tabId = `tab${tabCount}`;
  const tabButtonId = `tabButton${tabCount}`;

  const tabsContainer = document.getElementById('tabs');
  const newTab = document.createElement('div');
  newTab.className = 'tab';
  newTab.id = tabButtonId;
  newTab.innerHTML = `
    <button onclick="showTab('${tabId}')">Tab ${tabCount}</button>
    <button class="delete-tab" onclick="deleteTab('${tabId}', '${tabButtonId}')">&times;</button>
  `;
  tabsContainer.appendChild(newTab);

  const contentContainer = document.getElementById('content');
  const newTabContent = document.createElement('div');
  newTabContent.id = tabId;
  newTabContent.className = 'tab-content';
  newTabContent.innerHTML = `
    <div class="header">Tab ${tabCount}</div>
    <input id="inputKey${tabCount}1" type="text" placeholder="Key to reassign">
    <input id="inputKey${tabCount}2" type="text" placeholder="New key assignment">
    <button onclick="updateKeyAssignment(${tabCount})">Update Key Assignment</button>
  `;
  contentContainer.appendChild(newTabContent);
}

function deleteTab(tabId, tabButtonId) {
  const tabContent = document.getElementById(tabId);
  const tabButton = document.getElementById(tabButtonId);

  if (tabContent && tabButton) {
    tabContent.remove();
    tabButton.remove();

    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) {
      const firstTab = document.querySelector('.tab-content');
      if (firstTab) firstTab.classList.add('active');
    }
  }
}

function updateKeyAssignment(tabIndex) {
  const oldKey = document.getElementById(`inputKey${tabIndex}1`).value;
  const newKey = document.getElementById(`inputKey${tabIndex}2`).value;
  
  ipcRenderer.send('update-key-assignment', { oldKey, newKey });
}
