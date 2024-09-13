const apiEndpoints = {
    generateText: '/generate_text',
    generateTextStream: '/generate_text_stream',
    searchNews: '/search_news',
    chat: '/chat',
    createModel: '/create_model',
    deleteModel: '/delete_model',
    listModels: '/list_models',
  };
  async function generateText(text) {
    const response = await fetch(apiEndpoints.generateText, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return response.json();
  }
  
  async function generateTextStream(text) {
    const response = await fetch(apiEndpoints.generateTextStream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return response.json();
  }
  
  async function searchNews(query) {
    const response = await fetch(apiEndpoints.searchNews, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return response.json();
  }
  
  async function chat(message) {
    const response = await fetch(apiEndpoints.chat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.json();
  }
  
  async function createModel(modelName) {
    const response = await fetch(apiEndpoints.createModel, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName }),
    });
    return response.json();
  }
  
  async function deleteModel(modelId) {
    const response = await fetch(apiEndpoints.deleteModel, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId }),
    });
    return response.json();
  }
  
  async function listModels() {
    const response = await fetch(apiEndpoints.listModels, {
      method: 'GET',
    });
    return response.json();
  }

  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatMessagesDiv = document.getElementById('chat-messages');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
      const response = await chat(message);
      // Update the chat messages div with the response
      const chatMessagesDiv = document.getElementById('chat-messages');
      const messageHTML = `
        <div>
          <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">AI</span>
          <p class="text-gray-700 dark:text-gray-300">${response.message}</p>
        </div>
      `;
      chatMessagesDiv.innerHTML += messageHTML;
      userInput.value = '';
    }
  });