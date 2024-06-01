import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.1/dist/moment.min.js';

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
    try {
        var userDivs = document.querySelectorAll('div[id="user"]');
        var botDivs = document.querySelectorAll('div[id="bot"]');
        remove_divs(userDivs);
        remove_divs(botDivs);
    } catch (error) {
        console.error('An error occurred while trying to remove divs:', error);
    } finally {
        document.getElementById('attachment-input').click();
        attachment = false;
        message.classList.remove("allow_scroll");
    }
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
    let userImg = document.createElement("img");
    let userText = document.createElement("div");
    let userTime = document.createElement("span");
    userDiv.id = "user";
    userImg.src = "/static/images/user.png";
    userImg.className = "avatar";
    userDiv.className = "user response";
    userText.className = "user_response";
    userTime.className = "user_time";
    userText.innerText = query;
    userTime.innerText = moment().format('h:mm A');
    userDiv.appendChild(userText);
    userText.appendChild(userTime);
    userDiv.appendChild(userImg);
    messagesContainer.appendChild(userDiv);

    let botDiv = document.createElement("div");
    let botImg = document.createElement("img");
    let botText = document.createElement("div");
    let botTime = document.createElement("span");
    botDiv.id = "bot";
    botImg.src = "/static/images/dino.png";
    botImg.className = "avatar";
    botDiv.className = "bot response";
    botText.className = "bot_response";
    botTime.className = "bot_time";
    botText.classList.toggle('typing');
    // botText.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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
        botTime.innerText = moment().format('h:mm A');
        botText.appendChild(botTime);
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

// function to remove divs (chats) once the attachment button is clicked
function remove_divs(divs) {
    divs.forEach(function(div) {
        div.parentNode.removeChild(div);
    });
}