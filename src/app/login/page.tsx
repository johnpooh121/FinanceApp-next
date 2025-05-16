import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[80vh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h6>Finance App</h6>
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly. ff
            </li>
          </ol>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link href="https://kauth.kakao.com/oauth/authorize?client_id=a0bd433cad4a4e6568c04622ea8a880a&redirect_uri=http://finance-app.ap-northeast-2.elasticbeanstalk.com/auth/kakao/callback&response_type=code">
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
