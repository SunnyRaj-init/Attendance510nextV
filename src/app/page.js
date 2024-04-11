"use client";

import { useEffect, useState, useRef } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "/src/context/authcontext";
import { useAuthContext } from "/src/context/authcontext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { unstable_noStore as noStore } from "next/cache";
export default function Home() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [acc, setacc] = useState();
  const [location, setLocation] = useState();
  const [cloc, setcloc] = useState();
  const [dist, setdist] = useState();
  const [coords, setcoords] = useState();
  const [tim, settim] = useState();
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (user != null) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
          router.replace("/manage");
        } else {
          noStore();
          fetch("/api/gettime", {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({ nocach: true }),
          }).then((res) => {
            res.json().then((d) => {
              console.log("TIMEE", d);
              if (!d.accept) {
                alert("You cannot submit now");
                signOut(auth)
                  .then(() => {
                    router.replace("/");
                  })
                  .catch((error) => {});
              } else {
                router.replace(`/${user.uid}`);
              }
            });
          });
        }
      });
    } else if (isFirstRender.current) {
      noStore();
      fetch("/api/gettime", {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({ nocach: true }),
      }).then((res) => {
        res.json().then((d) => {
          console.log("TIMEE", d);
          if (!d.accept) {
            settim(false);
          } else {
            settim(true);
          }
        });
      });
      const k = prompt(
        "This website collects your IP, Location. Enter YES if you accept the terms and to continue."
      );
      if (k === "YES" || k === "Yes" || k === "yes" || k === "Y" || k === "y") {
        setacc(true);
      } else {
        setacc(false);
      }
    }
    isFirstRender.current = false;
  }, [user]);
  useEffect(() => {
    const clat = (parseFloat(process.env.NEXT_PUBLIC_lat) * Math.PI) / 180;
    const clong = (parseFloat(process.env.NEXT_PUBLIC_long) * Math.PI) / 180;
    setcloc({ clat, clong });
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setcoords(latitude + " " + longitude);
        const lat = (latitude * Math.PI) / 180;
        const long = (longitude * Math.PI) / 180;
        setLocation({ lat, long });
      });
    }
  }, []);
  useEffect(() => {
    // Fetch data from API if `location` object is set
    if (location) {
      const calcdist = parseFloat(
        Math.acos(
          Math.sin(cloc.clat) * Math.sin(location.lat) +
            Math.cos(cloc.clat) *
              Math.cos(location.lat) *
              Math.cos(cloc.clong - location.long)
        ) * 6371000
      );
      if (calcdist < 120) {
        setdist(calcdist);
        console.log(calcdist, "calc dissst");
      }
      console.log(calcdist, "calc dissst", coords);
    }
  }, [location]);
  const gsignin = (e) => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    signInWithPopup(auth, provider)
      .then((result) => {
        result.user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            router.replace("/manage");
          } else {
            router.replace(`/${result.user.uid}`);
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
      {acc && dist != undefined && tim && (
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
      {acc && dist == undefined && tim && (
        <p>
          You are not in class! Your coordinates are :{" "}
          {coords == "" ? <p>Loading</p> : coords}
        </p>
      )}
      {acc && dist == undefined && !tim && <p>You cannot submit now</p>}
      {acc && dist != undefined && !tim && (
        <p>
          Please wait you can only submit when the profesor opens up the form
        </p>
      )}
      {!acc && (
        <p>
          Contact the Instructor since you do not agree with the terms on which
          the website works
        </p>
      )}
    </div>
  );
}
