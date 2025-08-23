// Bu dosya Button component'inin nasıl kullanılacağını gösteren örnekleri içerir
// Gerçek projede kullanılmaz, sadece referans amaçlıdır

import { Button } from './Button';
import { Search, Plus, Download, ArrowRight, Heart, ShoppingCart } from 'lucide-react';

export function ButtonExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Button Component Örnekleri</h1>
      
      {/* Primary Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Primary Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm" icon={Search}>
            Ara
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            Ekle
          </Button>
          <Button variant="primary" size="lg" icon={Download}>
            İndir
          </Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Secondary Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="sm" icon={Heart}>
            Beğen
          </Button>
          <Button variant="secondary" size="md" icon={ShoppingCart}>
            Sepete Ekle
          </Button>
          <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
            Devam Et
          </Button>
        </div>
      </div>

      {/* Outline Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Outline Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm">
            İptal
          </Button>
          <Button variant="outline" size="md" icon={Download}>
            PDF İndir
          </Button>
          <Button variant="outline" size="lg" fullWidth>
            Tam Genişlik
          </Button>
        </div>
      </div>

      {/* Ghost Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Ghost Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="ghost" size="sm">
            Geri
          </Button>
          <Button variant="ghost" size="md" icon={ArrowRight}>
            İleri
          </Button>
        </div>
      </div>

      {/* Danger Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Danger Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="danger" size="sm">
            Sil
          </Button>
          <Button variant="danger" size="md" icon={Download}>
            İptal Et
          </Button>
          <Button variant="danger" size="lg" fullWidth>
            Hesabı Kapat
          </Button>
        </div>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="md" loading>
            Yükleniyor
          </Button>
          <Button variant="secondary" size="md" loading>
            İşleniyor
          </Button>
        </div>
      </div>

      {/* Mobile Text Examples */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mobile Text Examples</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="md" icon={Search} mobileText="Ara">
            Sefer Ara
          </Button>
          <Button variant="secondary" size="md" icon={Download} mobileText="İndir">
            Bilet İndir
          </Button>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="md" disabled>
            Devre Dışı
          </Button>
          <Button variant="secondary" size="md" icon={Plus} disabled>
            Eklenemez
          </Button>
        </div>
      </div>
    </div>
  );
}
