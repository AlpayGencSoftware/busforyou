"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTrips, type TripSummary } from "@/store/slices/tripsSlice";
import { startBooking } from "@/store/slices/bookingSlice";
import { useEffect, useMemo, useState } from "react";
import allTrips from "@/mocks/trips.json";
import { useRouter } from "next/navigation";

export default function InquiryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const criteria = useAppSelector((s) => s.search);
  const trips = useAppSelector((s) => s.trips.trips);
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const userTickets = useAppSelector((state) => state.tickets.tickets.filter(t => t.userId === currentUser?.id));
  const [currentTime, setCurrentTime] = useState(new Date());

  // Her dakika güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 dakika

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const filtered = (allTrips as TripSummary[]).filter(
      (t) => t.fromCity === criteria.fromCity && t.toCity === criteria.toCity && t.date === criteria.date
    );
    
    // Sadece arama kriterleri değiştiğinde güncelle (trips dependency'sini kaldır)
    dispatch(setTrips(filtered));
  }, [criteria, dispatch]);

  const hasNoResult = useMemo(() => trips.length === 0, [trips.length]);

  // Seferin geçip geçmediğini kontrol et
  const isTripExpired = (trip: TripSummary) => {
    if (!trip.date || !trip.departureTime) return false;
    
    const tripDate = new Date(trip.date);
    const [hours, minutes] = trip.departureTime.split(':').map(Number);
    tripDate.setHours(hours, minutes, 0, 0);
    
    return tripDate < currentTime;
  };

  // Sefere kalan süreyi hesapla
  const getTimeUntilDeparture = (trip: TripSummary) => {
    if (!trip.date || !trip.departureTime) return null;
    
    const tripDate = new Date(trip.date);
    const [hours, minutes] = trip.departureTime.split(':').map(Number);
    tripDate.setHours(hours, minutes, 0, 0);
    
    const timeDiff = tripDate.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) return null;
    
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours_remaining = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes_remaining = totalMinutes % 60;
    
    if (days > 0) {
      return `${days} gün ${hours_remaining}s ${minutes_remaining}dk`;
    } else if (hours_remaining > 0) {
      return `${hours_remaining}s ${minutes_remaining}dk`;
    } else {
      return `${minutes_remaining}dk`;
    }
  };

  // Boş koltuk sayısını hesapla
  const getAvailableSeats = (trip: TripSummary) => {
    return trip.seats?.filter(seat => !seat.occupied).length || 0;
  };

  // Seyahat süresini hesapla
  const getTravelDuration = (departure: string, arrival: string) => {
    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Gece yarısını geçen seferler için
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}s ${minutes > 0 ? minutes + 'dk' : ''}`;
  };

  // Tarihi formatla
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen pt-32" style={{ background: "var(--bg-gradient)" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Uygun Seferler</h1>
              <p className="text-gray-600 text-sm">Size en uygun otobüs seferlerini bulduk</p>
            </div>
          </div>
          
          {/* Arama Kriterleri */}
          {criteria.fromCity && criteria.toCity && (
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-gray-900">{criteria.fromCity}</span>
              </div>
              
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-gray-900">{criteria.toCity}</span>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">{criteria.date && formatDate(criteria.date)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {hasNoResult ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Uygun Sefer Bulunamadı</h3>
            <p className="text-gray-600 mb-6">Seçtiğiniz kriterlere uygun sefer bulunmamaktadır. Lütfen farklı tarih veya güzergah deneyin.</p>
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Yeni Arama Yap
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{trips.length}</span> sefer bulundu
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                En uygun fiyatlı seferler listelendi
              </div>
            </div>

            {trips.map((trip: TripSummary) => {
              const isExpired = isTripExpired(trip);
              const timeUntilDeparture = getTimeUntilDeparture(trip);
              
              return (
                <div key={trip.id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
                  isExpired 
                    ? 'opacity-60 grayscale' 
                    : 'hover:shadow-md'
                }`}>
                  <div className="p-6">
                    {/* Timer Badge */}
                    {!isExpired && timeUntilDeparture && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Kalkışa {timeUntilDeparture} kaldı
                        </div>
                      </div>
                    )}
                    
                    {/* Expired Badge */}
                    {isExpired && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Sefer süresi geçti
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {/* Sol Taraf - Sefer Bilgileri */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                            <div>
                              <div className={`font-semibold text-lg ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                                {trip.departureTime}
                              </div>
                              <div className={`text-sm ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
                                {trip.fromCity}
                              </div>
                            </div>
                          </div>
                        
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-gray-400">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-xs text-gray-500 mx-4 bg-gray-50 px-2 py-1 rounded-full">
                            {getTravelDuration(trip.departureTime, trip.arrivalTime)}
                          </div>
                        </div>
                        
                          <div className="flex items-center gap-3">
                            <div>
                              <div className={`font-semibold text-lg text-right ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                                {trip.arrivalTime}
                              </div>
                              <div className={`text-sm text-right ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
                                {trip.toCity}
                              </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-gray-400' : 'bg-red-500'}`}></div>
                          </div>
                        </div>
                        
                        {/* Alt Bilgiler */}
                        <div className={`flex items-center gap-6 text-sm ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            <span>Klimalı</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            <span>WiFi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{getAvailableSeats(trip)} boş koltuk</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sağ Taraf - Fiyat ve Buton */}
                      <div className="flex flex-col items-end gap-4 ml-8">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                            ₺{trip.price}
                          </div>
                          <div className={`text-sm ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
                            kişi başı
                          </div>
                        </div>
                        
                        <button
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                            isExpired 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          onClick={() => {
                            if (isExpired) return;
                            
                                              // Booking state'ini başlat (sefer seçildiğinde)
                  dispatch(startBooking({ tripId: trip.id, basePrice: trip.price, userTickets }));
                            
                            // Giriş kontrolü - giriş yapmamışsa login sayfasına yönlendir
                            if (!currentUser) {
                              // Seçilen seferi URL parametresi olarak kaydet
                              router.push(`/login?redirect=/trip/${trip.id}`);
                              return;
                            }
                            
                            // Giriş yapmışsa sefer detayına git
                            router.push(`/trip/${trip.id}`);
                          }}
                          disabled={isExpired}
                        >
                          {isExpired ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Sefer Geçti
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Koltuk Seç
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}