function generateSalt(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

function extendKey(key, salt, length) {
    let extendedKey = key + salt;
    while (extendedKey.length < length) {
        extendedKey += extendedKey;
    }
    return extendedKey.slice(0, length);
}

function encrypt(message, key) {
    const salt = generateSalt(8);
    const extendedKey = extendKey(key, salt, message.length);
    let encrypted = '';

    for (let i = 0; i < message.length; i++) {
        const encryptedCharCode = message.charCodeAt(i) ^ extendedKey.charCodeAt(i);
        encrypted += String.fromCharCode(encryptedCharCode);
    }

    return btoa(salt + encrypted);
}

function decrypt(ciphertextBase64, key) {
    const ciphertext = atob(ciphertextBase64);
    const saltLength = 8;
    const salt = ciphertext.slice(0, saltLength);
    const encryptedMessage = ciphertext.slice(saltLength);
    const extendedKey = extendKey(key, salt, encryptedMessage.length);
    let decrypted = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const decryptedCharCode = encryptedMessage.charCodeAt(i) ^ extendedKey.charCodeAt(i);
        decrypted += String.fromCharCode(decryptedCharCode);
    }

    return decrypted;
}

function process() {
    const message = document.getElementById('message').value.trim();
    const key = document.getElementById('key').value.trim();
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const output = document.getElementById('output');

    if (!message || !key) {
        output.textContent = 'Veuillez entrer un message et une clé.';
        return;
    }

    console.time('Processing');
    let result = '';
    if (mode === 'encrypt') {
        result = encrypt(message, key);
    } else {
        try {
            result = decrypt(message, key);
        } catch (e) {
            result = 'Erreur : Message invalide ou mauvaise clé.';
        }
    }
    console.timeEnd('Processing');
    output.textContent = result;
}

document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        document.getElementById('message').value = '';
        document.getElementById('key').value = '';
        document.getElementById('output').textContent = '';
    });
});