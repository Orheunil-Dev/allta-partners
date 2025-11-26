import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as z from "zod";
import { useAuthControllerPartnersAdminLogin } from "@/api/auth/auth";
import { validateForm } from "@/utils";
import Image from "next/image";
import { loginLogo } from "../../../public/images";

const schema = z.object({
  identity: z.string().min(1, "ID를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export default function Login() {
  const router = useRouter();

  // 로그인 API
  const {
    mutate: login,
    isPending: loginLoading,
    isError: loginError,
  } = useAuthControllerPartnersAdminLogin();

  const formik = useFormik({
    initialValues: {
      identity: "",
      password: "",
    },
    onSubmit: (values) => {
      const errors = validateForm(schema, values);

      if (errors) {
        formik.setErrors(errors);
        return;
      }

      login(
        {
          data: {
            identity: formik.values.identity,
            password: formik.values.password,
          },
        },
        {
          onSuccess: async (res) => {
            await new Promise((resolve) => setTimeout(resolve, 500));

            router.push("/dashboard");
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
    },
  });

  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-[20px]">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center w-full max-w-[600px] px-[20px] md:px-[116px] py-[110px] bg-white rounded-[12px]"
      >
        <Image src={loginLogo} alt="올타" className="w-[120px] h-[56px]" />

        <input
          name="identity"
          value={formik.values.identity}
          onChange={(e) => formik.setFieldValue("identity", e.target.value)}
          maxLength={50}
          placeholder="계정"
          className="w-full mt-[40px] px-[12px] py-[10px] text-[16px] bg-gray1 rounded-[8px]"
        />

        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          maxLength={50}
          placeholder="비밀번호"
          className="w-full mt-[12px] px-[12px] py-[10px] text-[16px] bg-gray1 rounded-[8px]"
        />

        <button
          type="submit"
          className="w-full mt-[20px] py-[10px] text-white text-[16px] font-semibold bg-partners rounded-[8px] cursor-pointer"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
