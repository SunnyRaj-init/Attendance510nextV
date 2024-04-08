"use client";

export default function page() {
  const { user } = useAuthContext();
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
      page
    </div>
  );
}
