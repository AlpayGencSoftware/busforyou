'use client';

import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const mockTicketsTemplate = [
  {
    id: 'TKT-001',
    tripId: 'IST-ANK-0900',
    fromCity: 'İstanbul',
    toCity: 'Ankara',
    date: '2025-01-20',
    departureTime: '09:00',
    arrivalTime: '13:30',
    seatNumbers: [15, 16],
    totalPrice: 900,
    status: 'active', // active, used, cancelled
    purchaseDate: '2025-01-15T10:30:00Z',
    busPlate: '34 ABC 123',
    companyName: 'Bus4You',

    payment: {
      method: 'Kredi Kartı',
      cardLastFour: '1234',
      transactionId: 'TXN-001-2025',
      paymentDate: '2025-01-15T10:30:00Z'
    }
  },
  {
    id: 'TKT-002',
    tripId: 'ANK-IST-1800',
    fromCity: 'Ankara',
    toCity: 'İstanbul',
    date: '2025-01-18',
    departureTime: '18:00',
    arrivalTime: '22:30',
    seatNumbers: [8],
    totalPrice: 450,
    status: 'used',
    purchaseDate: '2025-01-10T14:20:00Z',
    busPlate: '06 XYZ 789',
    companyName: 'Bus4You',

    payment: {
      method: 'Kredi Kartı',
      cardLastFour: '5678',
      transactionId: 'TXN-002-2025',
      paymentDate: '2025-01-10T14:20:00Z'
    }
  },
  {
    id: 'TKT-003',
    tripId: 'IST-IZM-1400',
    fromCity: 'İstanbul',
    toCity: 'İzmir',
    date: '2025-02-05',
    departureTime: '14:00',
    arrivalTime: '19:30',
    seatNumbers: [23, 24, 25],
    totalPrice: 1350,
    status: 'active',
    purchaseDate: '2025-01-16T16:45:00Z',
    busPlate: '35 DEF 456',
    companyName: 'Bus4You',

    payment: {
      method: 'Kredi Kartı',
      cardLastFour: '9012',
      transactionId: 'TXN-003-2025',
      paymentDate: '2025-01-16T16:45:00Z'
    }
  }
];

export default function TicketsPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'cancelled'>('all');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);


  const allTicketsInStore = useAppSelector((state) => state.tickets.tickets);
  const userTickets = useAppSelector((state) => state.tickets.tickets.filter(t => t.userId === currentUser?.id));
  

  const tickets = userTickets.length > 0 ? userTickets : (currentUser ? mockTicketsTemplate.map(ticket => ({
    ...ticket,
    passengerName: `${currentUser.firstName.toUpperCase()} ${currentUser.lastName.toUpperCase()}`,
    purchaser: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone || '+90 532 123 45 67',
      tcNumber: currentUser.tcNumber || '12345678901',
      gender: currentUser.gender,
      birthDate: currentUser.birthDate
    }
  })) : []);
  



  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Biletlerinizi Görüntüleyin</h2>
          <p className="text-gray-600 mb-6">Biletlerinizi görüntülemek için giriş yapmanız gerekmektedir.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }


  const downloadTicketPDF = async (ticket: any) => {
    setIsDownloading(ticket.id);
    
    try {

      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `
        <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; max-width: 800px; margin: 0 auto;">
          <!-- Modern Header -->
          <div style="background: linear-gradient(135deg, #FFD800 0%, #FFA000 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 15px rgba(255, 216, 0, 0.3);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #FFD800;">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <span style="color: white;">bus</span><span style="font-size: 36px; color: #1a1a1a;">4</span><span style="color: white;">you</span>
                </h1>
              </div>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 500;">Otobüs Bileti</p>
          </div>

          <!-- Bilet Bilgileri -->
          <div style="display: grid; grid-template-columns: 1fr 250px; gap: 30px; margin-bottom: 25px;">
            <!-- Sol Kolon: Sefer Detayları -->
            <div>
              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
                <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">🚌 Sefer Bilgileri</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div><span style="color: #6b7280; font-size: 14px;">Bilet No</span><br/><strong style="color: #1f2937; font-size: 16px;">${ticket.id}</strong></div>
                  <div><span style="color: #6b7280; font-size: 14px;">Sefer Kodu</span><br/><strong style="color: #1f2937; font-size: 16px;">${ticket.tripId}</strong></div>
                </div>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-top: 15px; border-left: 4px solid #10b981;">
                <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">🗺️ Güzergah</h3>
                <div style="text-align: center; margin: 15px 0;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                    <div style="text-align: center;">
                      <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600; margin-bottom: 5px;">${ticket.fromCity}</div>
                      <div style="color: #6b7280; font-size: 14px;">${ticket.departureTime}</div>
                    </div>
                    <div style="color: #10b981; font-size: 24px;">→</div>
                    <div style="text-align: center;">
                      <div style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600; margin-bottom: 5px;">${ticket.toCity}</div>
                      <div style="color: #6b7280; font-size: 14px;">${ticket.arrivalTime}</div>
                    </div>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                  <span style="background: white; padding: 6px 12px; border-radius: 6px; color: #1f2937; font-weight: 500; border: 1px solid #d1d5db;">
                    📅 ${new Date(ticket.date).toLocaleDateString('tr-TR', { 
                      day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
                    })}
                  </span>
                </div>
              </div>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin-top: 15px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">🎫 Koltuk & Araç</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div><span style="color: #6b7280; font-size: 14px;">Koltuk No</span><br/><strong style="color: #1f2937; font-size: 16px;">${ticket.seatNumbers.join(', ')}</strong></div>
                  <div><span style="color: #6b7280; font-size: 14px;">Plaka</span><br/><strong style="color: #1f2937; font-size: 16px;">${ticket.busPlate}</strong></div>
                </div>
              </div>
            </div>
            
            <!-- Sağ Kolon: Fiyat ve QR -->
            <div>
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; border-radius: 12px; text-align: center; color: white; margin-bottom: 20px;">
                <p style="margin: 0; opacity: 0.9; font-size: 14px; font-weight: 500;">Toplam Tutar</p>
                <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${ticket.totalPrice} ₺</p>
                <div style="background: rgba(255,255,255,0.2); height: 1px; margin: 15px 0;"></div>
                <p style="margin: 0; opacity: 0.8; font-size: 12px;">KDV Dahil</p>
              </div>
              
              <div style="background: white; border: 2px dashed #d1d5db; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="width: 80px; height: 80px; background: #f3f4f6; margin: 0 auto 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px;">📱</span>
                </div>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">QR Kod</p>
                <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 11px;">Mobil Kontrol</p>
              </div>
            </div>
          </div>

          <!-- Yolcu ve Ödeme Bilgileri -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <!-- Yolcu Bilgileri -->
            <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">👤 Yolcu Bilgileri</h3>
              <div style="space-y: 8px;">
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">Ad Soyad</span><br/><strong style="color: #1f2937;">${ticket.purchaser.firstName} ${ticket.purchaser.lastName}</strong></div>
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">E-posta</span><br/><strong style="color: #1f2937;">${ticket.purchaser.email}</strong></div>
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">Telefon</span><br/><strong style="color: #1f2937;">${ticket.purchaser.phone}</strong></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                  <div><span style="color: #6b7280; font-size: 14px;">Cinsiyet</span><br/><strong style="color: #1f2937;">${ticket.purchaser.gender === 'male' ? 'Erkek' : 'Kadın'}</strong></div>
                  <div><span style="color: #6b7280; font-size: 14px;">Doğum Tarihi</span><br/><strong style="color: #1f2937;">${new Date(ticket.purchaser.birthDate).toLocaleDateString('tr-TR')}</strong></div>
                </div>
              </div>
            </div>
            
            <!-- Ödeme Bilgileri -->
            <div style="background: #fef7f0; border-radius: 12px; padding: 20px; border-left: 4px solid #f97316;">
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">💳 Ödeme Bilgileri</h3>
              <div style="space-y: 8px;">
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">Ödeme Yöntemi</span><br/><strong style="color: #1f2937;">${ticket.payment.method}</strong></div>
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">Kart Bilgisi</span><br/><strong style="color: #1f2937;">**** **** **** ${ticket.payment.cardLastFour}</strong></div>
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">İşlem ID</span><br/><strong style="color: #1f2937;">${ticket.payment.transactionId}</strong></div>
                <div style="margin-bottom: 8px;"><span style="color: #6b7280; font-size: 14px;">Ödeme Tarihi</span><br/><strong style="color: #1f2937;">${new Date(ticket.payment.paymentDate).toLocaleDateString('tr-TR', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })} ${new Date(ticket.payment.paymentDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</strong></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; border: 2px dashed #e2e8f0; margin-top: 25px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 20px;">✅</span>
              <h4 style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 600;">Bilet Onaylandı</h4>
            </div>
            <div style="background: white; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <p style="margin: 0; color: #059669; font-weight: 600; font-size: 14px;">✓ Ödeme Tamamlandı</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">Bilet ID: ${ticket.id}</p>
            </div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                Bu bilet <strong style="color: #1f2937;">Bus4You</strong> tarafından elektronik olarak oluşturulmuştur.<br/>
                Seyahat sırasında yanınızda bulundurmanız gerekmektedir.
              </p>
              <div style="margin-top: 10px; padding: 8px 16px; background: linear-gradient(90deg, #FFD800, #FFA000); border-radius: 20px; display: inline-block;">
                <span style="color: white; font-size: 12px; font-weight: 600;">🎉 İyi Yolculuklar!</span>
              </div>
            </div>
          </div>
          
          <!-- Basılma Tarihi -->
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 11px;">
            <p style="margin: 0;">Basılma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</p>
          </div>
        </div>
      `;


      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.width = '800px';
      document.body.appendChild(pdfContent);


      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: pdfContent.scrollHeight,
        width: pdfContent.scrollWidth
      });


      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      

      const xOffset = 10;
      let yOffset = 10;
      

      if (imgHeight > pdfHeight - 20) {
        const scaledHeight = pdfHeight - 20;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        const centeredX = (pdfWidth - scaledWidth) / 2;
        pdf.addImage(imgData, 'PNG', centeredX, yOffset, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      }
      pdf.save(`Bus4You-Bilet-${ticket.id}.pdf`);


      document.body.removeChild(pdfContent);
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsDownloading(null);
    }
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-32" style={{ background: "var(--bg-gradient)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Gerekli</h2>
          <p className="text-gray-600 mb-6">
            Biletlerinizi görmek için giriş yapmanız gerekiyor.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }


  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };


  const formatPurchaseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Aktif',
          color: 'text-green-700',
          bg: 'bg-green-100',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'used':
        return {
          text: 'Kullanıldı',
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'cancelled':
        return {
          text: 'İptal',
          color: 'text-red-700',
          bg: 'bg-red-100',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return {
          text: 'Bilinmiyor',
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: null
        };
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-32" style={{ background: "var(--bg-gradient)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Biletlerim</h1>
                <p className="text-gray-600">Satın aldığınız biletleri görüntüleyin</p>
              </div>
            </div>

            {/* Filtre Butonları */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü ({tickets.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aktif ({tickets.filter(t => t.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('used')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'used' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Kullanıldı ({tickets.filter(t => t.status === 'used').length})
              </button>
            </div>
          </div>
        </div>

        {/* Bilet Listesi */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bilet Bulunamadı</h3>
              <p className="text-gray-600 mb-6">Seçilen filtreye uygun bilet bulunmuyor.</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Bilet Satın Al
              </button>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const statusInfo = getStatusInfo(ticket.status);
              const isExpanded = selectedTicket === ticket.id;
              
              return (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  {/* Bilet Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedTicket(isExpanded ? null : ticket.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Route */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{ticket.departureTime}</div>
                            <div className="text-sm font-medium text-gray-700">{ticket.fromCity}</div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="h-px bg-gray-300 w-16"></div>
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              <div className="h-px bg-gray-300 w-16"></div>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(ticket.date)}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{ticket.arrivalTime}</div>
                            <div className="text-sm font-medium text-gray-700">{ticket.toCity}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </div>

                        {/* Price & Seats */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{ticket.totalPrice} ₺</div>
                          <div className="text-sm text-gray-600">
                            Koltuk: {ticket.seatNumbers.join(', ')}
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bilet Detayları */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Sol Kolon - Bilet Bilgileri */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Bilet Bilgileri
                            </h3>
                            
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bilet No:</span>
                                <span className="font-medium text-gray-900">{ticket.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sefer Kodu:</span>
                                <span className="font-medium text-gray-900">{ticket.tripId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Koltuk No:</span>
                                <span className="font-medium text-gray-900">{ticket.seatNumbers.join(', ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Otobüs Plakası:</span>
                                <span className="font-medium text-gray-900">{ticket.busPlate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Firma:</span>
                                <span className="font-medium text-gray-900">{ticket.companyName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Orta Kolon - Yolcu Bilgileri */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Satın Alan Bilgileri
                            </h3>
                            
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ad Soyad:</span>
                                <span className="font-medium text-gray-900">{ticket.purchaser.firstName} {ticket.purchaser.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">E-posta:</span>
                                <span className="font-medium text-gray-900">{ticket.purchaser.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Telefon:</span>
                                <span className="font-medium text-gray-900">{ticket.purchaser.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">TC Kimlik:</span>
                                <span className="font-medium text-gray-900">{ticket.purchaser.tcNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cinsiyet:</span>
                                <span className="font-medium text-gray-900">{ticket.purchaser.gender === 'male' ? 'Erkek' : 'Kadın'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Doğum Tarihi:</span>
                                <span className="font-medium text-gray-900">{new Date(ticket.purchaser.birthDate).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Sağ Kolon - Ödeme ve İşlemler */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                              </svg>
                              Ödeme Bilgileri
                            </h3>
                            
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ödeme Yöntemi:</span>
                                <span className="font-medium text-gray-900">{ticket.payment.method}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Kart Son 4 Hane:</span>
                                <span className="font-medium text-gray-900">**** {ticket.payment.cardLastFour}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">İşlem No:</span>
                                <span className="font-medium text-gray-900">{ticket.payment.transactionId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ödeme Tarihi:</span>
                                <span className="font-medium text-gray-900">{formatPurchaseDate(ticket.payment.paymentDate)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-3 mt-3">
                                <span className="text-gray-600">Toplam Tutar:</span>
                                <span className="font-bold text-green-600 text-lg">{ticket.totalPrice} ₺</span>
                              </div>
                            </div>

                            {/* İşlem Butonları */}
                            <div className="flex flex-col gap-3 pt-4">
                              <button 
                                onClick={() => downloadTicketPDF(ticket)}
                                disabled={isDownloading === ticket.id}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                {isDownloading === ticket.id ? (
                                  <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    İndiriliyor...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    PDF İndir
                                  </>
                                )}
                              </button>
                              
                              {ticket.status === 'active' && (
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  İptal Et
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* QR Kod Bölümü */}
                        <div className="mt-6 pt-6 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Dijital Bilet</h3>
                              <p className="text-sm text-gray-600">
                                Otobüse binerken bu QR kodu gösteriniz
                              </p>
                            </div>
                            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
