import React from "react";

export default async function Custom403() {
  return (
    <div className="container">
      <div className="grid min-h-screen place-content-center">
        <div className="flex flex-col items-center">
          <div className="my-4 text-center">
            <h1 className="text-4xl">403 - Unauthorized</h1>
            <p className="">Please sign out and then sign it as admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
