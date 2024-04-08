"use client";
import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authcontext";
import { auth } from "@/context/authcontext";
export default function page() {
  const [usekey, setkey] = useState("");
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
    const functions = getFunctions();
    const addAdminRole = httpsCallable(functions, "addAdminRole");
    auth.useDeviceLanguage();
    signInWithPopup(auth, provider)
      .then((result) => {
        result.user.getIdTokenResult().then((idTokenResult) => {
          if (!idTokenResult.claims.admin) {
            console.log("admin false");
            addAdminRole({ email: result.user.email }).then((res) => {
              alert("role added");
            });
          }
        });
      })
      .catch((error) => {
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
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Secret Key</span>
        </div>
        <input
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setkey(e.target.value);
          }}
          disabled={usekey === process.env.NEXT_PUBLIC_skey}
        />
      </label>
      <br />
      {usekey === process.env.NEXT_PUBLIC_skey && (
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
      )}
    </div>
  );
}
