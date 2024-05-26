var inputField = document.getElementById("input");
var attachment;

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


document.getElementById('attachment').addEventListener('click', function() {
    document.getElementById('attachment-input').click();
});

document.getElementById('attachment-input').addEventListener('change', function(event) {
    attachment = event.target.files[0];
    if (attachment) {
        document.getElementById('input').placeholder = "Ask something...";
        console.log('File selected:', attachment.name);
        // You can add more code here to handle the file upload
    }
});

// function output(query) {
//     let answer;

//     const formData = new FormData()
//     formData.append('passage', attachment);
//     formData.append('query', query);

//     fetch('/prompt', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         answer = data.answer;
//         // Update DOM
//         addChat(query, answer);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

//     if (query.toLowerCase() == "hi") { 
//         answer = "Hi There! Welcome to the chatbot.\n How can I assist you?"
//     } else {
//         answer = "Didn't get you"
//     }
// }


function addChat(query) {
    const messagesContainer = document.getElementById("messages");

    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.className = "user response";
    userDiv.innerHTML = `<img src="/static/images/user.png" class="avatar"><span class="user_response">${query}</span>`;
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
    botDiv.appendChild(botText);
    botDiv.appendChild(botImg);
    messagesContainer.appendChild(botDiv);

    const formData = new FormData()
    formData.append('passage', attachment);
    formData.append('query', query);

    let answer = "Didn't get you"
    fetch('/prompt', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        answer = data.answer;
        // Update DOM
        botText.innerText = `${answer}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

  
//   botText.innerText = `${product}`;
  // Keep messages at most recent
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  // Fake delay to seem "real"
//   setTimeout(() => {
//     botText.innerText = `${product}`;
//   }, 700
//   )
}

function shake_animation() {
    inputField.value= "" ;
    inputField.classList.add('shake-animation');
    // Remove the animation class after 150ms
    setTimeout(() => {
        inputField.classList.remove('shake-animation');
    }, 150);
}