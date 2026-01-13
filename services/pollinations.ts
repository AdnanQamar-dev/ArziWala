import { FormData, ApplicationType } from '../types';

// Privacy Shield: These placeholders are sent to the AI instead of real data.
const SAFE_PLACEHOLDERS = {
  ACCOUNT_NUMBER: "[NUM_PLACEHOLDER]",
  CIF_NUMBER: "[CIF_PLACEHOLDER]",
  CONSUMER_NUMBER: "[ID_PLACEHOLDER]",
  PHONE: "[PHONE_PLACEHOLDER]",
  MOBILE_IMEI: "[IMEI_PLACEHOLDER]"
};

/**
 * THE TEXT SCRUBBER (Anti-Ad & Cleanup)
 * Removes markdown, brand names, and known artifacts to ensure professional output.
 */
const cleanAIOutput = (text: string): string => {
  return text
    .replace(/\*\*/g, '')             // Remove Markdown bold
    .replace(/#{1,6}\s?/g, '')        // Remove Heading markers
    .replace(/Generated via.*/gi, '') // Remove "Generated via..."
    .replace(/Pollinations/gi, '')    // Remove Brand
    .replace(/Ø/g, '')                // Remove specific artifacts
    .replace(/\(Ad\)/gi, '')          // Remove (Ad)
    .replace(/\[Unrelated text\]/gi, '') 
    .replace(/^\s*[-_]{3,}\s*$/gm, '') // Remove horizontal rules
    .replace(/\[?\(?Signature\)?\]?/gi, '') // Remove [Signature] or (Signature) placeholders
    .trim();
};

export const generateLetterText = async (type: ApplicationType, data: FormData, language: 'en' | 'hi'): Promise<string> => {
  
  // 1. DETERMINE CONTEXT & PLACEHOLDERS
  let specificRefNumber = '';
  
  if (type.includes('Bank') || type.includes('ATM')) {
      specificRefNumber = `Account No: ${SAFE_PLACEHOLDERS.ACCOUNT_NUMBER}`;
      if (data.cifNumber) specificRefNumber += `, CIF: ${SAFE_PLACEHOLDERS.CIF_NUMBER}`;
  } else if (type.includes('Police')) {
      specificRefNumber = `Subject: Complaint at ${data.policeStation}`;
  } else if (type.includes('Electricity')) {
      specificRefNumber = `Consumer No: ${SAFE_PLACEHOLDERS.CONSUMER_NUMBER}`;
  } else {
      specificRefNumber = "Ref: General Application";
  }

  // Build the reason content including new fields
  let extraDetails = "";
  if (data.incidentDate) extraDetails += `\nIncident Date: ${data.incidentDate} at ${data.incidentTime || 'approx time'}.`;
  if (data.incidentLocation) extraDetails += `\nLocation: ${data.incidentLocation}.`;
  if (data.vehicleDetails) extraDetails += `\nVehicle Details: ${data.vehicleDetails}.`;
  
  const reasonContent = (data.customBody || data.incidentDetails || "As per subject.") + extraDetails;
  const subjectLine = data.subject || `Application for ${type}`;

  // 2. CONSTRUCT THE STRONG, DETAILED PROMPT
  const langInstruction = language === 'hi' 
    ? "Write the letter entirely in formal HINDI (Devanagari script). Use standard formal Hindi vocabulary (e.g., 'Savinay Nivedan', 'Prarthi')." 
    : "Write the letter in formal English.";

  const prompt = `Act as a professional Indian drafter.
Write a DETAILED, formal application letter.
Subject: ${subjectLine}
Target Language: ${langInstruction}

Data Points:
- Sender: ${data.senderName} (S/o ${data.fatherName || '__________'}), ${data.senderAddress}, ${data.city}
- Contact: ${SAFE_PLACEHOLDERS.PHONE}
- Date: ${data.date}
- Recipient: ${data.recipientTitle}, ${data.recipientAddress}
- Reference: ${specificRefNumber}

MANDATORY STRUCTURE:
1. Full Address Block (From/To).
2. Professional Subject Line.
3. Body Paragraph 1: State the account/reference details clearly.
4. Body Paragraph 2: ELABORATE on the reason "${reasonContent}". Make it sound urgent and necessary.
5. Standard Closing: "I request you to kindly take necessary action." followed by "Yours faithfully," (or Hindi equivalent) and the Sender Name.

IMPORTANT: DO NOT add a "[Signature]" placeholder. Just end with the Sender Name.
DO NOT be brief. Write a full standard A4 letter.`;

  try {
    // 3. SEND TO AI
    const seed = Math.floor(Math.random() * 1000);
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Pollinations.ai');
    }
    let text = await response.text();

    // 4. CLEANUP (The Scrubber)
    text = cleanAIOutput(text);

    // 5. PRIVACY SHIELD REPLACEMENT (Client-Side)
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const replacer = (placeholder: string, actual: string) => {
        text = text.replace(new RegExp(escapeRegExp(placeholder), 'g'), actual || '__________');
    };

    replacer(SAFE_PLACEHOLDERS.ACCOUNT_NUMBER, data.accountNumber);
    replacer(SAFE_PLACEHOLDERS.CIF_NUMBER, data.cifNumber);
    replacer(SAFE_PLACEHOLDERS.CONSUMER_NUMBER, data.consumerNumber);
    replacer(SAFE_PLACEHOLDERS.PHONE, data.phone);
    replacer(SAFE_PLACEHOLDERS.MOBILE_IMEI, data.mobileDetails);

    return text;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};