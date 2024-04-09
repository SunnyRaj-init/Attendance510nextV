"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { auth, useAuthContext } from "/src/context/authcontext";
import { signOut } from "firebase/auth";
export default function Home() {
  const [location, setLocation] = useState();
  const [cloc, setcloc] = useState();
  const [dist, setdist] = useState();
  const [name, setname] = useState();
  const [id, setid] = useState();
  const [cid, setcid] = useState();
  const [cname, setcname] = useState();
  const isFirstRender = useRef(true);
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (user != null) {
        if (user.email.split("@")[1] === "asu.edu") {
          user.getIdTokenResult().then((idTokenResult) => {
            if (idTokenResult.claims.admin) {
              router.replace("/manage");
            }
          });
        } else {
          alert("PLEASE USE YOUR ASU EMAIL");
          signOut(auth)
            .then(() => {
              router.replace("/");
            })
            .catch((error) => {});
        }
      }
    }
  }, [user, dist, location]);
  useEffect(() => {
    const clat = (parseFloat(process.env.NEXT_PUBLIC_lat) * Math.PI) / 180;
    const clong = (parseFloat(process.env.NEXT_PUBLIC_long) * Math.PI) / 180;
    setcloc({ clat, clong });
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(latitude, longitude, "hehe");
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
      if (calcdist <= 150) {
        setdist(calcdist);
        console.log(calcdist, "calc dissst");
      }
    }
  }, [location]);
  if (location == null || location == undefined) {
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
        <p>CANNOT GET YOUR LOCATION CLICK ON ALLOW TO RETRIEVE LOCATION</p>
      </div>
    );
  } else if (dist == undefined) {
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
        <p>You are not in class</p>
      </div>
    );
  } else {
    return (
      <>
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
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
          </label>
          <br />

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Confirm Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                setcname(e.target.value);
              }}
            />
          </label>
          <br />

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Student ID</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                setid(e.target.value);
              }}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Confirm your ID</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                setcid(e.target.value);
              }}
            />
          </label>
          <br />
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => {
              if (name === cname && id === cid && name != "" && id != "") {
                const reqbody = Object({ name: name, id: id });
                fetch("/api/append", {
                  method: "POST",
                  body: JSON.stringify(reqbody),
                }).then((res) => {
                  if (res.status == "200") {
                    alert("attendance given");
                    signOut(auth)
                      .then(() => {
                        router.replace("/");
                      })
                      .catch((error) => {});
                  } else {
                    console.log(res);
                  }
                });
              } else {
                alert("INPUTS DO NOT MATCH");
              }
            }}
          >
            Mark Present
          </button>
        </div>
        <br />
      </>
    );
  }
}
