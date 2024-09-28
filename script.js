const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//API configuration
const API_KEY = "";
const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); //get text element

    //send POST request to API with the users's messgae
    try {
        const response = await fetch(API_URL,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{text: userMessage}]
                }]
            })
        });

    const data = await response.json();

    const apiResponse = data?.candidates[0].content.parts[0].text;
    textElement.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
    } finally{
        incomingMessageDiv.classList.remove("loading");
    }
}

// Show loading animation while waiting for the api response
const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
                <p class="text"></p>
                    <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    </div>
                </div>
                <span class="icon material-symbols-rounded">content_copy</span>`;

const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
chatList.appendChild(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv);
}

//handle sending outgoing chat messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if (!userMessage) return;

    const html = `<div class="message-content">
                <img src="images/user.jpg" alt="User Image" class="avatar">
                <p class="text"></p>
                </div>`;

    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset(); //clear input field
    setTimeout(showLoadingAnimation, 500); //show loading animation after a delay
}

//Prevent default form submission and handle outgoing 
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
});