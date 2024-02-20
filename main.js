import './style.css'

// Load environment variables
const portNum = 3000;
const domainOrIp = "http://localhost";

// Get a reference to the elements
const imageUploader = document.getElementById("imageFileInput");
const imageUrlInput = document.getElementById("imageUrlInput");
const promptInput = document.getElementById("promptInput");
const submitButton = document.querySelector("#submitButton");
const qwenOutput = document.querySelector("#qwenOutput");
// Attach an event listeners
imageUploader.addEventListener("change", imageFileChanged);
imageUrlInput.addEventListener("input", imageUrlChanged);
submitButton.addEventListener("click", submitReplicate);

var imageDataURL = "";

// Set up the API options here
const proxyUrl = `${domainOrIp}:${portNum}/api/predictions`; //proxy is required due to CORS policy
var requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};


function imageFileChanged(event) {
  const file = event.target.files[0];
  if (!file) return;
  imageUrlInput.value = "";
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log(e.target);
    imageDataURL = e.target.result;
  };
  reader.readAsDataURL(file);
}

function imageUrlChanged(event) {
  const imageUrl = imageUrlInput.value.trim();
  if (imageUrl === "") return;
  imageDataURL = "";
  imageUploader.value = "";
}

function submitReplicate() {
  const promptText = promptInput.value;

  // Detect whether the input is a URL or path
  let imageUrl;
  if (imageDataURL !== "") {
    // File
    imageUrl = imageDataURL;
  } else {
    // URL
    imageUrl = imageUrlInput.value;
  }

  // Once the image URL is ready, update request data and options, then run replicate
  const requestData = {
    image: imageUrl,
    prompt: promptText
  };

  // Update request options
  requestOptions.body = JSON.stringify(requestData);

  runReplicate();
}

function runReplicate() {
  console.log('runReplicate() invoked');
  console.log(`Request:`);
  console.log(requestOptions);
  qwenOutput.innerHTML = 'Waiting for output...';
  fetch(proxyUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(`Received data:`);
      console.log(data);
      qwenOutput.innerHTML = `Qwen: ${data.output}`;
      console.log('runReplicate completed');
    })
    .catch(error => console.error('Error:', error));
}