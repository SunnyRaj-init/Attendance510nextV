"use client";
import { useAuthContext } from "/src/context/authcontext";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "/src/context/authcontext";
export default function page() {
  const isFirstRender = useRef(true);
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (user != null) {
        user.getIdTokenResult().then((idTokenResult) => {
          if (!idTokenResult.claims.admin) {
            signOut(auth)
              .then(() => {
                router.replace("/");
              })
              .catch((error) => {});
          }
        });
      } else {
        router.replace("/");
      }
    }
  }, [user]);
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
      Welcome Admin
      <br />
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => {
          router.replace("/manage/data");
        }}
      >
        Manage Data
      </button>
      <br />
      <button
        className="btn btn-sm btn-secondary"
        onClick={(e) => {
          signOut(auth)
            .then(() => {
              router.replace("/");
            })
            .catch((error) => {});
        }}
      >
        logout
      </button>
    </div>
  );
}
