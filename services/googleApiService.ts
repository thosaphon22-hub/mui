import { StudentApplication } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

// Helper to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const submitApplicationToSheet = async (application: StudentApplication): Promise<{ success: boolean; message?: string }> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL is not set. Returning mock success.");
    return { success: true, message: "Mock Success (No API URL)" };
  }

  try {
    // Google Apps Script Web App requires sending data as a POST.
    // critical: Use text/plain to avoid CORS Preflight (OPTIONS) request which GAS often fails to handle.
    const response = await fetch(GOOGLE_SCRIPT_URL + '?action=submit', {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(application),
    });

    if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResult = await response.text();
    let result;
    try {
        result = JSON.parse(textResult);
    } catch (e) {
        console.error("Non-JSON response from server:", textResult);
        throw new Error("Server returned invalid response (possibly HTML error page). Check Script URL.");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    const msg = error instanceof Error ? error.message : "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ หรือเกิดข้อผิดพลาดทางเทคนิค";
    return { success: false, message: msg };
  }
};

export const fetchApplicationsFromSheet = async (): Promise<StudentApplication[]> => {
  if (!GOOGLE_SCRIPT_URL) return [];

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + '?action=getData');
    const textResult = await response.text();
    
    let result;
    try {
        result = JSON.parse(textResult);
    } catch (e) {
        console.error("Fetch Data Parse Error (Likely HTML response):", textResult);
        return [];
    }
    
    if (result.success && Array.isArray(result.data)) {
        // Map raw sheet data back to Application Structure if needed
        return result.data.map((row: any) => {
            if (row.jsonData) {
                try {
                    const parsed = JSON.parse(row.jsonData);
                    return { ...parsed, status: row.status }; 
                } catch (e) {
                    console.error("Error parsing row JSON", e);
                }
            }
            return row as StudentApplication;
        });
    }
    return [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};