class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const themeToggle = document.querySelector('.theme-toggle');
const calculator = document.querySelector('.calculator');

// Initialize calculator
const calculatorObj = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculatorObj.appendNumber(button.innerText);
        calculatorObj.updateDisplay();
    });
});

operationButtons.forEach(button => {
    if (button.dataset.action !== 'calculate' && 
        button.dataset.action !== 'delete' && 
        button.dataset.action !== 'clear') {
        button.addEventListener('click', () => {
            calculatorObj.chooseOperation(button.innerText);
            calculatorObj.updateDisplay();
        });
    }
});

equalsButton.addEventListener('click', () => {
    calculatorObj.compute();
    calculatorObj.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculatorObj.clear();
    calculatorObj.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculatorObj.delete();
    calculatorObj.updateDisplay();
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculatorObj.appendNumber(e.key);
        calculatorObj.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*') {
        calculatorObj.chooseOperation(
            e.key === '*' ? '×' : e.key
        );
        calculatorObj.updateDisplay();
    } else if (e.key === '/') {
        e.preventDefault();
        calculatorObj.chooseOperation('÷');
        calculatorObj.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculatorObj.compute();
        calculatorObj.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculatorObj.delete();
        calculatorObj.updateDisplay();
    } else if (e.key === 'Escape') {
        calculatorObj.clear();
        calculatorObj.updateDisplay();
    }
});

// Theme Toggle
function toggleTheme() {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    );
    
    const icon = themeToggle.querySelector('i');
    if (document.body.getAttribute('data-theme') === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save theme preference
    localStorage.setItem('calculator-theme', document.body.getAttribute('data-theme'));
}

themeToggle.addEventListener('click', toggleTheme);

// Check for saved theme preference
const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);

// Set initial icon
const icon = themeToggle.querySelector('i');
if (savedTheme === 'light') {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}
