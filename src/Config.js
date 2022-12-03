export const config = {
    auth: {
        clientId: "ce4556ff-00c1-45ce-80e1-7ae069267435",
        authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: `${window.location.origin}`,
        // redirectUri: "https://neilsapno.github.io/lista-qr",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

let accountId = "";


// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: [
        'profile',
        'User.Read',
        'email'
    ]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};