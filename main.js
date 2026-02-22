// 전역 함수 등록
window.openTab = function(evt, tabName) {
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
};

window.generateNumbers = function() {
    const numbersWrapper = document.querySelector('.numbers-wrapper');
    if (!numbersWrapper) return;
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
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
};

// --- Teachable Machine Logic ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Atfx90iBH/"; 

let model, maxPredictions;

// 모델 로드 함수 (성공/실패 로그 추가)
async function loadAIModel() {
    if (model) return true;
    
    const baseDir = MODEL_URL.endsWith('/') ? MODEL_URL : MODEL_URL + '/';
    console.log("Starting model loading...");
    
    try {
        model = await tmImage.load(baseDir + "model.json", baseDir + "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded! Classes count:", maxPredictions);
        return true;
    } catch (e) {
        console.error("Critical: Model loading failed!", e);
        alert("AI 모델을 불러오는 데 실패했습니다. 인터넷 연결이나 URL을 확인해 주세요.");
        return false;
    }
}

// 결과 게이지 UI 생성 함수 (데이터 업데이트 직전에 확실하게 호출)
function renderResultsUI() {
    const container = document.getElementById("label-container");
    if (!container) return;
    
    container.innerHTML = ''; // 초기화
    const labels = model.getClassLabels();
    
    for (let i = 0; i < maxPredictions; i++) {
        const item = document.createElement("div");
        item.className = "label-item";
        item.innerHTML = `
            <span class="class-name">${labels[i]}</span>
            <div class="progress-bar">
                <div class="progress-fill" id="fill-gauge-${i}" style="width: 0%"></div>
            </div>
            <span class="probability" id="prob-text-${i}">0%</span>
        `;
        container.appendChild(item);
    }
    console.log("UI gauge containers rendered.");
}

// 이미지 업로드 처리 (주요 수정 지점)
window.handleImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. 모델이 준비되지 않았다면 로드 시도
    const isReady = await loadAIModel();
    if (!isReady) return;

    const previewContainer = document.getElementById("webcam-container");
    previewContainer.innerHTML = '<div class="placeholder-text">Analyzing image...</div>';

    const reader = new FileReader();
    reader.onload = async function(e) {
        const img = new Image();
        img.onload = async function() {
            // 2. 미리보기 화면에 이미지 표시 (캔버스 사용)
            previewContainer.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 300, 300);
            previewContainer.appendChild(canvas);

            // 3. 결과 게이지 영역 다시 그리기
            renderResultsUI();

            // 4. 모델 예측 실행
            try {
                const predictions = await model.predict(canvas);
                console.log("Predictions result:", predictions);
                
                // 5. 실시간 게이지 업데이트
                for (let i = 0; i < maxPredictions; i++) {
                    const prob = (predictions[i].probability * 100).toFixed(0);
                    const gauge = document.getElementById(`fill-gauge-${i}`);
                    const text = document.getElementById(`prob-text-${i}`);
                    
                    if (gauge) gauge.style.width = prob + "%";
                    if (text) text.textContent = prob + "%";
                }
            } catch (err) {
                console.error("Prediction failed!", err);
                alert("이미지 분석 중 오류가 발생했습니다.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// 페이지 로드 시 초기화
window.onload = () => {
    window.generateNumbers();
    // 모델은 업로드 버튼을 처음 누를 때 로드하도록 지연 실행 (성능 최적화)
};
