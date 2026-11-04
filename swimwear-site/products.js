// Shared product catalog for the calma swimwear shop.
const PRODUCTS = [
  // חלק תחתון (bottoms)
  { id: 1, name: 'תחתון "קלאסי"', category: 'bottoms', catLabel: 'חלק תחתון', price: 79, emoji: '🩲', colors: ['#111111', '#8fd3d0'], gradient: 'linear-gradient(150deg, #f6e3c8, #e8b98a)' },
  { id: 2, name: 'תחתון "ברזילי"', category: 'bottoms', catLabel: 'חלק תחתון', price: 89, emoji: '🩲', colors: ['#d9a05b', '#f0a8a0'], gradient: 'linear-gradient(150deg, #d8f1ee, #8fd3d0)' },
  { id: 3, name: 'תחתון "גבוה"', category: 'bottoms', catLabel: 'חלק תחתון', price: 99, emoji: '🩲', colors: ['#111111', '#f7f3ec'], gradient: 'linear-gradient(150deg, #fbe2df, #f0a8a0)' },

  // חלק עליון (tops)
  { id: 4, name: 'חזייה "טריאנגל"', category: 'tops', catLabel: 'חלק עליון', price: 109, emoji: '👙', colors: ['#a8cbe8', '#8fd3d0'], gradient: 'linear-gradient(150deg, #dce9f5, #a8cbe8)' },
  { id: 5, name: 'חזייה "בנדו"', category: 'tops', catLabel: 'חלק עליון', price: 99, emoji: '👙', colors: ['#d9a05b', '#e8b98a'], gradient: 'linear-gradient(150deg, #f6dfb5, #d9a05b)' },
  { id: 6, name: 'חזייה "ספורט"', category: 'tops', catLabel: 'חלק עליון', price: 119, emoji: '👙', colors: ['#111111', '#e4ddd0'], gradient: 'linear-gradient(150deg, #f7f3ec, #e4ddd0)' },

  // בגד ים שלם (onepiece)
  { id: 7, name: 'בגד ים שלם "לגונה"', category: 'onepiece', catLabel: 'בגד ים שלם', price: 249, emoji: '🩱', colors: ['#8fd3d0', '#5bb7b2'], gradient: 'linear-gradient(150deg, #d8f1ee, #8fd3d0)' },
  { id: 8, name: 'בגד ים שלם "מינימלי"', category: 'onepiece', catLabel: 'בגד ים שלם', price: 229, emoji: '🩱', colors: ['#111111', '#3a3a3a'], gradient: 'linear-gradient(150deg, #4a4a4a, #1a1a1a)' },
  { id: 9, name: 'בגד ים שלם "קלאסי"', category: 'onepiece', catLabel: 'בגד ים שלם', price: 259, emoji: '🩱', colors: ['#f0a8a0', '#dd8b86'], gradient: 'linear-gradient(150deg, #fbe2df, #f0a8a0)' },

  // NEW IN — מוצרים חדשים
  { id: 10, name: 'DIOSA SET', newIn: true, set: true, price: 300, sizes: 'XXS–XL', img: 'media/diosa-1.jpg', images: ['media/diosa-1.jpg', 'media/diosa-2.jpg'],
    colorOptions: [{ name: 'מנומר', type: 'dots', c1: '#5F2E1C', c2: '#A07755' }],
    braSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'], bottomSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '', gallery: ['media/ugc-1.jpg'] },
  { id: 11, name: 'DIOSA BOTTOM', category: 'bottoms', catLabel: 'BOTTOMS', price: 0, priceLabel: 'מהסט · 300 ₪', sizes: 'XXS–XL', img: 'media/diosa-1.jpg',
    colorOptions: [{ name: 'מנומר', type: 'dots', c1: '#5F2E1C', c2: '#A07755' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 12, name: 'DIOSA TOP', category: 'tops', catLabel: 'TOPS', price: 0, priceLabel: 'מהסט · 300 ₪', sizes: 'XXS–XL', img: 'media/diosa-1.jpg',
    colorOptions: [{ name: 'מנומר', type: 'dots', c1: '#5F2E1C', c2: '#A07755' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  // NEW IN — סטים (Rosita)
  { id: 13, name: 'Rosita Set', newIn: true, set: true, price: 300, sizes: 'XXS–XL', img: 'media/rosita-1.jpg', images: ['media/rosita-1.jpg', 'media/rosita-2.jpg'],
    colorOptions: [{ name: 'ורוד זוהר', type: 'solid', c: '#B06066' }],
    braSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'], bottomSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 14, name: 'Rosita Bottom', category: 'bottoms', catLabel: 'BOTTOMS', price: 0, priceLabel: 'מהסט · 300 ₪', sizes: 'XXS–XL', img: 'media/rosita-1.jpg',
    colorOptions: [{ name: 'ורוד זוהר', type: 'solid', c: '#B06066' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 15, name: 'Rosita Top', category: 'tops', catLabel: 'TOPS', price: 0, priceLabel: 'מהסט · 300 ₪', sizes: 'XXS–XL', img: 'media/rosita-1.jpg',
    colorOptions: [{ name: 'ורוד זוהר', type: 'solid', c: '#B06066' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 16, name: 'Hibiscus Set', newIn: true, set: true, price: 350, sizes: 'XXS–XL', img: 'media/hibiscus-1.jpg', images: ['media/hibiscus-1.jpg', 'media/hibiscus-2.jpg'],
    colorOptions: [{ name: 'טרהקוטה', type: 'solid', c: '#8A5C48' }],
    braSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'], bottomSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 17, name: 'Hibiscus Bottom', category: 'bottoms', catLabel: 'BOTTOMS', price: 0, priceLabel: 'מהסט · 350 ₪', sizes: 'XXS–XL', img: 'media/hibiscus-1.jpg',
    colorOptions: [{ name: 'טרהקוטה', type: 'solid', c: '#8A5C48' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
  { id: 18, name: 'Hibiscus Top', category: 'tops', catLabel: 'TOPS', price: 0, priceLabel: 'מהסט · 350 ₪', sizes: 'XXS–XL', img: 'media/hibiscus-1.jpg',
    colorOptions: [{ name: 'טרהקוטה', type: 'solid', c: '#8A5C48' }],
    sizeList: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    description: '', fabric: '', modelInfo: '', sizeGuideText: '' },
];

const CATEGORIES = {
  bottoms: { label: 'BOTTOMS', emoji: '🩲' },
  tops: { label: 'TOPS', emoji: '👙' },
  onepiece: { label: 'ONE-PIECE', emoji: '🩱' },
};
