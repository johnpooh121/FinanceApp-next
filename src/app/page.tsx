"use client";

import { axiosUser } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [sessionInfo, setSessionInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosUser.post("/auth/refresh", {}, {});
      localStorage.setItem("bearer", response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-10 font-[family-name:var(--font-geist-sans)] h-full bg-green-300">
      <header className="row-start-1 row-end-2 bg-amber-400 text-4xl">
        금융 정보제공 시스템
      </header>
      <main className=" bg-sky-700 "></main>
    </div>
  );
}
