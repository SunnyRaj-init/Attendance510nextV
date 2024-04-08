"use client";

import { useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "/src/context/authcontext";
import { useAuthContext } from "/src/context/authcontext";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    if (user != null) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
          router.replace("/manage");
        } else {
          router.replace(`/${user.uid}`);
        }
      });
    }
  }, [user]);
  const gsignin = (e) => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken
        // The signed-in user info.
        // const user = result.user
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        router.replace(`/${result.user.uid}`);
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code
        // const errorMessage = error.message
        // The email of the user's account used.
        // const email = error.customData.email
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
        alert(error.message);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "3%",
      }}
    >
      <button
        className="btn"
        onClick={(e) => {
          gsignin(e);
        }}
      >
        Sign in with Google
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          width={"24px"}
          height={"24px"}
        >
          <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
      </button>
    </div>
  );
}
