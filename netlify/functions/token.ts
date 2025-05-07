import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

export const handler: Handler = async () => {
  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');
  body.append('client_id', process.env.CTP_CLIENT_ID!);
  body.append('client_secret', process.env.CTP_CLIENT_SECRET!);
  body.append('scope', 'manage_project:your-project-key');

  const response = await fetch(
    'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  const data = await response.json();
  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
