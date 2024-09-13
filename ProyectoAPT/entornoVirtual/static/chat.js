// chatScript.js
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('user-input');
const chatResponse = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = chatInput.value.trim();
  if (query) {
    fetch('/search_news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to search news');
        }
      })
      .then((data) => {
        const responseText = data.response;
        let responseHTML = '';
        responseText.split('\n').forEach((line) => {
          responseHTML += `<p>${line}</p>`;
        });
        chatResponse.innerHTML += responseHTML;
      })
      .catch((error) => {
        console.error(error);
        chatResponse.innerHTML += `<p>Error: ${error.message}</p>`;
      });
  }
});