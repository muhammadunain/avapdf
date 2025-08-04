import { GoogleGenerativeAI } from '@google/generative-ai'
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


export async function analyzeDocumentWithGemini(text: string, filename: string) {
   if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
    }
  console.log('✅ API key found, initializing Gemini...');
  const result = generateText({  model: google('gemini-1.5-flash'),
prompt: `
    Analyze this PDF document content and extract structured data points. 
    Document: ${filename}
    Content: ${text}

    Please provide a JSON response with the following structure:
    {
      "summary": "Brief summary of the document",
      "documentType": "Type of document (invoice, report, contract, etc.)",
      "keyInsights": ["insight1", "insight2", "insight3"],
      "dataPoints": [
        {
          "id": "unique_id",
          "content": "extracted content",
          "type": "text|table|header|list|financial|date",
          "pageNumber": 1,
          "position": {"x": 0, "y": 0},
          "confidence": 0.95,
          "metadata": {
            "category": "category_name",
            "subcategory": "subcategory_name",
            "format": "format_type"
          }
        }
      ]
    }

    Focus on extracting:
    - Important text sections
    - Tables and structured data
    - Headers and titles
    - Financial figures
    - Dates and deadlines
    - Lists and bullet points
    - Contact information
    - Legal clauses or terms

    Ensure each data point has accurate positioning information and confidence scores.
  `
   })
   
   try {
    console.log('📤 Sending request to Gemini...');
    // const result = await model.generateContent(prompt)
    const response = (await result).text;
    // const geminiText  = await response.text()
    
    // Clean and parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    console.log('✅ Response received from Gemini');
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Gemini analysis error:', error)
    throw error
  }
}

export async function generateTransactionSuggestions(dataPoints: any[]) {
   if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
    }
   console.log('✅ Response received from Gemini');

  const result = generateText({ model: google('gemini-1.5-flash'),
  prompt :`
    Based on these extracted data points, suggest transaction steps for processing this document:
    ${JSON.stringify(dataPoints, null, 2)}

    Provide a JSON response with suggested transaction steps:
    {
      "transactions": [
        {
          "id": "unique_id",
          "title": "Step Title",
          "description": "Step description",
          "transactionType": "extract|categorize|validate|export",
          "estimatedTime": "2 minutes",
          "dataPointIds": ["id1", "id2"]
        }
      ]
    }

    Suggest logical workflow steps like:
    1. Data Extraction and Categorization
    2. Financial Data Validation
    3. Contact Information Processing
    4. Document Classification
    5. Export and Summary Generation
  `
   })

 

  try {
    console.log('📤 Sending request to Gemini...');

    // const result = await model.generateContent(prompt)
    const response = (await result).text
    // const text = response.text()
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    console.log('✅ Response received from Gemini');
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Transaction suggestion error:', error)
    return {
      transactions: [
        {
          id: 'default-1',
          title: 'Extract and Categorize Data',
          description: 'Organize extracted data points by category',
          transactionType: 'categorize',
          estimatedTime: '1 minute',
          dataPointIds: dataPoints.map(dp => dp.id)
        }
      ]
    }
  }
}