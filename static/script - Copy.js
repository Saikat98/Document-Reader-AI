import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

var inputField = document.getElementById("input");
var attachment;

// enter key triggers the chat
document.addEventListener("DOMContentLoaded", () => {
    
    inputField.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
        let input = inputField.value;
        if ((inputField.value == "") || (!attachment)){
            shake_animation()
        }
        else{
            inputField.value = "";
            addChat(input);
        }}
    });
});

// attachment upload
document.getElementById('attachment').addEventListener('click', function() {
    document.getElementById('attachment-input').click();
});

document.getElementById('attachment-input').addEventListener('change', function(event) {
    attachment = event.target.files[0];
    if (attachment) {
        inputField.placeholder = `Passage loaded - "${attachment.name}"`;
        // fake delay
        setTimeout(() => {
            inputField.placeholder = "Ask something...";
          }, 800
          )
        console.log('File selected:', attachment.name);
        // You can add more code here to handle the file upload
    }
});

function addChat(query) {
    let answer = "Didn't get you";
    const messagesContainer = document.getElementById("messages");

    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.className = "user response";
    userDiv.innerHTML = `<span class="user_response">${query}</span><img src="/static/images/user.png" class="avatar">`;
    messagesContainer.appendChild(userDiv);

    let botDiv = document.createElement("div");
    let botImg = document.createElement("img");
    let botText = document.createElement("span");
    botDiv.id = "bot";
    botImg.src = "/static/images/dino.png";
    botImg.className = "avatar";
    botDiv.className = "bot response";
    botText.className = "bot_response";
    botText.innerText = "Typing...";
    // botText.innerHTML = `<p>The 15-inch MacBook Air offers a great balance of portability and power.  It's lightweight, which is fantastic for those who are constantly on the go, and has an efficient M3 chip that provides ample power for most everyday tasks, including video editing. However, the screen resolution is not as high as some Windows laptops, and its performance falls short of Apple's more powerful MacBook Pro models. Here is a table that breaks down the pros and cons:</p><table><thead><tr><th>Pros</th><th>Cons</th></tr></thead><tbody><tr><td>Lightweight and portable</td><td>Lower screen resolution compared to some competitors</td></tr><tr><td>Powerful M3 chip</td><td>Less powerful than the MacBook Pro</td></tr><tr><td>Long battery life</td><td></td></tr><tr><td>Reasonable price</td><td></td></tr></tbody></table>`;
    // botText.innerText = "The poet is talking about the qualities that make a person strong and resilient. The poem explores the idea of maintaining composure and integrity in the face of adversity, holding onto your values even when others around you are losing theirs. It emphasizes the importance of self-reliance, perseverance, and a balanced perspective in life.";
    botDiv.appendChild(botImg);
    botDiv.appendChild(botText);
    messagesContainer.appendChild(botDiv);

    const formData = new FormData()
    formData.append('passage', attachment);
    formData.append('query', query);

    fetch('/prompt', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        answer = data.answer;
        // Update DOM
        botText.innerHTML = marked.parse(answer);
        // Keep messages at most recent
        messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

  // Keep messages at most recent
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
}

// to shake the input field if no file is uploaded or the input is blank
function shake_animation() {
    inputField.value= "" ;
    inputField.classList.add('shake-animation');
    // Remove the animation class after 150ms
    setTimeout(() => {
        inputField.classList.remove('shake-animation');
    }, 150);
}