const passwordDisplay = document.getElementById('password-display');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const generateBtn = document.getElementById('generate-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
};

// Slider update
lengthSlider.addEventListener('input', (e) => {
    lengthVal.innerText = e.target.value;
    generatePassword(); // Auto-generate on change
});

function generatePassword() {
    let charPool = "";
    if (document.getElementById('uppercase').checked) charPool += charSets.uppercase;
    if (document.getElementById('lowercase').checked) charPool += charSets.lowercase;
    if (document.getElementById('numbers').checked) charPool += charSets.numbers;
    if (document.getElementById('symbols').checked) charPool += charSets.symbols;

    let length = lengthSlider.value;
    let password = "";

    // Exclude Similar Characters logic
    if (document.getElementById('exclude-similar').checked) {
        charPool = charPool.replace(/[il10O]/g, "");
    }

    if (charPool === "") return passwordDisplay.value = "Select Options!";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }

    passwordDisplay.value = password;
    updateStrength(password);
}

function updateStrength(pwd) {
    let strength = 0;
    if (pwd.length > 8) strength++;
    if (pwd.length > 15) strength++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 1) {
        strengthBar.style.width = "30%";
        strengthBar.style.backgroundColor = "#ff4d4d";
        strengthText.innerText = "Strength: Weak";
    } else if (strength <= 3) {
        strengthBar.style.width = "60%";
        strengthBar.style.backgroundColor = "#ffa500";
        strengthText.innerText = "Strength: Medium";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "#00ffcc";
        strengthText.innerText = "Strength: Strong";
    }
}

// Copy Feature
document.getElementById('copy-btn').addEventListener('click', async (e) => {
    const text = passwordDisplay.value;
    const btn = e.currentTarget;
    const originalIcon = btn.innerHTML; // Agerr icon save rakha

    if (!text || text === "Select Options!") return;

    try {
        await navigator.clipboard.writeText(text);
        showToast();

        // Icon change to checkmark
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
        
        // 2 second por abar ager icon-e firot ana
        setTimeout(() => {
            btn.innerHTML = originalIcon;
        }, 2000);

    } catch (err) {
        console.error("Failed to copy!", err);
    }
});

function showToast() {
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}

// Initial Call
generateBtn.addEventListener('click', generatePassword);
window.onload = generatePassword;