import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";
import { GetStoreDetailResponse, UpdateStoreRequest } from "@/api/models";
import { KakaoMap } from "../layout/KakaoMap";
import { mapIcon, pencilIcon } from "../../../public/images";

interface Props {
  store?: UpdateStoreRequest;
  setStore: Dispatch<SetStateAction<UpdateStoreRequest | undefined>>;
  storeData: GetStoreDetailResponse["data"];
}

export const StoreInfo = ({ store, setStore, storeData }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState<boolean>(false);

  // 이미지 드래그&드롭
  const handleDropImage = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const imageFormData = new FormData();

        imageFormData.append("bucket", "allta_store");
        imageFormData.append(
          "file",
          file,
          `store_${dayjs().format("YYYYMMDDHHmmss")}.jpg`
        );

        const uploadRes = await axios.post<{
          ok: boolean;
          url: string;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/file/image`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = uploadRes.data.url;

        return setStore((prev) => {
          if (!prev) return prev;

          return { ...prev, mainImage: imageUrl };
        });
      } catch (error: any) {
        console.log(error);
        alert(error.message ?? "이미지 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  // 이미지 선택
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const imageFormData = new FormData();

        imageFormData.append("bucket", "allta_store");
        imageFormData.append(
          "file",
          file,
          `store_${dayjs().format("YYYYMMDDHHmmss")}.jpg`
        );

        const uploadRes = await axios.post<{
          ok: boolean;
          url: string;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/file/image`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = uploadRes.data.url;

        return setStore((prev) => {
          if (!prev) return prev;

          return { ...prev, mainImage: imageUrl };
        });
      } catch (error: any) {
        console.log(error);
        alert(error.message ?? "이미지 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteImage = () => {
    return setStore((prev) => {
      if (!prev) return prev;

      return { ...prev, mainImage: null };
    });
  };

  return (
    <div
      className="w-[366px] p-[20px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <p className="text-[16px] font-semibold">매장 정보</p>

      <div
        onDrop={handleDropImage}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex justify-center items-center w-full h-[175px] mt-[16px] bg-gray2 rounded-[12px] cursor-pointer"
        style={{
          backgroundImage: `url(${store?.mainImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {!store?.mainImage && (
          <p className="text-gray5 text-[16px]">매장 이미지를 등록하세요</p>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUploadImage}
          className="hidden"
        />
      </div>

      <div className="flex justify-center items-center mt-[12px] gap-x-[12px]">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex justify-center items-center w-[48px] h-[33px] text-[14px] bg-gray1 rounded-[4px] cursor-pointer"
        >
          변경
        </button>

        <button
          onClick={handleDeleteImage}
          className="flex justify-center items-center w-[48px] h-[33px] text-[14px] bg-gray1 rounded-[4px] cursor-pointer"
        >
          삭제
        </button>
      </div>

      <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] gap-y-[16px]">
        <p className="text-gray5 text-[14px] font-semibold">매장명</p>
        <input
          value={storeData.name}
          disabled
          className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
        />

        <div className="flex items-center">
          <p className="text-gray5 text-[14px] font-semibold">주소</p>

          <div
            onMouseEnter={() => setShowMap(true)}
            onMouseLeave={() => setShowMap(false)}
            className="relative ml-[4px] cursor-pointer"
          >
            <Image src={mapIcon} alt="지도" className="w-[20px] h-[20px]" />

            {showMap && (
              <div className="absolute flex justify-center items-center top-0 left-0 w-[326px] h-[186px] rounded-[20px] overflow-hidden">
                <KakaoMap
                  lat={storeData.lat}
                  lng={storeData.lng}
                  address={storeData.address}
                />
              </div>
            )}
          </div>
        </div>

        <input
          value={storeData.address}
          disabled
          className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
        />

        <p className="text-gray5 text-[14px] font-semibold">전화번호</p>
        <input
          value={storeData.phoneNumber}
          disabled
          className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
        />

        <p className="text-gray5 text-[14px] font-semibold">대표자명</p>
        <input
          value={storeData.ceoName}
          disabled
          className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
        />

        <p className="text-gray5 text-[14px] font-semibold">대표자 전화번호</p>
        <input
          value={storeData.ceoPhoneNumber}
          disabled
          className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
        />
      </div>
    </div>
  );
};
