"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { auth, useAuthContext } from "/src/context/authcontext";
import { signOut } from "firebase/auth";
import { unstable_noStore as noStore } from "next/cache";
export default function Home() {
  const [name, setname] = useState();
  const [id, setid] = useState();
  const [ip, setip] = useState("0.0.0.0");
  const [cid, setcid] = useState();
  const [cname, setcname] = useState();
  const isFirstRender = useRef(true);
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      noStore();
      fetch("/api/gettime", {
        method: "GET",
        cache: "no-store",
        body: JSON.stringify({ nocach: true }),
      }).then((res) => {
        res.json().then((d) => {
          console.log("TIME", d);
          if (!d.accept) {
            alert("You cannot submit now");
            signOut(auth)
              .then(() => {
                router.replace("/");
              })
              .catch((error) => {});
          }
        });
      });
      fetch("/api/ip", { method: "GET" }).then((res) => {
        res.json().then((d) => {
          setip(d.ip.replace("::ffff:", ""));
        });
      });
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
      } else {
        router.replace("/");
      }
    }
  }, [user, ip]);
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
              const reqbody = Object({ name: name, id: id, ip: ip });
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
