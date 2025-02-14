function isQRCodeLibraryLoaded() {
    return typeof QRCode !== 'undefined';
}

document.getElementById('twitterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!isQRCodeLibraryLoaded()) {
        alert('QR Code library is still loading. Please wait a few seconds and try again.');
        return;
    }

    const username = document.getElementById('username').value.replace('@', '');
    const tweetContent = document.getElementById('tweetContent').value.trim();
    const hashtags = document.getElementById('hashtags').value
        .split(' ')
        .filter(tag => tag)
        .map(tag => tag.startsWith('#') ? tag : '#' + tag)
        .join(' ');

    // Create tweet text with proper line breaks
    // Note: %0A is the URL-encoded form of a line break
    const tweetText = encodeURIComponent(
        `${tweetContent}` +
        `\n\n@${username}` +
        `\n\n${hashtags}`
    );
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    // Store URL in button's data attribute for copying
    document.getElementById('copyButton').setAttribute('data-url', twitterUrl);

    // Clear previous QR code
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = '';

    try {
        // Generate new QR code
        const qrcode = new QRCode(qrcodeElement, {
            text: twitterUrl,
            width: 256,  // Increased size for better scanning
            height: 256,
            colorDark: '#1da1f2',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add download link
        const downloadLink = document.createElement('a');
        downloadLink.href = qrcodeElement.querySelector('img').src;
        downloadLink.download = 'twitter-qr.png';
        downloadLink.innerHTML = '<br>Download QR Code';
        downloadLink.className = 'download-link';
        qrcodeElement.appendChild(downloadLink);

    } catch (error) {
        qrcodeElement.innerHTML = 'Error generating QR code. Please try again.';
        console.error('QR Code generation error:', error);
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    const url = this.getAttribute('data-url');
    if (!url) return;
    
    // Create temporary input for copying
    const temp = document.createElement('input');
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    
    // Show feedback
    const originalText = this.textContent;
    this.textContent = 'Copied!';
    setTimeout(() => this.textContent = originalText, 2000);
});

// Add retry mechanism
window.addEventListener('load', function() {
    if (!isQRCodeLibraryLoaded()) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = function() {
            console.log('QR Code library loaded successfully');
        };
        script.onerror = function() {
            console.error('Failed to load QR Code library');
        };
        document.head.appendChild(script);
    }
});