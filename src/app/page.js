"use client";

import { useState, useEffect } from "react";
export default function Home() {
  const [location, setLocation] = useState();
  const [cloc, setcloc] = useState();
  const [dist, setdist] = useState();
  const [name,setname] = useState();
  const [id,setid] = useState();
  const [cid,setcid]=useState();
  const [cname,setcname]=useState();
  useEffect(() => {
    const clat = (parseFloat(process.env.NEXT_PUBLIC_lat) * Math.PI) / 180;
    const clong = (parseFloat(process.env.NEXT_PUBLIC_long) * Math.PI) / 180;
    setcloc({ clat, clong });
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
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
      if (calcdist <= 100) {
        setdist(calcdist);
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
        <p>CANNOT GET YOUR LOCATION CLICK ON ALLOW TO RETRIVE LOCATION</p>
      </div>
    );
  } else if (dist == undefined) {
    return(<div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "3%",
      }}
    >
      <p>You are not in class</p>
    </div>)
  } else {
    return (
      <>
        <form
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
              onChange={(e)=>{setname(e.target.value)}}
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
              onChange={(e)=>{setcname(e.target.value)}}
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
              onChange={(e)=>{setid(e.target.value)}}
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
              onChange={(e)=>{setcid(e.target.value)}}
            />
          </label>
          <br />
          <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg" onClick={()=>{console.log(name,cname,id,cid)}}>Submit</button>
        </form>
        <br/>
      </>
    );
  }
}
