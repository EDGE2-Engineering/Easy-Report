/**
 * Application Configuration
 * Centralized configuration for Cognito authentication and other app settings
 */

const region = "us-east-1";
const userPoolId = `us-east-1_xsOQtWaRa`;
const clientId = "67ontc525pu0gvmnab7buklhmi";
const identityPoolId = "us-east-1:ba292155-da3e-4dce-8bbe-16fc5f519206";
const cognitoDomainPrefix = "edge2";
const domain = `https://${cognitoDomainPrefix}.auth.${region}.amazoncognito.com`;

const origin_url = window.location.href.replace(window.location.search, ""); // or "http://localhost:3000"

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
        redirect_uri: typeof window !== 'undefined' ? origin_url : "http://localhost:3000",
        response_type: "code",
        scope: "phone openid profile email",
    },

    // Logout Configuration
    getLogoutUrl: () => {
        const logoutUri = typeof window !== 'undefined' ? origin_url : "http://localhost:3000";
        const encodedLogoutUri = encodeURIComponent(logoutUri);
        return `${domain}/logout?client_id=${clientId}&logout_uri=${encodedLogoutUri}`;
    },
};

export default cognitoConfig;
