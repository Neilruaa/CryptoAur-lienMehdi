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

    return salt + encrypted;
}

function decrypt(ciphertext, key) {
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

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('1=crypter, 2=décrypter : ', (choix) => {
    if (choix === '1') {
        rl.question('Entrez votre message : ', (message) => {
            rl.question('Entrez votre clé secrète : ', (key) => {
                console.time('Temps de chiffrement');
                const encrypted = encrypt(message, key);
                console.timeEnd('Temps de chiffrement');
                console.log('\nMessage chiffré :', Buffer.from(encrypted, 'utf8').toString('base64'));
                rl.close();
            });
        });
    } else {
        rl.question('Entrez votre message codé : ', (messagecodé) => {
            rl.question('Entrez votre clé secrète : ', (key) => {
                const encryptedBuffer = Buffer.from(messagecodé, 'base64');
                const encryptedText = encryptedBuffer.toString('utf8');
                console.time('Temps de déchiffrement');
                const decrypted = decrypt(encryptedText, key);
                console.timeEnd('Temps de déchiffrement');
                console.log('Message déchiffré :', decrypted);
                rl.close();
            });
        });
    }
});