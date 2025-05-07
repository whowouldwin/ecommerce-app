import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

let cachedToken: { token: string; expiresAt: number } | null = null;

interface TokenResponse {
  access_token: string;
  expires_in: number;
  error_description?: string;
  [key: string]: unknown;
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');
  body.append('client_id', process.env.CTP_CLIENT_ID!);
  body.append('client_secret', process.env.CTP_CLIENT_SECRET!);
  body.append('scope', process.env.SCOPE!);

  console.log('Client ID:', process.env.CTP_CLIENT_ID);
  console.log('Client Secret exists:', !!process.env.CTP_CLIENT_SECRET);
  console.log('Scope:', process.env.SCOPE);

  const res = await fetch(
    'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  );

  const data = (await res.json()) as TokenResponse;

  if (!res.ok) {
    throw new Error(`Auth error: ${data.error_description || res.statusText}`);
  }

  const expiresIn = data.expires_in ?? 300;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + expiresIn * 1000 - 5000,
  };

  return data.access_token;
}

export const handler: Handler = async (event) => {
  try {
    const token = await getAccessToken();

    const path = event.queryStringParameters?.path;
    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "path" query parameter' }),
      };
    }

    const method = event.httpMethod;
    const projectKey = process.env.CTP_PROJECT_KEY!;
    const url = `https://api.europe-west1.gcp.commercetools.com/${projectKey}/${path}`;

    const ctRes = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(method) ? event.body : undefined,
    });

    const responseBody = await ctRes.text();

    return {
      statusCode: ctRes.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: responseBody,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    };
  }
};
