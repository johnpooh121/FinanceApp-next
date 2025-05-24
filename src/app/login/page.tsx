import { BE_ENDPOINT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="grid grid-rows-3 items-center justify-items-center min-h-[80vh] align-middle font-[family-name:var(--font-geist-sans)] m-3 max-h-[80vh]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-4xl">금융 정보제공 시스템</h1>
          <ol className="list-inside list-disc text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              국내 주식에 대해 일자별 종가, 거래량, 외국인 보유량, PER 등의
              수치들을 csv로 다운로드할 수 있습니다.
            </li>
            <li className="mb-2 tracking-[-.01em]">
              52주 저가&고가 대비 현재가, 배당 수익률 등에 대해 나만의 기준을
              만들어서 매일 부합하는 종목을 알려주는 알림을 설정할 수 있습니다.
            </li>
            <li className="mb-2 tracking-[-.01em]">
              지표 별 기준 설정 후 부합하는 종목들을 살펴볼 수 있습니다.
            </li>
          </ol>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              href={`https://kauth.kakao.com/oauth/authorize?client_id=a0bd433cad4a4e6568c04622ea8a880a&redirect_uri=${BE_ENDPOINT}/auth/kakao/callback/next&response_type=code`}
            >
              <Image
                className="dark:invert"
                src="/kakao_login.png"
                alt="kakao login"
                width={183}
                height={45}
              />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
