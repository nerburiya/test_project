console.log('main.js loaded');

function generateNumbers() {
    console.log('Button clicked: Generating numbers...');
    const numbersWrapper = document.querySelector('.numbers-wrapper');
    if (!numbersWrapper) {
        console.error('numbers-wrapper not found');
        return;
    }

    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    // Clear previous numbers
    numbersWrapper.innerHTML = '';

    sortedNumbers.forEach((number, index) => {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;

        // Determine color range
        if (number <= 10) {
            ball.classList.add('range-1');
        } else if (number <= 20) {
            ball.classList.add('range-2');
        } else if (number <= 30) {
            ball.classList.add('range-3');
        } else if (number <= 40) {
            ball.classList.add('range-4');
        } else {
            ball.classList.add('range-5');
        }

        // Staggered animation
        ball.style.animationDelay = `${index * 0.1}s`;

        numbersWrapper.appendChild(ball);
    });
}

// Initial generation
window.onload = () => {
    generateNumbers();
};
