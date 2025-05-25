"use client";

import { useState } from "react";

export default function DataQueryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [codes, setCodes] = useState("005930\n000660");
  const [isAllIssue, setIsAllIssue] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("codes", codes);
    formData.append("isAllIssue", isAllIssue ? "on" : "");

    const res = await fetch("/data/query/csv", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("CSV 다운로드 실패");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit} id="form-data-query">
      <label>
        쿼리 기간 시작일:
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <br />

      <label>
        쿼리 기간 종료일:
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <br />

      <label>
        쿼리 종목 코드 리스트
        <br />
        (각 줄에 하나씩 입력)
        <br />
        <textarea
          name="codes"
          cols={40}
          rows={7}
          value={codes}
          onChange={(e) => setCodes(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        모든 종목을 쿼리할지 여부 (체크 시 위의 리스트는 무시됨):
        <input
          type="checkbox"
          name="isAllIssue"
          checked={isAllIssue}
          onChange={(e) => setIsAllIssue(e.target.checked)}
        />
      </label>
      <br />

      <button type="submit">다운로드</button>
    </form>
  );
}
