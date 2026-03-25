async function startScan() {
    const url = document.getElementById('urlInput').value.trim();
    const card = document.getElementById('resultCard');
    const btn = document.getElementById('scanBtn');

    if (!url) return alert("يرجى إدخال الرابط");

    btn.innerText = "جاري الفحص...";
    btn.disabled = true;

    try {
        const response = await fetch('https://ready-parks-juggle.loca.lt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();
        card.style.display = "block";
        btn.disabled = false;
        btn.innerText = "فحص";

        document.getElementById('stats').innerHTML = 
            `🔴 خطر: ${data.malicious} | 🟡 مشبوه: ${data.suspicious} | 🟢 آمن: ${data.harmless}`;

        if (data.malicious > 0 || data.suspicious > 0) {
            card.style.background = "#fff1f2";
            card.style.border = "1px solid #fecdd3";
            card.style.color = "#be123c";
            document.getElementById('resTitle').innerText = "🚨 رابط غير آمن!";
            document.getElementById('resDesc').innerText = "احذر، هذا الرابط قد يضر بجهازك أو يسرق بياناتك.";
        } else {
            card.style.background = "#f0fdf4";
            card.style.border = "1px solid #bbf7d0";
            card.style.color = "#15803d";
            document.getElementById('resTitle').innerText = "✅ الرابط سليم";
            document.getElementById('resDesc').innerText = "يمكنك تصفح هذا الرابط بأمان، لم نجد أي تهديدات.";
        }
    } catch (e) {
        alert("تأكد من تشغيل السيرفر (node server.js)");
        btn.disabled = false;
        btn.innerText = "فحص";
    }
}
