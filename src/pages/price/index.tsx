import { useAdminControllerGetStoreAdminProfile } from "@/api/admin/admin";
import { PriceCard } from "@/components/price";

const membershipList = [
  { label: "BASIC", price: "무료" },
  { label: "PRO", price: "99,999원" },
  { label: "ENTERPRISE", price: "299,999원" },
];

export default function Price() {
  // 관리자 프로필 조회 API
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: prfileError,
  } = useAdminControllerGetStoreAdminProfile({
    query: {
      staleTime: 1000 * 60 * 30, // 1시간 동안 캐시 신선
      gcTime: 1000 * 60 * 60, // 2시간 동안 메모리에 데이터 캐싱
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 막기
      queryKey: ["profile"],
    },
  });

  return (
    <div className="flex flex-col justify-center h-full px-[20px] md:px-[40px] lg:px-[80px] overflow-y-auto">
      <p className="text-center text-[28px] font-semibold">
        올타 파트너스 멤버쉽
      </p>
      <p className="mt-[4px] text-center text-[16px]">
        매장 규모에 맞는 최적의 관리 플랜을 선택하세요.
      </p>

      <div className="flex flex-col lg:flex-row justify-between mt-[40px] gap-[24px]">
        {membershipList.map((value, index) => (
          <PriceCard
            key={index}
            index={index}
            membership={value.label}
            price={value.price}
            currentMembership={profileData?.data.membership ?? "BASIC"}
          />
        ))}
      </div>
    </div>
  );
}
