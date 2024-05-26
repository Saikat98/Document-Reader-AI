import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

var inputField = document.getElementById("input");
var message = document.getElementById('messages');
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
            add_chat(input);
        }}
    });
});

// attachment upload
document.getElementById('attachment').addEventListener('click', function() {
    document.getElementById('attachment-input').click();
    attachment = false;
    message.classList.remove("allow_scroll");
});

// events once the file is uploaded
document.getElementById('attachment-input').addEventListener('change', function(event) {
    attachment = event.target.files[0];
    if (attachment) {
        inputField.placeholder = `Passage loaded "${attachment.name}"`;

        message.classList.add("messages_bottom_border");
        setTimeout(() => {
            message.classList.remove("messages_bottom_border");
            }, 80
        )   

        var gloss = document.getElementById('gloss-effect');
        gloss.classList.remove("gloss-effect");
        gloss.classList.add("gloss-effect-active");

        message.classList.add("messages_top_border");

        var info = document.getElementById('info');
        let original_info = info.innerHTML;

        setTimeout(() => {
            message.classList.remove("messages_top_border");
            message.classList.add("allow_scroll");
            gloss.classList.remove("gloss-effect-active");
            gloss.classList.add("gloss-effect");
            info.classList.add("ready");
            info.innerHTML = "Ready";
        }, 300
        )
        setTimeout(() => {
            inputField.placeholder = "Ask something...";
            info.classList.remove("ready");
            info.innerHTML = original_info;
        }, 1600
        )

        console.log('File selected:', attachment.name);
        // You can add more code here to handle the file upload
    }
});

function add_chat(query) {
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
    botText.classList.toggle('typing');
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
        botText.classList.toggle('typing');
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