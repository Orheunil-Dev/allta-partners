import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  useNoticeControllerDeleteNotice,
  useNoticeControllerGetNoticeDetail,
  useNoticeControllerUpdateNotice,
} from "@/api/notice/notice";
import { Callout } from "@/components/ui/Callout";
import { UpdateNoticeRequest } from "@/api/models";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";

export default function NoticeDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState<UpdateNoticeRequest>({
    id: "",
    title: "",
    content: "",
  });

  // 공지사항 상세 조회 API
  const {
    data: noticeData,
    isLoading: noticeLoading,
    isError: noticeError,
    refetch: noticeRefetch,
  } = useNoticeControllerGetNoticeDetail(id as string, {
    query: {
      enabled: !!id,
    },
  });

  // 공지사항 수정 API
  const {
    mutate: updateNotice,
    isPending: updateNoticeLoading,
    isError: updateNoticeError,
  } = useNoticeControllerUpdateNotice();

  // 공지사항 삭제 API
  const {
    mutate: deleteNotice,
    isPending: deleteNoticeLoading,
    isError: deleteNoticeError,
  } = useNoticeControllerDeleteNotice({
    mutation: {
      onSuccess: () => {
        alert("삭제가 완료되었습니다.");
        router.push("/notice");
      },
      onError: (error: any) => {
        alert(error.message ?? "삭제 중 오류가 발생했습니다.");
      },
    },
  });

  const handleChange = (key: keyof UpdateNoticeRequest, value: any) => {
    setNotice((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 공지사항 수정
  const handleUpdate = () => {
    if (!id) return;

    updateNotice(
      {
        data: {
          ...notice,
        },
      },
      {
        onSuccess: () => {
          alert("공지사항이 수정되었습니다.");

          return noticeRefetch();
        },
        onError: (error: any) => {
          console.error(error);

          return alert(
            error.message ?? "공지사항 수정 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  // 공지사항 삭제
  const handleDelete = () => {
    if (!confirm("공지사항을 삭제하시겠습니까?") || !id) return;

    deleteNotice({ id: id as string });
  };

  useEffect(() => {
    if (noticeData?.data) {
      setNotice(noticeData.data);
    }
  }, [noticeData]);

  if (!noticeLoading && !noticeData) {
    return (
      <div>
        <p>공지사항 조회에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-[40px]">
      {noticeData && (
        <div className="flex flex-col">
          <Callout>
            <div className="px-[12px]">
              <p className="text-[16px] font-semibold">공지사항</p>

              <div className="grid grid-cols-[120px_1fr] items-center w-full mt-[16px] py-[16px] gap-y-[32px] border-b border-line">
                <p className="text-gray5 text-[14px] font-semibold">등록일</p>
                <p className="text-[14px]">
                  {dayjs(noticeData.data.createdAt).format("YYYY.MM.DD hh:mm")}
                </p>
              </div>

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

          <div className="flex justify-center mt-[32px] gap-x-[20px]">
            <button
              onClick={handleDelete}
              className="w-[84px] h-[44px] bg-white text-gray5 font-semibold border border-gray2 rounded-[8px] cursor-pointer"
            >
              삭제
            </button>

            <button
              onClick={handleUpdate}
              className="w-[84px] h-[44px] bg-partners text-white font-semibold rounded-[8px] cursor-pointer"
            >
              수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
