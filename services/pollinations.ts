import { FormData, ApplicationType, Language } from '../types';

// Privacy Shield: These placeholders are sent to the AI instead of real data.
const SAFE_PLACEHOLDERS = {
  ACCOUNT_NUMBER: "[NUM_PLACEHOLDER]",
  CIF_NUMBER: "[CIF_PLACEHOLDER]",
  CONSUMER_NUMBER: "[ID_PLACEHOLDER]",
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

export const generateLetterText = async (type: ApplicationType, data: FormData, language: Language): Promise<string> => {
  
  // 1. DETERMINE CONTEXT & PLACEHOLDERS
  let specificRefNumber = '';
  
  switch (type) {
    case ApplicationType.BANK_TRANSFER:
    case ApplicationType.ATM_ISSUE:
      specificRefNumber = `Account No: ${SAFE_PLACEHOLDERS.ACCOUNT_NUMBER}`;
      if (data.cifNumber) specificRefNumber += `, CIF: ${SAFE_PLACEHOLDERS.CIF_NUMBER}`;
      break;
    case ApplicationType.POLICE_COMPLAINT:
      specificRefNumber = "Ref: New Complaint";
      break;
    case ApplicationType.ELECTRICITY_METER:
      specificRefNumber = `Consumer No: ${SAFE_PLACEHOLDERS.CONSUMER_NUMBER}`;
      break;
    default:
      specificRefNumber = "Ref: General Application";
      break;
  }

  const reasonContent = data.customBody || data.incidentDetails || "As per subject.";
  const subjectLine = data.subject || `Application for ${type}`;

  // 2. CONSTRUCT THE STRONG, DETAILED PROMPT
  // This matches the requested strict structure.
  const prompt = `Act as a professional Indian drafter.
Write a DETAILED, comprehensive formal application letter.
Subject: ${subjectLine}
Input Language: ${language} (Translate to formal ${language} if needed).

Data Points:
- Sender: ${data.senderName}, ${data.senderAddress}, ${data.city}
- Date: ${data.date}
- Recipient: ${data.recipientTitle}, ${data.recipientAddress}
- Reference: ${specificRefNumber}

MANDATORY STRUCTURE:
1. Full Address Block (From/To).
2. Professional Subject Line.
3. Body Paragraph 1: State the account/reference details clearly (${specificRefNumber}).
4. Body Paragraph 2: ELABORATE on the reason "${reasonContent}". Make it sound urgent and necessary. Expand this section to at least 3 sentences.
5. Standard Closing: "I request you to kindly process this immediately." followed by "Yours faithfully," and the Sender Name.

IMPORTANT: DO NOT add a "[Signature]" placeholder. Just end with the Sender Name.

DO NOT be brief. Write a full standard A4 letter. Use "__________" for missing details.`;

  try {
    // 3. SEND TO AI
    // We use a random seed to ensure some variety if the user regenerates
    const seed = Math.floor(Math.random() * 1000);
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Pollinations.ai');
    }
    let text = await response.text();

    // 4. CLEANUP (The Scrubber)
    text = cleanAIOutput(text);

    // 5. PRIVACY SHIELD REPLACEMENT (Client-Side)
    // We replace the placeholders with the actual sensitive data HERE, so AI never saw it.
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (data.accountNumber) {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.ACCOUNT_NUMBER), 'g'), data.accountNumber);
    } else {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.ACCOUNT_NUMBER), 'g'), '__________');
    }

    if (data.cifNumber) {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.CIF_NUMBER), 'g'), data.cifNumber);
    } else {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.CIF_NUMBER), 'g'), '');
    }

    if (data.consumerNumber) {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.CONSUMER_NUMBER), 'g'), data.consumerNumber);
    } else {
      text = text.replace(new RegExp(escapeRegExp(SAFE_PLACEHOLDERS.CONSUMER_NUMBER), 'g'), '__________');
    }

    return text;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};