function appendMessageToChat(message) {
    try {
      const messageHTML = `
        <li class="${message.type}">
          <p>${message.text}</p>
        </li>
      `;
      chatMessageList.innerHTML += messageHTML;
      // Agrega la animación a cada mensaje
      const messageElement = chatMessageList.lastChild;
      messageElement.classList.add('animate');
    } catch (error) {
      console.error('Error:', error);
    }
  }