import { GoogleGenAI, Type } from "@google/genai";
import { FinancialTransaction, InventoryItem, StaffMember } from "../types";

// Initialize Gemini
// Note: In a real environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Use Case 1: Inventory Demand Forecasting
 * Corresponds to "Template: Reorder_Optimization_Recommendation"
 */
export const forecastInventoryDemand = async (item: InventoryItem): Promise<{ quantity: number; reasoning: string; risk: string }> => {
  try {
    const prompt = `
      Template: Reorder_Optimization_Recommendation
      Goal: Provide supply order adjustment recommendations based on Demand Forecasting.
      Input:
      - ItemID: ${item.name} (${item.id})
      - Historical Usage (Last 6 months): ${item.monthlyUsage.join(', ')}
      - Current Stock: ${item.currentStock}
      - Static Reorder Point: ${item.reorderPoint}
      
      Prompt: "Item ${item.name} currently has ${item.currentStock} units, with a static Reorder Point of ${item.reorderPoint}. 
      Based on the historical trend, predict the demand for the next 30 days.
      Provide a recommended order quantity (Q) considering a 7-day stock buffer.
      Indicate the risk of Out-of-Stock (OOS) if relying only on the static Reorder Point.
      
      Return ONLY valid JSON format."
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedDemand: { type: Type.NUMBER },
            recommendedOrderQuantity: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] }
          },
          required: ["predictedDemand", "recommendedOrderQuantity", "reasoning", "riskLevel"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      quantity: data.recommendedOrderQuantity || 0,
      reasoning: data.reasoning || "Analysis failed",
      risk: data.riskLevel || "Unknown"
    };

  } catch (error) {
    console.error("Gemini Inventory Forecast Error:", error);
    throw error;
  }
};

/**
 * Use Case 2: Financial Anomaly Root Cause Analysis
 * Corresponds to "Template: Financial_Anomaly_Root_Cause"
 */
export const analyzeFinancialAnomaly = async (
  transactions: FinancialTransaction[], 
  accountId: string, 
  threshold: string
): Promise<string> => {
  try {
    const summary = transactions
      .map(t => `${t.date}: ${t.description} - $${t.amount} (${t.category})`)
      .join('\n');

    const prompt = `
      Template: Financial_Anomaly_Root_Cause
      Goal: Analyze transaction logs to identify the cause of unexpected cost spikes.
      Input: 
      - AccountID: ${accountId}
      - Threshold Deviation: ${threshold}
      - Transaction Summary: 
      ${summary}

      Prompt: "Based on the Transaction Summary above, analyze the cost spike for ${accountId} compared to typical operational costs. 
      Identify the root cause of this spike. Is it due to procurement price increases, unexpected patient volume (inferred), or classification errors?
      Provide an actionable summary for the Finance Manager. 
      Keep the response professional, concise, and structured."
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.2 // Lower temperature for analytical precision
      }
    });

    return response.text || "Unable to generate analysis.";

  } catch (error) {
    console.error("Gemini Finance Analysis Error:", error);
    return "Error connecting to AI service.";
  }
};

/**
 * Use Case 3: Staff Scheduling Optimization
 * Corresponds to "Optimalisasi Penjadwalan Staf"
 */
export const optimizeStaffSchedule = async (staff: StaffMember[]): Promise<string> => {
  try {
    const staffData = staff.map(s => `- ${s.name} (${s.role}): Worked ${s.hoursWorked}hrs, Prefers ${s.shiftPreference}`).join('\n');
    
    const prompt = `
      Goal: Optimize staff scheduling to ensure optimal patient-staff ratios and reduce fatigue.
      Input Data:
      ${staffData}

      Prompt: "Analyze the current staff roster. Identify staff members approaching high fatigue levels (over 40 hours). 
      Suggest a shift distribution plan for the next 24 hours (Morning, Afternoon, Night) that respects their preferences where possible but prioritizes patient safety and fatigue management.
      Format the output as a clean Markdown list."
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    return response.text || "Unable to generate schedule.";

  } catch (error) {
    console.error("Gemini Staffing Error:", error);
    return "Error optimizing schedule.";
  }
};

/**
 * Use Case 4: Clinical Documentation Automation (Add-on)
 * Transforms raw notes into structured medical formats (SOAP, Discharge Summary).
 */
export const generateClinicalDocumentation = async (rawNotes: string, docType: 'SOAP' | 'DISCHARGE_SUMMARY'): Promise<string> => {
  try {
    const prompt = `
      Role: Professional Medical Scribe AI.
      Task: Convert raw unstructured clinical notes into a formal ${docType === 'SOAP' ? 'SOAP Note (Subjective, Objective, Assessment, Plan)' : 'Discharge Summary'}.
      
      Constraint: 
      - Use professional medical terminology.
      - Do not hallucinate or invent patient data not present in the raw notes.
      - If information for a section is missing, explicitly state "Not mentioned in raw notes".
      - Ensure the output is formatted in clean Markdown.

      Raw Notes:
      "${rawNotes}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.1, // Very low temperature for high factual consistency
      }
    });

    return response.text || "Unable to process clinical notes.";
  } catch (error) {
    console.error("Gemini Clinical Doc Error:", error);
    return "Error processing documentation.";
  }
};