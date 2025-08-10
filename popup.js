// Load dial codes JSON once
let dialCodes = {};

fetch('dialcodes.json')
    .then(response => response.json())
    .then(data => {
        dialCodes = data;
    });

// When user submits the number
document.getElementById('lookupForm').addEventListener('submit', e => {
    e.preventDefault();
    
    let number = normalizeNumber(document.getElementById('phoneInput').value.trim());
    
    if (!validateNumber(number)) {
        document.getElementById('result').textContent = "Invalid number or code";
        return;
    }

    let carrier = findCarrier(number);
    
    const resultEl = document.getElementById('result');
    if (carrier) {
        resultEl.textContent = `${number.substring(0, carrier.length)} is ${carrier.name}`;
    } else {
        resultEl.textContent = `Unknown code: ${number}`;
    }
});

function normalizeNumber(number) {
    number = number.replace(/[\s\-,()]/g, '').replace(/^\+/, '');
        if (number.startsWith('27') && number.length > 2) {
            number = '0' + number.slice(2);
        }
        return number;
}

function validateNumber(number) {
    return /^0\d+$/.test(number);
}

function findCarrier(number) {
    // Extract dial code first 4 digits
    let code = number.substring(0,4);
    if (dialCodes[code]) return { name: dialCodes[code], length: 4 };
    
    // Then try first 3 digits
    code = number.substring(0,3);
    if (dialCodes[code]) return { name: dialCodes[code], length: 3 };

    return null;
}