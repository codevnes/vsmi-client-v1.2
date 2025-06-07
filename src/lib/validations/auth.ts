import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email là trường bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Họ tên là trường bắt buộc" }),
    email: z
      .string()
      .min(1, { message: "Email là trường bắt buộc" })
      .email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .min(1, { message: "Số điện thoại là trường bắt buộc" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>; 