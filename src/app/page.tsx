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
    <div className="grid grid-rows-3 items-center justify-items-center max-h-[80vh] align-middle font-[family-name:var(--font-geist-sans)] m-3">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl">금융 정보제공 시스템</h1>
        <ul className="list-inside list-none text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <a href="/download" className="w-full">
            <li className="mb-2 tracking-[-.01em] border-2 border-double rounded-lg hover:bg-green-50 focus:bg-green-50 active:bg-green-50  p-5">
              주식 데이터 다운로드(KOSPI / KOSDAQ) 바로가기{"\t"}
            </li>
          </a>

          <a href="/mypage" className="w-full">
            <li className="mb-2 tracking-[-.01em] border-2 border-double rounded-lg hover:bg-green-50 focus:bg-green-50 active:bg-green-50  p-5">
              알림 설정 바로가기{"\t"}
            </li>
          </a>
        </ul>
      </main>
    </div>
  );
}
