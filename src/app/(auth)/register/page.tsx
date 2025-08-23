"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerUser, type UserProfile, clearAuthError } from "@/store/slices/authSlice";
import { Formik, Form, Field, ErrorMessage, type FieldProps } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
const RegisterSchema = Yup.object({
  firstName: Yup.string().required("Ad alanı zorunludur"),
  lastName: Yup.string().required("Soyad alanı zorunludur"),
  email: Yup.string().email("Geçerli bir e-posta adresi giriniz").required("E-posta alanı zorunludur"),
  password: Yup.string()
    .min(6, "Parola en az 6 karakter olmalıdır")
    .matches(/[A-Z]/, "Parola en az bir büyük harf içermelidir")
    .matches(/[a-z]/, "Parola en az bir küçük harf içermelidir")
    .matches(/[0-9]/, "Parola en az bir rakam içermelidir")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Parola en az bir özel karakter içermelidir")
    .required("Parola alanı zorunludur"),
  confirmPassword: Yup.string()
    .required("Parola onayı zorunludur"),
  phone: Yup.string()
    .matches(/^(\+90|0)?[1-9][0-9]{9}$/, "Geçerli bir telefon numarası giriniz")
    .required("Telefon numarası zorunludur"),
  tcNumber: Yup.string()
    .matches(/^[1-9][0-9]{10}$/, "Geçerli bir TC kimlik numarası giriniz")
    .required("TC kimlik numarası zorunludur"),
  gender: Yup.mixed().oneOf(["male", "female"]).required("Cinsiyet seçimi zorunludur"),
  birthDate: Yup.string().required("Doğum tarihi alanı zorunludur"),
});

type RegisterForm = Omit<UserProfile, "id"> & {
  confirmPassword: string;
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error } = useAppSelector((s) => s.auth);
  
  const redirectUrl = searchParams.get('redirect') || '/';
  const isRedirectedFromTrip = redirectUrl.startsWith('/trip/');

  // Sayfa yüklendiğinde error mesajını temizle
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-32" style={{ background: "var(--bg-gradient)" }}>
      <div className="max-w-md mx-auto py-10 px-4">
        <h1 className="text-3xl font-extrabold mb-2">Hesap Oluştur</h1>
        <p className="text-brand-600 mb-8">Bus4You&apos;ya hoş geldiniz</p>
        
        {isRedirectedFromTrip && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Koltuk seçimi için hesap gerekli</p>
                <p className="text-xs text-blue-700 mt-1">Hesap oluşturduktan sonra seçtiğiniz seferden devam edebilirsiniz.</p>
              </div>
            </div>
          </div>
        )}
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <Formik<RegisterForm>
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          tcNumber: "",
          gender: "male",
          birthDate: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values: RegisterForm) => {
          const { confirmPassword: _, ...userValues } = values;
          const payload: UserProfile = {
            id: uuidv4(),
            ...userValues,
          };
          dispatch(registerUser(payload));
          // Register başarılı olduktan sonra redirect parametresiyle login sayfasına git
          const loginUrl = redirectUrl !== '/' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login';
          router.push(loginUrl);
        }}
                    validate={(values) => {
              const errors: Record<string, string> = {};
          
          // Parola eşleşme kontrolü
          if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Parolalar eşleşmiyor';
          }
          
          return errors;
        }}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({ values, errors, isValid }) => {
          const passwordsMatch = values.password && values.confirmPassword && values.password === values.confirmPassword;
          const canSubmit = isValid && passwordsMatch && Object.keys(errors).length === 0;
          
          return (
          <Form className="space-y-5">
            <Field name="firstName">
              {({ field }: FieldProps) => (
                <TextInput {...field} label="Ad" placeholder="Adınızı giriniz" />
              )}
            </Field>
            <ErrorMessage name="firstName" component="div" className="text-xs text-red-600 mt-1" />
            
            <Field name="lastName">
              {({ field }: FieldProps) => (
                <TextInput {...field} label="Soyad" placeholder="Soyadınızı giriniz" />
              )}
            </Field>
            <ErrorMessage name="lastName" component="div" className="text-xs text-red-600 mt-1" />
            
            <Field name="email">
              {({ field }: FieldProps) => (
                <TextInput {...field} type="email" label="E-posta Adresi" placeholder="ornek@email.com" />
              )}
            </Field>
            <ErrorMessage name="email" component="div" className="text-xs text-red-600 mt-1" />
            
            <Field name="password">
              {({ field }: FieldProps) => {
                const password = field.value;
                const checks = {
                  length: password && password.length >= 6,
                  uppercase: password && /[A-Z]/.test(password),
                  lowercase: password && /[a-z]/.test(password),
                  number: password && /[0-9]/.test(password),
                  special: password && /[!@#$%^&*(),.?":{}|<>]/.test(password)
                };

                return (
                  <div>
                    <PasswordInput {...field} label="Parola" placeholder="•••••••••" />
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-gray-600 mb-1">Parola gereksinimleri:</div>
                        <div className={`text-xs flex items-center gap-1 ${checks.length ? 'text-green-600' : 'text-red-600'}`}>
                          {checks.length ? '✓' : '✗'} En az 6 karakter
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${checks.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                          {checks.uppercase ? '✓' : '✗'} Büyük harf (A-Z)
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${checks.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                          {checks.lowercase ? '✓' : '✗'} Küçük harf (a-z)
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${checks.number ? 'text-green-600' : 'text-red-600'}`}>
                          {checks.number ? '✓' : '✗'} Rakam (0-9)
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${checks.special ? 'text-green-600' : 'text-red-600'}`}>
                          {checks.special ? '✓' : '✗'} Özel karakter (!@#$%...)
                        </div>
                      </div>
                    )}
                    {!password && (
                      <div className="text-xs text-gray-500 mt-1">
                        Parola en az 6 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir
                      </div>
                    )}
                  </div>
                );
              }}
            </Field>
            <ErrorMessage name="password" component="div" className="text-xs text-red-600 mt-1" />
            
            <Field name="confirmPassword">
              {({ field, form }: FieldProps) => {
                const hasError = form.errors.confirmPassword && form.touched.confirmPassword;
                const isMatching = field.value && form.values.password && field.value === form.values.password;
                
                return (
                  <div>
                    <PasswordInput 
                      {...field} 
                      label="Parola Onayı" 
                      placeholder="•••••••••"
                      className={hasError ? 'border-red-500' : isMatching ? 'border-green-500' : ''}
                    />
                    {field.value && form.values.password && (
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        isMatching ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isMatching ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Parolalar eşleşiyor
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Parolalar eşleşmiyor
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              }}
            </Field>
            
            <Field name="phone">
              {({ field }: FieldProps) => (
                <TextInput {...field} label="Telefon Numarası" placeholder="+90 5XX XXX XX XX" />
              )}
            </Field>
            <ErrorMessage name="phone" component="div" className="text-xs text-red-600 mt-1" />
            
            <Field name="tcNumber">
              {({ field }: FieldProps) => (
                <TextInput {...field} label="TC Kimlik Numarası" placeholder="XXXXXXXXXXX" maxLength={11} />
              )}
            </Field>
            <ErrorMessage name="tcNumber" component="div" className="text-xs text-red-600 mt-1" />
            
            <div>
              <label className="block text-xs text-gray-700 mb-1">Cinsiyet</label>
              <Field as="select" name="gender" className="w-full bg-white rounded-2xl border border-gray-300 px-4 py-3 text-sm">
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-xs text-red-600 mt-1" />
            </div>
            
            <Field name="birthDate">
              {({ field }: FieldProps) => (
                <TextInput {...field} type="date" label="Doğum Tarihi" />
              )}
            </Field>
            <ErrorMessage name="birthDate" component="div" className="text-xs text-red-600 mt-1" />
            <div className="text-[0.6875rem] text-gray-600">
              <input type="checkbox" defaultChecked className="accent-brand-500 mr-2" /> Devam ederek <a className="underline">kullanım şartlarımızı</a> kabul etmiş olursunuz.
            </div>
            <Button
              type="submit" 
              disabled={!canSubmit}
              className={`w-full search-button-color text-search-button-color-text rounded-2xl px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Kayıt Ol
            </Button>
            <div className="text-gray-700 text-sm text-center mt-6">
              Zaten hesabınız var mı? <a href={redirectUrl !== '/' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} className="text-brand-700 underline">Giriş yapın</a>
            </div>
          </Form>
        );
        }}
      </Formik>
      </div>
    </div>
  );
}


