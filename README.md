# news-aggregator-discord-bot

โปรเจกต์นี้ทำหน้าที่รวมข่าวสารและอัปเดตล่าสุดจากหลายแหล่งยอดนิยมด้านเทคโนโลยี ไม่ว่าจะเป็นบทความ, วิดีโอ หรือ release log โดยเน้นเฉพาะเนื้อหาคุณภาพจาก:

- 📰 [Dev.to](https://dev.to)
- ✍️ [Medium](https://medium.com)
- 📺 [YouTube](https://youtube.com)
- 🛠️ [GitHub Releases](https://github.com)

## คุณสมบัติเด่น

- ✅ ดึงข้อมูลหลายแหล่งพร้อมกัน
- 🌐 กรองเฉพาะบทความภาษาไทยหรืออังกฤษ
- 🧠 คัดกรองบทความที่มีคุณภาพ (ความยาวเพียงพอ, ไม่มีคำที่ไม่น่าเชื่อถือ)
- 🔗 รวมลิงก์, คำอธิบาย, วันที่โพสต์ เพื่อความสะดวกในการอ่าน
- 📦 ใช้ `RSS` ไม่ต้องใช้ OAuth

## แหล่งข้อมูลที่รองรับ

### Dev.to
- Tags ที่รองรับ: สามารถกำหนดการตั้งค่าได้จาก Database

### Medium
- Topics: สามารถกำหนดการตั้งค่าได้จาก Database

### YouTube
- รองรับจาก channel ที่กำหนดผ่าน RSS (เช่น Fireship, ThePrimeagen ฯลฯ)

### GitHub Releases
- สามารถกำหนดการตั้งค่าได้จาก Database

## การใช้งาน

- ใส่ parameter ตามไฟล์ตัวอย่าง `.env.example`

```bash
# ติดตั้ง dependencies
npm install

# เรียกใช้งาน feed ทั้งหมด
npm start
```

## Push Image
```powershell
# หาก run ด้วย powershell
powershell -ExecutionPolicy Bypass -File .\push-image.ps1
```