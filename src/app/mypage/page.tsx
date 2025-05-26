"use client";

import { axiosUser } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function StockFilter() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [minMarketCap, setMinMarketCap] = useState<number | "">("");
  const [maxMarketCap, setMaxMarketCap] = useState<number | "">("");
  const [minPer, setMinPer] = useState<number | "">("");
  const [maxPer, setMaxPer] = useState<number | "">("");
  const [minPbr, setMinPbr] = useState<number | "">("");
  const [maxPbr, setMaxPbr] = useState<number | "">("");
  const [minDy, setMinDy] = useState<number | "">("");
  const [vsHighPrice, setVsHighPrice] = useState<number | "">("");
  const [vsLowPrice, setVsLowPrice] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [stocks, setStocks] = useState<any[]>([]);

  const buildCriteria = () => {
    const entries = Object.entries({
      minMarketCap,
      maxMarketCap,
      minPer,
      maxPer,
      minPbr,
      maxPbr,
      minDy,
      vsHighPrice,
      vsLowPrice,
    })
      .filter(([_, value]) => value != null && value !== "")
      .map(([k, v]) => [k, Number(v)]);
    if (entries.length == 0) return null;
    return Object.fromEntries(entries);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosUser.get("/user");
      const {
        criteria: {
          minMarketCap,
          maxMarketCap,
          minPer,
          maxPer,
          minPbr,
          maxPbr,
          minDy,
          vsHighPrice,
          vsLowPrice,
        },
        sub,
        email,
      } = response.data;
      setIsSubscribed(sub || "");
      setMinMarketCap(minMarketCap || "");
      setMaxMarketCap(maxMarketCap || "");
      setMinPer(minPer || "");
      setMaxPer(maxPer || "");
      setMinPbr(minPbr || "");
      setMaxPbr(maxPbr || "");
      setMinDy(minDy || "");
      setVsHighPrice(vsHighPrice || "");
      setVsLowPrice(vsLowPrice || "");
      setEmail(email || "");
    };
    fetchData();
  }, []);

  const handleApply = async () => {
    try {
      const criteria = buildCriteria();
      await axiosUser.patch("/user", {
        sub: isSubscribed,
        ...(criteria && { criteria }),
        ...(email && { email }),
      });
      alert("조건이 저장되었습니다.");
    } catch (error) {
      alert("조건 저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleTestQuery = async () => {
    const criteria = buildCriteria();
    if (!criteria) return;
    const res = await axiosUser.post("/data/recommend", criteria);
    const transformed = res.data.map((item: any) => ({
      code: item.code,
      name: item.name,
      close: item.adjClose,
      yearMaxPrice: item.yearMaxPrice,
      yearMinPrice: item.yearMinPrice,
      marketCap: Number(item.marketCap),
      per: item.per ?? "-",
      pbr: item.pbr ?? "-",
      dy: item.dy ?? "-",
      foreignRatio: item.foreignOwnRate ?? "-",
    }));

    setStocks(transformed);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 sm:p-12">
      <h1 className="text-4xl font-bold text-center sm:text-left mb-6">
        📬 이메일 알림 설정
      </h1>

      <p className="text-sm text-gray-600 mb-2">
        매일 오전 8시에 조건에 맞는 종목이 있을 경우 알림 이메일이 발송됩니다.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        조건을 사용하지 않으려면 빈칸으로 두면 됩니다.
      </p>
      <hr className="border-t-2  my-6" />
      <form className="flex flex-col gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={isSubscribed}
            onChange={(e) => setIsSubscribed(e.target.checked)}
            className="accent-blue-600"
          />
          이메일 알림 사용 여부
        </label>
        <label className="flex flex-col text-sm font-medium">
          이메일 주소
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="border p-2 rounded mt-1"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <label className="flex flex-col font-medium">
            시가총액 (원) 범위
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="최소"
                value={minMarketCap}
                onChange={(e) => setMinMarketCap(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                placeholder="최대"
                value={maxMarketCap}
                onChange={(e) => setMaxMarketCap(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
            </div>
          </label>

          <label className="flex flex-col font-medium">
            PER 범위
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="최소"
                value={minPer}
                onChange={(e) => setMinPer(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                placeholder="최대"
                value={maxPer}
                onChange={(e) => setMaxPer(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
            </div>
          </label>

          <label className="flex flex-col font-medium">
            PBR 범위
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="최소"
                value={minPbr}
                onChange={(e) => setMinPbr(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                placeholder="최대"
                value={maxPbr}
                onChange={(e) => setMaxPbr(Number(e.target.value) || "")}
                className="border p-2 rounded w-full"
              />
            </div>
          </label>

          <label className="flex flex-col font-medium">
            배당수익률 (DY) %
            <input
              type="number"
              placeholder="이상"
              value={minDy}
              onChange={(e) => setMinDy(Number(e.target.value) || "")}
              className="border p-2 rounded mt-1"
            />
          </label>

          <label className="flex flex-col font-medium">
            52주 고점 대비 하락률 (% 이상)
            <input
              type="number"
              value={vsHighPrice}
              onChange={(e) => setVsHighPrice(Number(e.target.value) || "")}
              className="border p-2 rounded mt-1"
            />
          </label>

          <label className="flex flex-col font-medium">
            52주 저점 대비 상승률 (% 이하)
            <input
              type="number"
              value={vsLowPrice}
              onChange={(e) => setVsLowPrice(Number(e.target.value) || "")}
              className="border p-2 rounded mt-1"
            />
          </label>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            적용
          </button>
          <button
            type="button"
            onClick={handleTestQuery}
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200"
          >
            현재 조건으로 종목 조회
          </button>
        </div>
      </form>

      {/* 결과 테이블 */}
      {stocks.length > 0 && (
        <table className="mt-10 w-full text-sm border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">종목코드</th>
              <th className="border px-2 py-1">종목명</th>
              <th className="border px-2 py-1">전일 종가</th>
              <th className="border px-2 py-1">52주 최고가</th>
              <th className="border px-2 py-1">52주 최저가</th>
              <th className="border px-2 py-1">시가총액</th>
              <th className="border px-2 py-1">PER</th>
              <th className="border px-2 py-1">PBR</th>
              <th className="border px-2 py-1">배당수익률</th>
              <th className="border px-2 py-1">외국인 지분율</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">{s.code}</td>
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.close}</td>
                <td className="border px-2 py-1">{s.yearMaxPrice}</td>
                <td className="border px-2 py-1">{s.yearMinPrice}</td>
                <td className="border px-2 py-1">
                  {s.marketCap.toLocaleString()}
                </td>
                <td className="border px-2 py-1">{s.per}</td>
                <td className="border px-2 py-1">{s.pbr}</td>
                <td className="border px-2 py-1">{s.dy}%</td>
                <td className="border px-2 py-1">{s.foreignRatio}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
