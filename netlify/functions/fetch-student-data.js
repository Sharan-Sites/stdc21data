const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get the PIN from query parameters
  const { pin } = event.queryStringParameters;
  
  if (!pin) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'PIN parameter is required' })
    };
  }

  try {
    // Make request to SBTET API
    const response = await fetch(
      `https://www.sbtet.telangana.gov.in/api/api/Results/GetConsolidatedResults?Pin=${pin}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow frontend to access
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};