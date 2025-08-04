import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { query, content, documentName } = await request.json();

    if (!query || !content) {
      return Response.json(
        { error: 'Query and content are required' },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: `You are an expert AI document analyst with advanced comprehension capabilities. Your role is to help users understand and extract insights from their PDF documents.

CAPABILITIES:
- Provide detailed, accurate analysis of document content
- Extract key insights, patterns, and important information
- Answer specific questions about the document
- Summarize complex information clearly
- Identify relationships between different parts of the document
- Highlight important data, statistics, and findings

RESPONSE STYLE:
- Be thorough but concise
- Use formatting (bold, bullet points, etc.) to make responses readable
- Provide specific examples and quotes from the document when relevant
- If information isn't in the document, clearly state that
- Always be helpful and professional

DOCUMENT CONTEXT:
Document Name: ${documentName || 'Uploaded Document'}
Content Length: ${content.length} characters

Now analyze the user's question based on the document content provided.`,
      messages: [
        {
          role: 'user',
          content: `Please analyze this document and answer my question:

DOCUMENT CONTENT:
${content}

QUESTION: ${query}`
        }
      ],
      maxTokens: 1500,
    });

    return Response.json({ response: result.text });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: 'Failed to analyze the document. Please try again.' },
      { status: 500 }
    );
  }
}