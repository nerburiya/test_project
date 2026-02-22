function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function generateNumbers() {
    console.log('Button clicked: Generating numbers...');
    const numbersWrapper = document.querySelector('.numbers-wrapper');
    if (!numbersWrapper) return;

    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    numbersWrapper.innerHTML = '';

    sortedNumbers.forEach((number, index) => {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;

        if (number <= 10) ball.classList.add('range-1');
        else if (number <= 20) ball.classList.add('range-2');
        else if (number <= 30) ball.classList.add('range-3');
        else if (number <= 40) ball.classList.add('range-4');
        else ball.classList.add('range-5');

        ball.style.animationDelay = `${index * 0.1}s`;
        numbersWrapper.appendChild(ball);
    });
}

// Teachable Machine Image Model Logic
// Update this URL to your exported model link
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/[...]/"; 

let model, webcam, labelContainer, maxPredictions;

async function initAI() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    // Show loading state
    const btn = document.querySelector('.ai-model-container button');
    btn.textContent = "Loading Model...";
    btn.disabled = true;

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(300, 300, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").innerHTML = '';
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const labelDiv = document.createElement("div");
            labelDiv.className = "label-item";
            labelContainer.appendChild(labelDiv);
        }
        
        btn.style.display = 'none'; // Hide button after success
    } catch (error) {
        console.error("AI Model Init Error:", error);
        btn.textContent = "Error: Check URL/Camera";
        btn.disabled = false;
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        
        const labelItem = labelContainer.childNodes[i];
        labelItem.innerHTML = `
            <span class="class-name">${prediction[i].className}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${prediction[i].probability * 100}%"></div>
            </div>
            <span class="probability">${(prediction[i].probability * 100).toFixed(0)}%</span>
        `;
    }
}

window.onload = () => {
    generateNumbers();
};
