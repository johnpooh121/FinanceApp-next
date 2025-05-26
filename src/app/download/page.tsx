"use client";

import { axiosUser } from "@/lib/axios";
import { BE_ENDPOINT } from "@/lib/constants";
import dayjs from "dayjs";
// import Form from "next/form";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";

dayjs.extend(utc);

export default function Download() {
  const [startDate, setStartDate] = useState(
    dayjs().utcOffset(9).subtract(7, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().utcOffset(9).format("YYYY-MM-DD")
  );
  const [codes, setCodes] = useState("005930\n000660");
  const [isAll, setIsAll] = useState(false);
  const [quota, setQuota] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosUser.post("/auth/refresh", {}, {});
      localStorage.setItem("bearer", response.data);
      const { data } = await axiosUser.get("/user");
      setQuota(data.quota ?? null);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: newBearer } = await axiosUser.post("/auth/refresh", {}, {});
    localStorage.setItem("bearer", newBearer);

    const formData = new FormData();
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("codes", codes);
    formData.append("isAllIssue", String(isAll));

    const res = await fetch(`${BE_ENDPOINT}/data/query/csv`, {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, codes, isAllIssue: isAll }),
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("bearer") ?? "",
      },
      credentials: "include",
    });

    if (!res.ok || !res.body) {
      throw new Error("다운로드에 실패하였습니다");
    }

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const blob = new Blob(chunks, { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `kr-stock-${dayjs().utcOffset(9).format("YYYY-MM-DD--HH-mm-ss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const { data } = await axiosUser.get("/user");
    setQuota(data.quota ?? null);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center px-8 pb-20 pt-8 gap-16 sm:px-20 font-geist-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          데이터 다운로드 💾
        </h1>

        <ol className="list-inside list-disc text-sm leading-6 text-center sm:text-left font-geist-mono">
          <li className="mb-2 tracking-tight">
            KOSPI, KOSDAQ의 원하는 종목을 원하는 기간에 맞춰서 다운로드할 수
            있습니다.
          </li>
          <li className="mb-2 tracking-tight">
            각 유저는 매월 4,000,000 개의 쿼터를 할당받습니다.
          </li>
          <li className="mb-2 tracking-tight">
            데이터를 다운로드할 때마다 쿼터에서 데이터의 행(row)수가 차감됩니다.
          </li>
          <li className="mb-2 tracking-tight">
            각 행의 구조 : 일자 | ISIN | 단축코드 | 종목명 | 시장구분 | 수정종가
            | 시가 | 저가 | 고가 | 대비 | 등락률 | 거래량 | 거래대금 | 시가총액
            | 주식 수 | EPS | PER | BPS | PBR | DPS | DY | 외국인 | 보유량 |
            외국인 | 지분율 | 외국인 | 한도수량 | 외국인 | 한도소진율 | 소속부
          </li>
        </ol>

        <hr className="border-t-2 w-full" />

        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex flex-col text-sm font-medium">
                시작일
                <input
                  name="startDate"
                  id="input-startDate"
                  type="date"
                  className="border border-gray-300 rounded-md p-2 mt-1"
                  onChange={(e) => setStartDate(e.target.value)}
                  defaultValue={startDate}
                />
              </label>

              <label className="flex flex-col text-sm font-medium">
                종료일
                <input
                  name="endDate"
                  id="input-endDate"
                  type="date"
                  className="border border-gray-300 rounded-md p-2 mt-1"
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={endDate}
                />
              </label>
            </div>

            <label className="flex flex-col text-sm font-medium">
              가져올 종목 코드 리스트 (각 줄에 하나씩 입력)
              <textarea
                name="codes"
                id="input-codes"
                className="border border-gray-300 rounded-md p-2 mt-1 h-32 resize-none"
                defaultValue={codes}
                onChange={(e) => setCodes(e.target.value)}
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                name="sub"
                id="input-sub"
                type="checkbox"
                className="accent-blue-600"
                defaultChecked={isAll}
                onChange={(e) => setIsAll(e.target.checked)}
              />
              모든 종목을 다 불러올지 (체크 시 위의 리스트는 무시됨)
            </label>
            {quota !== null && (
              <p className="text-sm text-gray-700 font-medium">
                현재 남은 쿼터:{" "}
                <span className="font-bold text-blue-600">
                  {quota.toLocaleString()}
                </span>{" "}
                rows
              </p>
            )}
            <button
              type="submit"
              id="download"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              다운로드
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
