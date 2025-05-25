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
    dayjs().utcOffset(9).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().utcOffset(9).format("YYYY-MM-DD")
  );
  const [codes, setCodes] = useState("005930&#13;&#10;000660");
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosUser.post("/auth/refresh", {}, {});
      localStorage.setItem("bearer", response.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    console.log(startDate);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("codes", codes);
    formData.append("isAllIssue", String(isAll));

    console.log(formData);
    console.log(String(formData));
    const res = await axiosUser(`${BE_ENDPOINT}/data/query/csv`, {
      method: "POST",
      data: { startDate, endDate, codes, isAllIssue: isAll },
      headers: {
        authorization: localStorage.getItem("bearer") ?? "",
      },
      responseType: "blob",
    });

    if (res.status !== 201) {
      alert("CSV 다운로드 실패");
      return;
    }

    const blob = new Blob([res.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl">데이터 다운로드</h1>
        <ol className="list-inside list-disc text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            KOSPI, KOSDAQ의 원하는 종목을 원하는 기간에 맞춰서 다운로드할 수
            있습니다.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            각 유저는 매월 4,000,000 개의 쿼터를 할당받습니다.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            데이터를 다운로드할 때마다 쿼터에서 데이터의 행(row)수가 차감됩니다.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            각 행의 구조 : 일자 | ISIN | 단축코드 | 종목명 | 시장구분 | 수정종가
            | 시가 | 저가 | 고가 | 대비 | 등락률 | 거래량 | 거래대금 | 시가총액
            | 주식 수 | EPS | PER | BPS | PBR | DPS | DY | 외국인 | 보유량 |
            외국인 | 지분율 | 외국인 | 한도수량 | 외국인 | 한도소진율 | 소속부
          </li>
        </ol>
        <hr className="border-2 w-full" />

        <div className="flex gap-4 items-center flex-col sm:flex-col">
          <form
            method="post"
            action={`${BE_ENDPOINT}/data/query/csv`}
            onSubmit={handleSubmit}
          >
            <div className="flex-row">
              <label className="flex-row">
                쿼리 기간 시작일:{" "}
                <input
                  name="startDate"
                  id="input-startDate"
                  type="date"
                  className="border-2"
                  onChange={(e) => setStartDate(e.target.value)}
                  defaultValue={startDate}
                />
              </label>
              <label>
                쿼리 기간 종료일:{" "}
                <input
                  name="endDate"
                  id="input-endDate"
                  type="date"
                  className=" border-2"
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={endDate}
                />
              </label>
            </div>
            <label>
              쿼리 종목 코드 리스트 ( 각 줄에 하나씩 입력 ){" "}
              <textarea
                name="codes"
                id="input-codes"
                defaultValue={codes}
                className="border-2"
                onChange={(e) => setCodes(e.target.value)}
              ></textarea>{" "}
            </label>
            <label>
              모든 종목을 쿼리할지 여부 (체크 시 위의 리스트는 무시됨) :{" "}
              <input
                name="isAllIssue"
                id="input-isAllIssue"
                type="checkbox"
                className="border-2"
                defaultChecked={isAll}
                onChange={(e) => setIsAll(e.target.value === "on")}
              />
            </label>
            <button type="submit" id="download" className="border-2">
              다운로드
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
