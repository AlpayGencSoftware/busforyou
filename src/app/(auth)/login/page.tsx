"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { login, clearAuthError } from "@/store/slices/authSlice";
import { Formik, Form, Field, ErrorMessage, type FieldProps } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

const LoginSchema = Yup.object({
  email: Yup.string().email("Geçerli bir e-posta girin").required("Zorunlu"),
  password: Yup.string().min(6, "En az 6 karakter").required("Zorunlu"),
});

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, error } = useAppSelector((s) => s.auth);
  
  const redirectUrl = searchParams.get('redirect') || '/';
  const isRedirectedFromTrip = redirectUrl.startsWith('/trip/');

  useEffect(() => {
    if (currentUser) {
      router.replace(redirectUrl);
    }
  }, [currentUser, router, redirectUrl]);

  // Sayfa yüklendiğinde error mesajını temizle
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-32" style={{ background: "var(--bg-gradient)" }}>
      <div className="max-w-md mx-auto py-10 px-4">
        <h1 className="text-3xl font-extrabold text-center mb-2">Giriş Yap</h1>
        <p className="text-center text-brand-600 mb-8">Bus4You&apos;ya tekrar hoş geldiniz</p>
        
        {isRedirectedFromTrip && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Koltuk seçimi için giriş gerekli</p>
                <p className="text-xs text-blue-700 mt-1">Giriş yaptıktan sonra seçtiğiniz seferden devam edebilirsiniz.</p>
              </div>
            </div>
          </div>
        )}
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          dispatch(login(values));
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {() => (
          <Form className="space-y-5">
            <Field name="email">
              {({ field }: FieldProps) => (
                <TextInput {...field} type="email" label="E-posta Adresi" placeholder="ornek@email.com" />
              )}
            </Field>
            <ErrorMessage name="email" component="div" className="text-xs text-red-600 mt-1" />
            <div>
              <Field name="password">
                {({ field }: FieldProps) => (
                  <PasswordInput {...field} label="Parola" placeholder="••••••••••" />
                )}
              </Field>
              <div className="text-xs text-right text-gray-500 mt-1">Parolanızı mı unuttunuz?</div>
              <ErrorMessage name="password" component="div" className="text-xs text-red-600 mt-1" />
            </div>
            <Checkbox label="Beni hatırla" defaultChecked />
            <Button type="submit" className="w-full search-button-color text-search-button-color-text rounded-2xl px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300">Giriş Yap</Button>
          </Form>
        )}
      </Formik>
      <div className="text-center mt-10 text-brand-700">
        <a href={redirectUrl !== '/' ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'} className="underline">Hesap oluştur</a>
      </div>
      </div>
    </div>
  );
}


