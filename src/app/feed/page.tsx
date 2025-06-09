"use client";

import { redirect } from "next/navigation";
import React from "react";

function page() {
  redirect("/feed/dashboard");
  return <div></div>;
}

export default page;
