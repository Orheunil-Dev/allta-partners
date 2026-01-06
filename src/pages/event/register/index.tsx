import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useNoticeControllerRegisterNotice } from "@/api/notice/notice";
import { RegisterNoticeRequest, UpdateNoticeRequest } from "@/api/models";
import { Callout } from "@/components/ui/Callout";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NoticeDetail() {
  const router = useRouter();

  const [notice, setNotice] = useState<RegisterNoticeRequest>({
    title: "",
    content: "",
  });

  // 공지사항 등록 API
  const {
    mutate: registerNotice,
    isPending: registerNoticeLoading,
    isError: registerNoticeError,
  } = useNoticeControllerRegisterNotice();

  const handleChange = (key: keyof UpdateNoticeRequest, value: any) => {
    setNotice((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 공지사항 등록
  const handleRegister = () => {
    registerNotice(
      {
        data: {
          ...notice,
        },
      },
      {
        onSuccess: (res) => {
          alert("공지사항이 등록되었습니다.");

          return router.push(`${res.noticeId}`);
        },
        onError: (error: any) => {
          console.error(error);

          return alert(
            error.message ?? "공지사항 수정 중 오류가 발생했습니다."
          );
        },
      }
    );
  };

  return (
    <div className="p-[40px]">
      <div className="flex flex-col">
        <Callout>
          <div className="px-[12px]">
            <p className="text-[16px] font-semibold">공지사항</p>

            <div className="grid grid-cols-[120px_1fr] items-center w-full pt-[16px] gap-y-[32px]">
              <p className="text-gray5 text-[14px] font-semibold">제목</p>
              <input
                value={notice.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="max-w-[448px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] w-full pt-[16px] pb-[60px]">
              <p className="text-gray5 text-[14px] font-semibold">내용</p>
              <ReactQuill
                theme="snow"
                value={notice.content}
                onChange={(value) => handleChange("content", value)}
                style={{
                  maxWidth: "448px",
                  height: "180px",
                }}
              />
            </div>
          </div>
        </Callout>

        <div className="flex justify-center mt-[32px]">
          <button
            onClick={handleRegister}
            className="w-[84px] h-[44px] bg-partners text-white font-semibold rounded-[8px] cursor-pointer"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
