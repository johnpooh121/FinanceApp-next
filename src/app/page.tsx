"use client";

import { axiosUser } from "@/lib/axios";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosUser.post("/auth/refresh", {}, {});
      localStorage.setItem("bearer", response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-10 font-[family-name:var(--font-geist-sans)] h-full">
      <header className="row-start-1 row-end-2 bg-amber-400 text-4xl">
        금융 정보제공 시스템
      </header>
      <main className=" bg-sky-700 "></main>
    </div>
  );
}
