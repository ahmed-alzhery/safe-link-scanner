const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// مفتاح الـ API الخاص بك
const VT_API_KEY = 'c0fb1318542c5e3b36455b96c5b75dd8691193d3d58385d127ed7942c0b6bc28'; 

app.post('/scan', async (req, res) => {
    const userUrl = req.body.url;
    if (!userUrl) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        // تحويل الرابط لصيغة Base64 المتوافقة مع متطلبات VirusTotal
        const urlId = Buffer.from(userUrl).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
        const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: { 'x-apikey': VT_API_KEY }
        });

        const stats = response.data.data.attributes.last_analysis_stats;
        
        // طباعة النتيجة في CMD للتأكد
        console.log(`-----------------------------------`);
        console.log(`🔍 فحص: ${userUrl}`);
        console.log(`⚠️ خبيث: ${stats.malicious} | 🤨 مشبوه: ${stats.suspicious} | ✅ آمن: ${stats.harmless}`);

        res.json({
            malicious: stats.malicious,
            suspicious: stats.suspicious,
            harmless: stats.harmless
        });

    } catch (error) {
        console.log("❌ خطأ: الرابط قد يكون جديداً جداً أو هناك مشكلة في المفتاح.");
        res.status(404).json({ error: "لم نجد معلومات لهذا الرابط، حاول فحص رابط آخر." });
    }
});

app.listen(3000, () => {
    console.log('🛡️ درع الأمان يعمل الآن على المنفذ 3000');
});