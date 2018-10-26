import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '668099731317-4baqud1mr58csb60bdcm23ch3tfmkuen.apps.googleusercontent.com';

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