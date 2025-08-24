'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { startBooking, toggleSeat } from '@/store/slices/bookingSlice';
import { useEffect } from 'react';
import trips from '@/mocks/trips.json';
import Swal from 'sweetalert2';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { CreditCard } from 'lucide-react';

const TripDetailsPage = () => {
  const { t, currentLanguage } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedSeatIds, totalPrice, lastPurchasedSeats } = useAppSelector(state => state.booking);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const userTickets = useAppSelector((state) => state.tickets.tickets.filter(t => t.userId === currentUser?.id));

  const trip = trips.find(t => t.id === id);

  useEffect(() => {
    if (trip && currentUser) {
      dispatch(startBooking({ tripId: trip.id, basePrice: trip.price, userTickets }));
    }
  }, [trip, dispatch, currentUser]); // currentUser dependency - login olduktan sonra çalışsın

  // Giriş kontrolü - giriş yapmamış kullanıcıları login sayfasına yönlendir
  useEffect(() => {
    if (!currentUser) {
      router.push(`/login?redirect=/trip/${id}`);
      return;
    }
  }, [currentUser, router, id]);

  // Giriş yapmamışsa loading göster (redirect olana kadar)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <div className="container mx-auto px-4 py-8">Sefer bulunamadı.</div>;
  }

  const handleToggle = (seatId: number) => {
    // Kullanıcının bu sefer için toplam koltuk sayısını hesapla
    const purchasedSeatsForThisTrip = userTickets
      .filter(ticket => ticket.tripId === trip.id)
      .reduce((total, ticket) => total + ticket.seatNumbers.length, 0);
    
    const totalSeatsCount = purchasedSeatsForThisTrip + selectedSeatIds.length;
    
    // Yeni koltuk seçmeye çalışıyorsa ve toplam 5'i geçecekse engelle
    if (totalSeatsCount >= 5 && !selectedSeatIds.includes(seatId)) {
      Swal.fire({
        title: '⚠️ Koltuk Limiti',
        html: `
          <div class="text-gray-700 space-y-3">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p class="text-sm font-medium text-yellow-800">En fazla 5 koltuk seçebilirsiniz!</p>
            </div>
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span class="text-sm text-gray-600">Satın alınan:</span>
              <span class="font-bold text-blue-600">${purchasedSeatsForThisTrip}</span>
            </div>
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span class="text-sm text-gray-600">Seçili:</span>
              <span class="font-bold text-green-600">${selectedSeatIds.length}</span>
            </div>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Anladım',
        confirmButtonColor: '#3b82f6',
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-2xl border-0',
          title: 'text-xl font-bold text-gray-800 mb-4',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg'
        }
      });
      return;
    }

    const seat = trip.seats.find(s => s.id === seatId);
    if (!seat) return;
    
    // Kullanıcının kendi koltukları da dahil, dolu koltuklar seçilemez
    const isPurchasedByUser = userTickets.some(ticket => 
      ticket.tripId === trip.id && ticket.seatNumbers.includes(seatId)
    );
    
    if (seat.occupied || isPurchasedByUser) return;

    // Cinsiyet kuralı kontrolü
    const adjacentSeats = getAdjacentSeats(seatId);
    const selectedAdjacentSeats = adjacentSeats.filter(adjId => 
      selectedSeatIds.includes(adjId)
    );

    // Cinsiyet kuralı: Belirtilen çiftli koltuklarda uygulanır
    // Çiftli koltuklar (karşı cins kuralı geçerli): 2-3, 5-6, 8-9, 11-12, 14-15, 17-18, 22-23, 25-26, 28-29, 31-32, 34-35, 38-39, 37-40, 36-41
    
    const doubleSeatPairs = [
      [2, 3], [5, 6], [8, 9], [11, 12], [14, 15], [17, 18], 
      [22, 23], [25, 26], [28, 29], [31, 32], [34, 35], 
      [38, 39], [37, 40], [36, 41]
    ];
    
    // Bu koltuğun bir çiftin parçası olup olmadığını kontrol et
    const currentPair = doubleSeatPairs.find(pair => pair.includes(seatId));
    
    // Çiftli koltuksa cinsiyet kuralı uygula
    if (currentPair && currentUser && currentUser.gender) {
      const pairSeatId = currentPair.find(id => id !== seatId);
      if (pairSeatId) {
        const pairSeat = trip.seats.find(s => s.id === pairSeatId);
        
        // Çift koltuğu dolu ve karşı cinsten ise uyarı ver
        if (pairSeat && pairSeat.occupied && pairSeat.gender && pairSeat.gender !== currentUser.gender) {
          Swal.fire({
            title: '👫 Cinsiyet Kuralı',
            html: `
              <div class="text-gray-700 space-y-4">
                <div class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
                  <p class="text-sm font-medium text-pink-800">Çiftli koltuklarda karşı cinsten yolcunun yanına oturulamaz!</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-6 ${pairSeat.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${pairSeatId}</span>
                      </div>
                      <span class="text-sm font-medium">${pairSeat.gender === 'male' ? '👨 Erkek' : '👩 Kadın'}</span>
                    </div>
                  </div>
                </div>
                <p class="text-xs text-gray-500">Bu kural yalnızca çiftli koltuklar için geçerlidir.</p>
              </div>
            `,
            icon: 'info',
            confirmButtonText: 'Anladım',
            confirmButtonColor: '#3b82f6',
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-2xl shadow-2xl border-0',
              title: 'text-xl font-bold text-gray-800 mb-4',
              confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg'
            }
          });
          return;
        }
      }
    }

    dispatch(toggleSeat({ seatId, price: trip.price }));
  };

  const getAdjacentSeats = (seatId: number): number[] => {
    // Otobüs düzenine göre yan yana koltuk mantığı
    const adjacentIds: number[] = [];
    
    // 2+2 düzeni: Her 3 koltukta bir koridor var
    // Koltuk grupları: [1,4], [2,5], [3,6], [7,10], [8,11], [9,12], vs.
    
    // Koltuk çiftleri (yan yana oturan koltuklar) - Grid düzenine göre
    const seatPairs = [
      // Aynı sütundaki koltuklar (dikey yan yana)
      [1, 2], [4, 5], [7, 8], [10, 11], [13, 14], [16, 17], [19, 20], [21, 22],
      [24, 25], [27, 28], [30, 31], [33, 34], [36, 37], [38, 39],
      // Üst sıradaki koltuklar
      [3, 2], [6, 5], [9, 8], [12, 11], [15, 14], [18, 17], [23, 22],
      [26, 25], [29, 28], [32, 31], [35, 34], [40, 39]
      // 41 tek koltuk
    ];
    
    // Hangi çiftte olduğumuzu bul
    for (const pair of seatPairs) {
      if (pair.includes(seatId)) {
        // Çiftteki diğer koltuğu ekle
        const otherSeat = pair.find(id => id !== seatId);
        if (otherSeat) {
          adjacentIds.push(otherSeat);
        }
        break;
      }
    }
    
    return adjacentIds.filter(id => id >= 1 && id <= 41);
  };

  const renderSeat = (seatId: number) => {
    const seat = trip.seats.find(s => s.id === seatId);
    if (!seat) return null;

    const isSelected = selectedSeatIds.includes(seat.id);
    const occupied = seat.occupied;
    
    // Kullanıcının daha önce satın aldığı koltukları kontrol et
    const isPurchasedByUser = userTickets.some(ticket => 
      ticket.tripId === trip.id && ticket.seatNumbers.includes(seatId)
    );


    // Renk belirleme
    let seatColor = "#6B7280"; // Default gray
    let isClickable = true;
    
    if (occupied && !isPurchasedByUser) {
      // Başkalarının satın aldığı koltuklar (dolu)
      seatColor = seat.gender === "male" ? "#3B82F6" : "#EC4899"; // Blue for male, Pink for female
      isClickable = false;
    } else if (isSelected) {
      // Yeni seçilen koltuklar (yeşil)
      seatColor = "#10B981";
    } else if (isPurchasedByUser) {
      // Kullanıcının satın aldığı koltuklar (mavi ama tıklanamaz)
      seatColor = "#1D4ED8";
      isClickable = false;
    } else {
      // Boş koltuklar (açık gri)
      seatColor = "#9CA3AF";
    }

    return (
      <div
        key={seat.id}
        className={`relative cursor-pointer transition-all hover:scale-105 ${!isClickable ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Dolu koltuklar ve kullanıcının satın aldığı koltuklar tıklanamaz
          if (!isClickable) {
            return;
          }
          
          handleToggle(seat.id);
        }}
      >
        {/* SVG Koltuk İkonu */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 56 88" 
          fill="none"
          className="w-20 h-16"
          style={{ color: seatColor }}
        >
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 28 44)">
            {/* Dış gövde */}
            <rect x="10" y="6" width="36" height="76" rx="10" fill="currentColor" fillOpacity="0.1"/>
            {/* Baş dayama (üst) */}
            <rect x="14" y="8" width="28" height="16" rx="6" fill="currentColor" fillOpacity="0.2"/>
            {/* Oturma minderi */}
            <rect x="12" y="44" width="32" height="26" rx="8" fill="currentColor" fillOpacity="0.3"/>
            {/* Minder dikişi */}
            <line x1="12" y1="57" x2="44" y2="57"/>
            {/* Kolçaklar */}
            <rect x="4"  y="42" width="8"  height="20" rx="4" fill="currentColor" fillOpacity="0.2"/>
            <rect x="44" y="42" width="8"  height="20" rx="4" fill="currentColor" fillOpacity="0.2"/>
          </g>
        </svg>
        
        {/* Koltuk Numarası - Koltuğun ortasında */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border shadow-sm bg-white ml-2"
          style={{ 
            borderColor: seatColor,
            backgroundColor: isSelected ? seatColor : 'white',
            color: isSelected ? 'white' : seatColor
          }}
        >
          {seat.id}
        </div>
      </div>
    );
  };

  // Seyahat süresini hesapla
  const getTravelDuration = () => {
    const [depHour, depMin] = trip.departureTime.split(':').map(Number);
    const [arrHour, arrMin] = trip.arrivalTime.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Gece yarısını geçen seferler için
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}s ${minutes > 0 ? minutes + 'dk' : ''}`;
  };

  // Boş koltuk sayısını hesapla
  const getAvailableSeatsCount = () => {
    return trip.seats.filter(seat => !seat.occupied).length;
  };

  // Tarihi formatla
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="min-h-screen pt-40" style={{ background: "var(--bg-gradient)" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Sefer Bilgileri Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('trip.tripDetails')}</h1>
              <p className="text-sm sm:text-base text-gray-600">{t('trip.selectSeats')}</p>
            </div>
          </div>

          {/* Route Timeline */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Kalkış Bilgileri */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{trip.departureTime}</div>
                  <div className="text-sm sm:text-lg font-semibold text-gray-700 truncate">{trip.fromCity}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{formatDate(trip.date)}</div>
                </div>
              </div>
              
              {/* Süre ve Ok - Mobilde dikey, desktop'ta yatay */}
              <div className="flex items-center justify-center sm:mx-4 my-2 sm:my-0">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="hidden sm:block h-px bg-gray-300 w-12 lg:w-20"></div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border whitespace-nowrap">
                      {getTravelDuration()}
                    </div>
                  </div>
                  <div className="hidden sm:block h-px bg-gray-300 w-12 lg:w-20"></div>
                </div>
              </div>
              
              {/* Varış Bilgileri */}
              <div className="flex items-center gap-3 flex-1 sm:justify-end">
                <div className="text-left sm:text-right min-w-0 order-2 sm:order-1">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{trip.arrivalTime}</div>
                  <div className="text-sm sm:text-lg font-semibold text-gray-700 truncate">{trip.toCity}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Ertesi gün</div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex-shrink-0 order-1 sm:order-2"></div>
              </div>
            </div>
          </div>

          {/* Sefer Özellikleri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-900">{t('inquiry.heating')}</div>
                <div className="text-xs sm:text-sm text-gray-600">Konforlu yolculuk</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-900">{t('inquiry.wifi')}</div>
                <div className="text-xs sm:text-sm text-gray-600">Ücretsiz internet</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-900">{getAvailableSeatsCount()} {t('inquiry.availableSeats')}</div>
                <div className="text-xs sm:text-sm text-gray-600">41 koltuktan</div>
              </div>
            </div>
          </div>

          {/* Fiyat Bilgileri */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-gray-600">{t('trip.price')}</div>
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{trip.price} ₺</div>
              </div>
            </div>
            
            {selectedSeatIds.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    Toplam Tutar ({selectedSeatIds.length} yeni koltuk)
                    {userTickets.filter(t => t.tripId === trip.id).reduce((total, ticket) => total + ticket.seatNumbers.length, 0) > 0 && (
                      <span className="text-blue-600 ml-2">
                        + {userTickets.filter(t => t.tripId === trip.id).reduce((total, ticket) => total + ticket.seatNumbers.length, 0)} satın alınan
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalPrice} ₺</div>
                </div>
              </div>
            )}
          </div>

          {/* Ek Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">Sefer Kodu: <span className="font-medium">{trip.id}</span></span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">Tahmini Süre: <span className="font-medium">{getTravelDuration()}</span></span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-600">Güvenli Seyahat Garantisi</span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-sm text-gray-600">Mobil Bilet Geçerli</span>
            </div>
          </div>
        </div>

        {/* Koltuk Seçimi Bölümü */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Koltuk Seçimi</h2>
                <p className="text-sm text-gray-600">En fazla 5 koltuk seçebilirsiniz</p>
              </div>
            </div>
            
            {selectedSeatIds.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {selectedSeatIds.length} koltuk seçildi
              </div>
            )}
          </div>

          {/* Otobüs Düzeni Açıklaması */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Koltuk Seçim Kuralları</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    En fazla 5 koltuk seçebilirsiniz
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    Karma koltuklar: 1,4,7,10,13,16,19,20,21,24,27,30,33,36 (cinsiyet kuralı yok)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    Diğer koltuklar için karşı cinsten yolcunun yanına oturulamaz
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    Mavi koltuklar erkek, pembe koltuklar kadın yolcular içindir
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* YATAY BUS LAYOUT - CSS Grid ile */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-4 overflow-x-auto">
          <div className="relative min-w-[75rem]">
            {/* Şoför Alanı */}
            <div className="absolute left-4 top-32 w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
              <span className="text-xs font-medium text-gray-600 transform -rotate-90">ŞOFÖR</span>
            </div>

            {/* Koltuk Grid */}
            <div className="ml-30 gap-0 p-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)' }}>
                            {(() => {
                return (
                  <>
                    {/* 1. SIRA */}
                    <div className="col-start-1 row-start-1">{renderSeat(3)}</div>
                    <div className="col-start-2 row-start-1">{renderSeat(6)}</div>
                    <div className="col-start-3 row-start-1">{renderSeat(9)}</div>
                    <div className="col-start-4 row-start-1">{renderSeat(12)}</div>
                    <div className="col-start-5 row-start-1">{renderSeat(15)}</div>
                    <div className="col-start-6 row-start-1">{renderSeat(18)}</div>
                    <div className="col-start-7 row-start-1">{renderSeat(23)}</div>
                    {/* Sütun 8 boş */}
                    <div className="col-start-9 row-start-1">{renderSeat(26)}</div>
                    <div className="col-start-10 row-start-1">{renderSeat(29)}</div>
                    <div className="col-start-11 row-start-1">{renderSeat(32)}</div>
                    <div className="col-start-12 row-start-1">{renderSeat(35)}</div>
                    <div className="col-start-13 row-start-1">{renderSeat(37)}</div>
                    <div className="col-start-14 row-start-1">{renderSeat(40)}</div>
                    
                    {/* 2. SIRA */}
                    <div className="col-start-1 row-start-2">{renderSeat(2)}</div>
                    <div className="col-start-2 row-start-2">{renderSeat(5)}</div>
                    <div className="col-start-3 row-start-2">{renderSeat(8)}</div>
                    <div className="col-start-4 row-start-2">{renderSeat(11)}</div>
                    <div className="col-start-5 row-start-2">{renderSeat(14)}</div>
                    <div className="col-start-6 row-start-2">{renderSeat(17)}</div>
                    <div className="col-start-7 row-start-2">{renderSeat(22)}</div>
                    {/* Sütun 8 boş */}
                    <div className="col-start-9 row-start-2">{renderSeat(25)}</div>
                    <div className="col-start-10 row-start-2">{renderSeat(28)}</div>
                    <div className="col-start-11 row-start-2">{renderSeat(31)}</div>
                    <div className="col-start-12 row-start-2">{renderSeat(34)}</div>
                    <div className="col-start-13 row-start-2">{renderSeat(38)}</div>
                    <div className="col-start-14 row-start-2">{renderSeat(39)}</div>
                    
                    {/* 3. SIRA - 41 numaralı koltuk en sağda ama merkezi */}
                    <div className="col-start-14 row-start-3">{renderSeat(41)}</div>
                    
                    {/* 4. SIRA */}
                    <div className="col-start-1 row-start-4">{renderSeat(1)}</div>
                    <div className="col-start-2 row-start-4">{renderSeat(4)}</div>
                    <div className="col-start-3 row-start-4">{renderSeat(7)}</div>
                    <div className="col-start-4 row-start-4">{renderSeat(10)}</div>
                    <div className="col-start-5 row-start-4">{renderSeat(13)}</div>
                    <div className="col-start-6 row-start-4">{renderSeat(16)}</div>
                    <div className="col-start-7 row-start-4">{renderSeat(19)}</div>
                    <div className="col-start-8 row-start-4">{renderSeat(20)}</div>
                    <div className="col-start-9 row-start-4">{renderSeat(21)}</div>
                    <div className="col-start-10 row-start-4">{renderSeat(24)}</div>
                    <div className="col-start-11 row-start-4">{renderSeat(27)}</div>
                    <div className="col-start-12 row-start-4">{renderSeat(30)}</div>
                    <div className="col-start-13 row-start-4">{renderSeat(33)}</div>
                    <div className="col-start-14 row-start-4">{renderSeat(36)}</div>
                  </>
                );
              })()}
              
            </div>
          </div>
        </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Koltuk Durumları</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-5 sm:w-8 sm:h-6 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-700">Boş Koltuk</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-5 sm:w-8 sm:h-6 bg-green-500 border-2 border-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Yeni Seçili</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-5 sm:w-8 sm:h-6 bg-blue-500 border-2 border-blue-600 rounded-md opacity-80 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-gray-700">Satın Alındı</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-5 sm:w-8 sm:h-6 bg-blue-200 border-2 border-blue-400 rounded-md opacity-60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-700">Erkek Yolcu</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-5 sm:w-8 sm:h-6 bg-pink-200 border-2 border-pink-400 rounded-md opacity-60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-700">Kadın Yolcu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ödeme Bölümü */}
        {selectedSeatIds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('trip.completeSelection')}</h3>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">{selectedSeatIds.length} {t('trip.seatsSelected')}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{t('trip.seatNumber')}:</span>
                      {[...selectedSeatIds].sort((a, b) => a - b).map((seatId, index) => (
                        <div key={seatId} className="inline-flex items-center gap-1">
                          {/* Mini Koltuk İkonu */}
                          <div className="relative">
                          <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 56 88" 
                              fill="none"
                              className="w-8 h-8 sm:w-10 sm:h-10"
                              style={{ color: '#10B981' }}
                            >
                              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 28 44)">
                                {/* Dış gövde */}
                                <rect x="10" y="6" width="36" height="76" rx="10" fill="currentColor" fillOpacity="0.1"/>
                                {/* Baş dayama (üst) */}
                                <rect x="14" y="8" width="28" height="16" rx="6" fill="currentColor" fillOpacity="0.2"/>
                                {/* Oturma minderi */}
                                <rect x="12" y="44" width="32" height="26" rx="8" fill="currentColor" fillOpacity="0.3"/>
                                {/* Minder dikişi */}
                                <line x1="12" y1="57" x2="44" y2="57"/>
                                {/* Kolçaklar */}
                                <rect x="4"  y="42" width="8"  height="20" rx="4" fill="currentColor" fillOpacity="0.2"/>
                                <rect x="44" y="42" width="8"  height="20" rx="4" fill="currentColor" fillOpacity="0.2"/>
                              </g>
                            </svg>
                            {/* Koltuk Numarası - Yuvarlak Circle */}
                            <div 
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-xs font-bold border shadow-sm"
                              style={{ 
                                borderColor: '#10B981',
                                backgroundColor: '#10B981',
                                color: 'white',
                                fontSize: '0.5rem'
                              }}
                            >
                              {seatId}
                            </div>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-sm text-gray-600 mb-1">{t('trip.totalPrice')}</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600 mb-3">{totalPrice} ₺</div>
                <Button
                  onClick={() => router.push('/payment')}
                  variant="primary"
                  size="md"
                  icon={CreditCard}
                  fullWidth={false}
                  className="w-full lg:w-auto rounded-full"
                >
                  {t('trip.continue')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Boş Koltuk Uyarısı */}
        {selectedSeatIds.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Koltuk Seçimi Gerekli</h3>
                <p className="text-sm text-yellow-700">Devam etmek için lütfen en az bir koltuk seçiniz.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailsPage;