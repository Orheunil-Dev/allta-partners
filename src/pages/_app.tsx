import { useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useResizeHandler } from "@/hooks";
import "@/styles/globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

const BreadCrumb = dynamic(
  () => import("@/components/layout/BreadCrumb").then((mod) => mod.BreadCrumb),
  { ssr: false },
);

const Sidebar = dynamic(
  () => import("@/components/layout/Sidebar").then((mod) => mod.Sidebar),
  { ssr: false },
);

const MobileSidebar = dynamic(
  () => import("@/components/layout/Sidebar").then((mod) => mod.MobileSidebar),
  { ssr: false },
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { isMobile } = useResizeHandler();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 0 },
          mutations: { retry: 0 },
        },
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (
              error?.status === 401 &&
              error.code === "TOKEN_REFRESH_FAILED"
            ) {
              (async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });

                router.push("/login");
              })();
            }
          },
        }),
      }),
  );

  return (
    <>
      <Head>
        <title>올타 파트너스</title>
        <meta name="description" content="올타 제휴점 관리자 페이지입니다." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <div
          className={` flex w-screen h-screen  text-black ${
            router.pathname === "/login" ? "bg-partners" : "bg-[#F6F6F9]"
          } ${pretendard.className} `}
        >
          {router.pathname !== "/login" &&
            (isMobile ? (
              <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            ) : (
              <Sidebar />
            ))}

          <div className="flex flex-col md:flex-1 w-full h-full overflow-x-hidden">
            {router.pathname !== "/login" && (
              <BreadCrumb isOpen={isOpen} setIsOpen={setIsOpen} />
            )}

            <div
              className={`h-full overflow-y-auto ${
                router.pathname !== "/login" && "mt-[62px]"
              }`}
            >
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}
