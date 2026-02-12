/**
 * Application Configuration
 * Centralized configuration for Cognito authentication and other app settings
 */

const region = "us-east-1";
const userPoolId = `us-east-1_WLiGIWTg0`;
const clientId = "5t2fpvgroc0pr5q09ud89sfvae";
const identityPoolId = "us-east-1:d86fd70c-2418-4211-bf74-2a7c67a3db97";
const cognitoDomainPrefix = "edge2-easy-report";
const domain = `https://${cognitoDomainPrefix}.auth.${region}.amazoncognito.com`;

// Cognito Configuration
export const cognitoConfig = {
    // User Pool Configuration
    region,
    userPoolId,
    identityPoolId,
    // Cognito Domain (for logout and hosted UI)

    // OIDC Configuration for react-oidc-context
    oidc: {
        authority: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        client_id: clientId,
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000",
        response_type: "code",
        scope: "phone openid profile email",
    },

    // Logout Configuration
    getLogoutUrl: () => {
        const logoutUri = typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000";
        const encodedLogoutUri = encodeURIComponent(logoutUri);
        return `${domain}/logout?client_id=${clientId}&logout_uri=${encodedLogoutUri}`;
    },
};

export default cognitoConfig;
