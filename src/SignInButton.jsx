import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./Config";
import Button from "react-bootstrap/Button";


/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <Button type="button" class="btn btn-primary" onClick={() => handleLogin("popup")}>Sign In</Button>
    );
}