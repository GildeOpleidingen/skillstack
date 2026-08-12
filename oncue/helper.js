const crypto = require('crypto');

function decryptPassword(encryptedBuffer, key) {
    const decipher = crypto.createDecipheriv(
        'aes-128-ecb',
        Buffer.from(key),
        null
    );

    decipher.setAutoPadding(true);

    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}
