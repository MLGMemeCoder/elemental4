import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = 'your_google_client_id_which_i_have_just_now_removed_and_revoked.apps.googleusercontent.com';

export async function verifyGoogleToken(token: string) {
    const client = new OAuth2Client(CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload.sub;
        return userid;
    } catch {
        return null;
    }

}
