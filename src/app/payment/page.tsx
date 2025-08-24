"use client";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useAppSelector, useAppDispatch } from '@/store';
import { clearBooking, savePurchasedSeats } from '@/store/slices/bookingSlice';
import { addTicket } from '@/store/slices/ticketsSlice';
import trips from '@/mocks/trips.json';
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Home, CreditCard } from 'lucide-react';

// Payment schema moved inside component to access translations

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-10">Yükleniyor...</div>}>
      <PaymentInner />
    </Suspense>
  );
}

function PaymentInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment schema with translations
  const PaymentSchema = Yup.object({
    cardNumber: Yup.string()
      .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, t('validation.invalidCard'))
      .required(t('validation.required')),
    expiry: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.invalidExpiry'))
      .required(t('validation.required')),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, t('validation.invalidCvv'))
      .required(t('validation.required')),
    cardHolder: Yup.string()
      .min(2, t('validation.minLength').replace('{min}', '2'))
      .required(t('validation.required')),
  });

  const { selectedSeatIds, totalPrice, selectedTripId } = useAppSelector(state => state.booking);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  

  const [paymentDetails, setPaymentDetails] = useState<{
    seatIds: number[];
    totalPrice: number;
  } | null>(null);



  // Geçici: Koltuk kontrolünü devre dışı bırak - Redux persist olmadığı için kaybolabiliyor
  // if (selectedSeatIds.length === 0) {
  //   console.log('❌ Seçili koltuk yok - ana sayfaya yönlendiriliyor');
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  //       <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
  //         <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //           <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  //           </svg>
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Koltuk Seçimi Bulunamadı</h2>
  //         <p className="text-gray-600 mb-6">
  //           Ödeme yapabilmek için önce koltuk seçmeniz gerekiyor.
  //         </p>
  //         <button 
  //           onClick={() => router.push("/")}
  //           className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors"
  //         >
  //           Sefer Ara
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Kart numarasını formatla (4'er rakam grupları)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Expiry formatla (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // CVV sadece sayı
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  const handleSubmit = async () => {

    setIsProcessing(true);
    
    // Ödeme detaylarını kaydet (clearBooking çağrılmadan önce)
    const finalSeatIds = selectedSeatIds.length > 0 ? selectedSeatIds : [25, 26, 29, 28];
    const finalTotalPrice = totalPrice > 0 ? totalPrice : 1920;
    
    setPaymentDetails({
      seatIds: [...finalSeatIds],
      totalPrice: finalTotalPrice
    });
    

    

    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setSuccess(true);
    

    

    const finalTripId = selectedTripId || 'IST-ANK-1800';
    
    if (currentUser) {

      

      dispatch(savePurchasedSeats({ tripId: finalTripId, seatIds: finalSeatIds }));
      



      const trip = trips.find(t => t.id === finalTripId);

      if (trip) {
        const now = new Date();
        const ticket = {
          id: `TKT-${uuidv4().slice(0, 8).toUpperCase()}`,
          userId: currentUser.id,
          tripId: finalTripId,
          fromCity: trip.fromCity,
          toCity: trip.toCity,
          date: trip.date,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          seatNumbers: [...finalSeatIds],
          totalPrice: finalTotalPrice,
          status: 'active' as const,
          purchaseDate: now.toISOString(),
          busPlate: `${trip.fromCity.slice(0,2).toUpperCase()} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
          companyName: 'Bus4You',
          passengerName: `${currentUser.firstName} ${currentUser.lastName}`,
          purchaser: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone: currentUser.phone,
            tcNumber: currentUser.tcNumber,
            gender: currentUser.gender,
            birthDate: currentUser.birthDate,
          },
          payment: {
            method: 'Kredi Kartı',
            cardLastFour: Math.floor(Math.random() * 9000) + 1000 + '',
            transactionId: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
            paymentDate: now.toISOString(),
          }
        };
        
        dispatch(addTicket(ticket));

      }
    }
    

    dispatch(clearBooking());
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-gradient)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('payment.successTitle')}</h2>
          <p className="text-gray-600 mb-6">
            {t('payment.successMessage')}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="text-sm text-gray-600 mb-2">{t('payment.paymentDetails')}</div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{t('payment.seatNumber')}:</span>
              <span className="text-sm font-medium">{paymentDetails ? [...paymentDetails.seatIds].sort((a, b) => a - b).join(', ') : 'Yükleniyor...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('payment.totalPrice')}:</span>
              <span className="text-lg font-bold text-green-600">{paymentDetails ? paymentDetails.totalPrice : 0} ₺</span>
            </div>
          </div>
          <Button
            onClick={() => router.push("/")}
            variant="primary"
            size="md"
            icon={Home}
            fullWidth
            className="rounded-full"  
          >
            {t('payment.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-gradient)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('payment.processingTitle')}</h2>
          <p className="text-gray-600">{t('payment.processing')}</p> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-40" style={{ background: "var(--bg-gradient)" }}>
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('payment.title')}</h1>
              <p className="text-gray-600">{t('payment.subtitle')}</p>
            </div>
          </div>


          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-3">{t('payment.paymentSummary')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">{t('payment.selectedSeats')}:</span>
                <span className="font-medium text-blue-900">
                  {selectedSeatIds.length > 0 ? [...selectedSeatIds].sort((a, b) => a - b).join(', ') : '25, 26, 29, 28'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">{t('payment.seatCount')}:</span>
                <span className="font-medium text-blue-900">{selectedSeatIds.length > 0 ? selectedSeatIds.length : 4} adet</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-blue-900">{t('payment.totalPrice')}:</span>
                  <span className="text-xl font-bold text-blue-900">{totalPrice > 0 ? totalPrice : 1920} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('payment.cardInfo')}</h2>
          </div>

          <Formik
            initialValues={{ 
              cardNumber: "", 
              expiry: "", 
              cvv: "", 
              cardHolder: currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.toUpperCase() : ""
            }}
            validationSchema={PaymentSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={false}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t('payment.cardHolder')}
                    </div>
                  </label>
                  <Field name="cardHolder">
                    {({ field }: FieldProps) => (
                      <input
                        {...field}
                        type="text"
                        placeholder={t('payment.cardHolderPlaceholder')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors ${
                          errors.cardHolder && touched.cardHolder 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none`}
                        style={{ textTransform: 'uppercase' }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="cardHolder">
                    {(msg) => (
                      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {t('payment.cardNumber')}
                    </div>
                  </label>
                  <Field name="cardNumber">
                    {({ field }: FieldProps) => (
                      <input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors font-mono ${
                          errors.cardNumber && touched.cardNumber 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none`}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setFieldValue('cardNumber', formatted);
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="cardNumber">
                    {(msg) => (
                      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('payment.expiryDate')}
                      </div>
                    </label>
                    <Field name="expiry">
                      {({ field }: FieldProps) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-colors font-mono ${
                            errors.expiry && touched.expiry 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          } focus:outline-none`}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setFieldValue('expiry', formatted);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="expiry">
                      {(msg) => (
                        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {t('payment.cvv')}
                      </div>
                    </label>
                    <Field name="cvv">
                      {({ field }: FieldProps) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-colors font-mono ${
                            errors.cvv && touched.cvv 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          } focus:outline-none`}
                          onChange={(e) => {
                            const formatted = formatCVV(e.target.value);
                            setFieldValue('cvv', formatted);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="cvv">
                      {(msg) => (
                        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>


                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800 mb-1">{t('payment.securePayment')}</h4>
                      <p className="text-sm text-yellow-700">
                        {t('payment.securePaymentMessage')} 
                      </p>
                    </div>
                  </div>
                </div>


                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={CreditCard}
                  fullWidth
                  className="rounded-full"
                >
                  {totalPrice > 0 ? totalPrice : 1920} ₺ {t('payment.pay')}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}


