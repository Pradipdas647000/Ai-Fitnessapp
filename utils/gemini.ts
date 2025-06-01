import * as FileSystem from 'expo-file-system';

/**
 * Gemini API integration
 * 
 * Note: As of July 12, 2024, Gemini 1.0 Pro Vision has been deprecated.
 * This implementation uses gemini-1.5-flash which supports both text and image inputs.
 */

// Function to handle direct base64 image data
export async function getGeminiResponseWithBase64(prompt: string, base64Image: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  // Using gemini-1.5-flash which supports both text and image inputs
  const modelName = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  console.log('Using base64 image data directly, length:', base64Image.length);

  const parts = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      }
    },
    { text: prompt }
  ];

  const body = {
    contents: [{ parts }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      console.error('Gemini API error:', data.error);
      return `Error: ${data.error?.message || 'Unknown error'}`;
    }
    
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, there was an error processing your request.';
  }
}

export async function getGeminiResponse(prompt: string, imageUri?: string | null): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  // Use gemini-1.5-flash for both text and image inputs as it supports multimodal content
  const modelName = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  let parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: prompt }];

  // If an image is provided, add it to the parts array
  if (imageUri) {
    try {
      console.log('Attempting to read image from URI:', imageUri);
      
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log('File exists:', fileInfo.exists, 'File info:', fileInfo);
      
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }
      
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('Successfully read image, base64 length:', base64Image.length);

      // Add the image to the parts array
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg', // Adjust based on your image type
          data: base64Image,
        }
      });
    } catch (error) {
      console.error('Error reading image file:', error);
      // Continue without the image if there's an error
    }
  }

  const body = {
    contents: [{ parts }]
  };

  try {
    console.log('Sending request to Gemini API:', url);
    console.log('Request body:', JSON.stringify(body));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      console.error('Gemini API error:', data.error);
      return `Error: ${data.error?.message || 'Unknown error'}`;
    }
    
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, there was an error processing your request.';
  }
}