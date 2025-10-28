import { _GOOGLE_CLIENT_ID, _GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { google } from 'googleapis';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const redirectUrl = url.origin + url.pathname;

  if (url.searchParams.size <= 0) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: _GOOGLE_CLIENT_ID,
      redirect_uri: redirectUrl,
      scope:
        'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    redirect(307, `https://accounts.google.com/o/oauth2/auth?${params}`);
  } else if (url.searchParams.has('error')) {
    console.error(url.searchParams.get('error'));
    return error(400, 'An error has occurred.');
  } else {
    const code = url.searchParams.get('code');

    if (!code) return error(400, 'No code received. Please try again.');

    const oauth2Client = new google.auth.OAuth2(
      _GOOGLE_CLIENT_ID,
      _GOOGLE_CLIENT_SECRET,
      redirectUrl,
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = (await oauth2.userinfo.get()).data;
    cookies.set('google_oauth_info', JSON.stringify(userInfo), {
      path: '/',
      maxAge: 300,
    });

    redirect(303, '/register?oauth');
  }
};
