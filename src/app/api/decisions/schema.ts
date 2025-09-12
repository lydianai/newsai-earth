export type Decision = {
  country: string;
  ministry: string;
  field: string;
  type: string; // Yasak, İzin, Duyuru, Kısıtlama, vb.
  subject: string;
  description: string;
  date: string;
  source: string;
  language: string; // Orijinal dil
  translated?: {
    [lang: string]: {
      subject: string;
      description: string;
    }
  };
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
};

export const countries = [
  // Europe
  "Türkiye", "Almanya", "Fransa", "İngiltere", "İtalya", "İspanya", "Hollanda", "Belçika", "İsviçre", "Avusturya", 
  "İsveç", "Norveç", "Finlandiya", "Danimarka", "Polonya", "Macaristan", "Çekya", "Slovakya", "Slovenya", "Hırvatistan",
  "Sırbistan", "Bulgaristan", "Romanya", "Yunanistan", "Portekiz", "İrlanda", "Estonya", "Letonya", "Litvanya", "Lüksemburg",
  "Malta", "Kıbrıs", "İzlanda", "Bosna Hersek", "Kuzey Makedonya", "Arnavutluk", "Karadağ", "Moldova", "Ukrayna", "Belarus",
  
  // Americas  
  "ABD", "Kanada", "Meksika", "Brezilya", "Arjantin", "Şili", "Kolombiya", "Peru", "Venezuela", "Ekvador", 
  "Uruguay", "Paraguay", "Bolivya", "Guyana", "Surinam", "Küba", "Jamaika", "Trinidad ve Tobago", "Barbados", "Bahama",
  
  // Asia-Pacific
  "Çin", "Japonya", "Güney Kore", "Hindistan", "Endonezya", "Tayland", "Vietnam", "Malezya", "Singapur", "Filipinler",
  "Myanmar", "Kamboçya", "Laos", "Brunei", "Bangladeş", "Pakistan", "Sri Lanka", "Nepal", "Butan", "Maldivler",
  "Afganistan", "Kazakistan", "Özbekistan", "Tacikistan", "Kırgızistan", "Türkmenistan", "Moğolistan", "Kuzey Kore",
  "Avustralya", "Yeni Zelanda", "Fiji", "Papua Yeni Gine", "Vanuatu", "Solomon Adaları", "Samoa", "Tonga",
  
  // Middle East
  "Suudi Arabistan", "İran", "Irak", "Suriye", "Lübnan", "Ürdün", "İsrail", "Filistin", "Kuveyt", "Bahreyn",
  "Katar", "BAE", "Umman", "Yemen", "Ermenistan", "Azerbaycan", "Gürcistan",
  
  // Africa
  "Güney Afrika", "Nijerya", "Mısır", "Kenya", "Fas", "Tunus", "Cezayir", "Libya", "Sudan", "Etiyopya",
  "Gana", "Senegal", "Mali", "Burkina Faso", "Niger", "Çad", "Kamerun", "Gabon", "Kongo", "Angola",
  "Zambiya", "Zimbabwe", "Botsvana", "Namibya", "Mozambik", "Madagaskar", "Mauritius", "Seycheller"
];

export const ministries = [
  // Core Ministries
  "Sağlık", "Eğitim", "İçişleri", "Dışişleri", "Adalet", "Savunma", "Maliye", "Ekonomi",
  
  // Economic & Development
  "Tarım", "Sanayi", "Ticaret", "Enerji", "Ulaştırma", "Turizm", "Kalkınma", "Yatırım",
  
  // Social & Cultural
  "Çalışma", "Aile", "Sosyal Güvenlik", "Kültür", "Gençlik", "Spor", "Din İşleri",
  
  // Environment & Infrastructure
  "Çevre", "Şehircilik", "İklim", "Orman", "Su İşleri", "Altyapı", "İnşaat", "Konut",
  
  // Science & Technology
  "Bilim", "Teknoloji", "İletişim", "Dijital", "Uzay", "Araştırma", "İnovasyon",
  
  // Specialized
  "Gümrük", "Vergi", "Bankacılık", "Sigorta", "Finans", "İstatistik", "Planlama",
  "Afet", "Acil Durum", "Göç", "Mülteci", "İnsan Hakları", "Şeffaflık", "Denetim",
  
  // Regional Variations
  "İç Güvenlik", "Sınır Güvenliği", "İstihbarat", "Kamu Güvenliği", "Jandarma",
  "Sahil Güvenlik", "Hava Kuvvetleri", "Deniz Kuvvetleri", "Kara Kuvvetleri",
  
  // International/Special
  "AB İşleri", "Kalkınma İşbirliği", "Diaspora", "Kültürler", "Azınlık Hakları",
  "Kadın Hakları", "Çocuk Hakları", "Yaşlı Bakımı", "Engelli Hakları"
];

export const decisionTypes = [
  // Regulatory Types
  "Yasak", "İzin", "Onay", "Red", "Düzenleme", "Yönetmelik", "Kanun", "Tüzük",
  
  // Administrative Actions  
  "Duyuru", "Karar", "Kararname", "Genelge", "Talimat", "Rehber", "Standart",
  
  // Economic Instruments
  "Teşvik", "Destek", "Hibe", "Kredi", "Vergi", "İndirim", "Artırım", "Kesinti",
  
  // Policy Categories
  "Kısıtlama", "Sınırlama", "Gevşetme", "Sıkılaştırma", "Reform", "Revizyon",
  
  // Legal Status
  "Geçici", "Kalıcı", "Sürekli", "Dönemsel", "Acil", "Olağanüstü", "Normal",
  
  // Implementation
  "Uygulama", "İcra", "Denetim", "Kontrol", "Değerlendirme", "Raporlama",
  
  // International
  "Anlaşma", "Protokol", "Mutabakat", "İşbirliği", "Ortaklık", "Ticaret",
  
  // Procedural
  "Başvuru", "Başlatma", "Sonlandırma", "İptal", "Erteleme", "Uzatma", "Yenileme"
];

export const languages = [
  // Major Languages
  "tr", "en", "de", "fr", "es", "ru", "zh", "ja", "ar", "pt", "it", "hi",
  
  // European Languages
  "nl", "sv", "no", "fi", "da", "pl", "cs", "hu", "ro", "bg", "hr", "sk", 
  "sl", "et", "lv", "lt", "el", "mt", "ga", "cy", "eu", "ca",
  
  // Asian Languages  
  "ko", "th", "vi", "id", "ms", "tl", "bn", "ur", "fa", "he", "ta", "te",
  "ml", "kn", "gu", "pa", "or", "as", "ne", "si", "my", "km", "lo",
  
  // Other Regional Languages
  "sw", "af", "am", "ha", "yo", "ig", "zu", "xh", "st", "tn", "ve", "nr", "ss",
  "is", "mt", "mk", "sq", "bs", "sr", "me", "bg", "uk", "be", "ka", "hy", "az"
];

export const fields = [
  // Core Sectors
  "Sağlık", "Eğitim", "Ekonomi", "Teknoloji", "Çevre", "Enerji", "Tarım", "Sanayi",
  
  // Government & Law
  "Hukuk", "Güvenlik", "Savunma", "Diplomasi", "İdare", "Vergi", "Gümrük",
  
  // Social & Cultural
  "Sosyal", "Kültür", "Spor", "Medya", "Sanat", "Din", "Dil", "Etnisite",
  
  // Infrastructure & Urban
  "Ulaştırma", "İnşaat", "Konut", "Şehircilik", "Altyapı", "Su", "Atık",
  
  // Business & Trade
  "Ticaret", "Finans", "Bankacılık", "Sigorta", "Turizm", "Lojistik", "İhracat", "İthalat",
  
  // Science & Innovation
  "Araştırma", "İnovasyon", "Patent", "Standart", "Kalite", "Ölçü", "Test",
  
  // Environment & Sustainability
  "İklim", "Karbon", "Emisyon", "Geri Dönüşüm", "Biyoçeşitlilik", "Koruma",
  
  // Digital & Communications
  "Dijital", "İnternet", "Telekom", "Veri", "Siber", "Yapay Zeka", "Blockchain",
  
  // Healthcare Specializations
  "İlaç", "Tıbbi Cihaz", "Hastane", "Aşı", "Pandemi", "Halk Sağlığı",
  
  // Energy Specializations  
  "Petrol", "Doğalgaz", "Elektrik", "Yenilenebilir", "Nükleer", "Kömür",
  
  // Transportation
  "Havacılık", "Denizcilk", "Demiryolu", "Karayolu", "Toplu Taşıma",
  
  // International Relations
  "Göç", "Mülteci", "Vize", "Pasaport", "Sınır", "Gümrük", "Ticaret Savaşı"
];

// Helper function for priority assignment
export function getDecisionPriority(decision: Decision): 'low' | 'medium' | 'high' | 'critical' {
  const criticalKeywords = ['yasak', 'acil', 'pandemic', 'emergency', 'ban', 'suspend'];
  const highKeywords = ['düzenleme', 'regulation', 'law', 'kanun', 'reform'];
  const mediumKeywords = ['teşvik', 'support', 'incentive', 'approve', 'onay'];
  
  const text = `${decision.subject} ${decision.description}`.toLowerCase();
  
  if (criticalKeywords.some(keyword => text.includes(keyword))) return 'critical';
  if (highKeywords.some(keyword => text.includes(keyword))) return 'high';
  if (mediumKeywords.some(keyword => text.includes(keyword))) return 'medium';
  
  return 'low';
}

// Helper function for auto-tagging
export function generateTags(decision: Decision): string[] {
  const tags: string[] = [];
  const text = `${decision.subject} ${decision.description}`.toLowerCase();
  
  // Add field-based tags
  tags.push(decision.field);
  tags.push(decision.type);
  tags.push(decision.country);
  
  // Add keyword-based tags
  if (text.includes('digital') || text.includes('dijital')) tags.push('digital');
  if (text.includes('climate') || text.includes('iklim')) tags.push('climate');
  if (text.includes('ai') || text.includes('yapay zeka')) tags.push('ai');
  if (text.includes('covid') || text.includes('pandemic')) tags.push('pandemic');
  if (text.includes('trade') || text.includes('ticaret')) tags.push('trade');
  if (text.includes('tax') || text.includes('vergi')) tags.push('tax');
  if (text.includes('green') || text.includes('yeşil')) tags.push('green');
  if (text.includes('innovation') || text.includes('inovasyon')) tags.push('innovation');
  
  return [...new Set(tags)]; // Remove duplicates
}
