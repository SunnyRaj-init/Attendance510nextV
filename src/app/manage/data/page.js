"use client";
import { json2csv } from "json-2-csv";
import { useAuthContext } from "/src/context/authcontext";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "/src/context/authcontext";
function page() {
  const [start, setstart] = useState();
  const [end, setend] = useState();
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
      <button
        className="btn btn-active btn-secondary"
        onClick={() => {
          fetch("/api/retdata", { method: "POST" }).then((res) => {
            res.json().then((d) => {
              const res = json2csv(d.result.rows);
              let link = document.createElement("a");
              const blob = new Blob([res], {
                type: "text/csv;charset=utf-8;",
              });
              if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "yonks.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            });
          });
        }}
      >
        Download data
      </button>
      <br />
      <br />
      <br />
      <button
        className="btn btn-md btn-active btn-secondary"
        onClick={() => {
          const k = prompt("are you sure you want to delete the data?");
          if (k === "YES") {
            fetch("/api/remdata", { method: "POST" }).then((res) => {
              if (res.status == "200") {
                alert("data deleted");
              }
            });
          }
        }}
      >
        Delete Data
      </button>
      <br />
      <br />
      <br />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Start time?</span>
          <span className="label-text-alt">FORMAT: HH:MM:SS</span>
        </div>
        <input
          type="text"
          placeholder="Enter Start Time"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setstart(e.target.value);
          }}
        />
      </label>
      <br />
      <br />
      <br />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">End time?</span>
          <span className="label-text-alt">FORMAT: HH:MM:SS</span>
        </div>
        <input
          type="text"
          placeholder="Enter End Time"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setend(e.target.value);
          }}
        />
      </label>
      <br />
      <button
        className="btn btn-active btn-secondary"
        onClick={() => {
          const reqbody = Object({ start: start, end: end });
          fetch("/api/changetime", {
            method: "POST",
            body: JSON.stringify(reqbody),
          }).then((res) => {
            if (res.status == "200") {
              alert("time updated");
              router.replace("/manage");
            }
          });
        }}
      >
        Update time
      </button>
      <br />
      <br />
      <button
        className="btn btn-active btn-secondary"
        onClick={() => {
          signOut(auth)
            .then(() => {
              router.replace("/");
            })
            .catch((error) => {});
        }}
      >
        log out
      </button>
    </div>
  );
}

export default page;
