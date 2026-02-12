import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Callout } from "@/components/ui/Callout";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { downloadIcon, graySearchIcon } from "../../../../public/images";

interface Props<TData> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  totalCount: number;
  take: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  draftCarNumber?: string;
  setDraftCarNumber?: Dispatch<SetStateAction<string>>;
  onDownload?: () => void;
}

export const List = <TData,>({
  title,
  data,
  columns,
  totalCount,
  take,
  page,
  setPage,
  draftCarNumber,
  setDraftCarNumber,
  onDownload,
}: Props<TData>) => {
  return (
    <Callout margin="24px 0 0 0">
      <div className="flex justify-between items-center w-full mb-[24px]">
        <div className="flex items-center">
          <p className="text-[16px] font-semibold">{title}</p>
          <div className="flex justify-center items-center ml-[12px] px-[6px] py-[2px] bg-gray1 rounded-[4px]">
            <p className="text-gray7 text-[16px] font-semibold">
              {totalCount.toLocaleString()}명
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {setDraftCarNumber && (
            <div className="relative flex items-center">
              <input
                value={draftCarNumber}
                onChange={(e) => setDraftCarNumber(e.target.value)}
                maxLength={12}
                placeholder="차량번호 검색"
                className="flex items-center w-[160px] h-[32px] pl-[32px] pr-[8px] text-[13px] border border-line rounded-[8px]"
              />

              <Image
                src={graySearchIcon}
                alt="검색"
                className="absolute size-[20px] left-[8px] z-[1]"
              />
            </div>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex justify-center items-center w-[84px] h-[32px] ml-[12px] border border-line rounded-[8px] cursor-pointer"
            >
              <Image
                src={downloadIcon}
                alt="다운로드"
                className="size-[16px] mr-[4px]"
              />
              <span className="text-[13px]">다운로드</span>
            </button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <Table data={data} columns={columns} />

      {/* 페이지네이션 */}
      <Pagination
        totalCount={totalCount}
        take={take}
        page={page}
        setPage={setPage}
      />
    </Callout>
  );
};
