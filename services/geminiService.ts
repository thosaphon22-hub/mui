import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if key exists to avoid immediate crash,
// though actual calls will fail gracefully if key is missing.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateEmailContent = async (
  topic: string,
  recipientName: string,
  tone: string = 'ทางการ'
): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing for Gemini");
    return "ไม่สามารถเชื่อมต่อ AI ได้ (Missing API Key)";
  }

  try {
    const prompt = `
      คุณเป็นเจ้าหน้าที่ธุรการโรงเรียน เขียนอีเมลถึงนักเรียนชื่อ "${recipientName}"
      หัวข้อ: "${topic}"
      น้ำเสียง: ${tone}
      ภาษา: ไทย
      ความยาว: สั้น กระชับ เข้าใจง่าย
      ไม่ต้องใส่หัวข้อ (Subject) เอาเฉพาะเนื้อหาในอีเมล
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "ขออภัย ไม่สามารถสร้างข้อความได้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการสร้างข้อความ";
  }
};
