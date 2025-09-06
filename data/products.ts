import { Product } from '@/types/product';

export const categories = [
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'headphones', name: 'Audífonos', icon: '🎧' },
  { id: 'tablets', name: 'Tablets', icon: '📟' },
  { id: 'cameras', name: 'Cámaras', icon: '📷' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'accessories', name: 'Accesorios', icon: '🔌' },
];

export const brands = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Microsoft', 'Google', 'OnePlus', 'Xiaomi'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14" M3',
    brand: 'Apple',
    category: 'laptops',
    price: 1999.99,
    originalPrice: 2199.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'
    ],
    description: 'La MacBook Pro más avanzada con chip M3, perfecta para profesionales creativos y desarrolladores.',
    specifications: {
      'Procesador': 'Apple M3 8-core',
      'Memoria': '16GB RAM',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '14.2" Liquid Retina XDR',
      'Batería': 'Hasta 18 horas',
      'Peso': '1.6 kg'
    },
    rating: 4.8,
    reviews: 324,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 1099.99,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
    ],
    description: 'El iPhone más avanzado con titanio, cámara profesional y chip A17 Pro.',
    specifications: {
      'Pantalla': '6.1" Super Retina XDR',
      'Procesador': 'A17 Pro',
      'Almacenamiento': '128GB',
      'Cámara': 'Triple cámara 48MP',
      'Conectividad': '5G, WiFi 6E',
      'Material': 'Titanio grado aeroespacial'
    },
    rating: 4.7,
    reviews: 892,
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 1199.99,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'
    ],
    description: 'Smartphone premium con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X.',
    specifications: {
      'Pantalla': '6.8" Dynamic AMOLED 2X',
      'Procesador': 'Snapdragon 8 Gen 3',
      'Memoria': '12GB RAM',
      'Almacenamiento': '256GB',
      'Cámara': 'Cuádruple cámara 200MP',
      'S Pen': 'Incluido'
    },
    rating: 4.6,
    reviews: 567,
    inStock: true
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'headphones',
    price: 349.99,
    originalPrice: 399.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    description: 'Auriculares inalámbricos premium con cancelación de ruido líder en la industria.',
    specifications: {
      'Tipo': 'Circumaurales inalámbricos',
      'Cancelación de ruido': 'Sí, adaptativa',
      'Batería': 'Hasta 30 horas',
      'Conectividad': 'Bluetooth 5.2, NFC',
      'Carga rápida': '3 min = 3 horas de uso',
      'Peso': '250g'
    },
    rating: 4.9,
    reviews: 1203,
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Dell XPS 13',
    brand: 'Dell',
    category: 'laptops',
    price: 1299.99,
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    images: [
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg'
    ],
    description: 'Ultrabook compacta con pantalla InfinityEdge y rendimiento excepcional.',
    specifications: {
      'Procesador': 'Intel Core i7-1365U',
      'Memoria': '16GB LPDDR5',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '13.4" FHD+ InfinityEdge',
      'Peso': '1.2 kg',
      'Sistema': 'Windows 11 Home'
    },
    rating: 4.5,
    reviews: 445,
    inStock: true
  },
  {
    id: '6',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    category: 'tablets',
    price: 1099.99,
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
      'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg'
    ],
    description: 'El iPad más avanzado con chip M2, pantalla Liquid Retina XDR y compatibilidad con Apple Pencil.',
    specifications: {
      'Pantalla': '12.9" Liquid Retina XDR',
      'Procesador': 'Apple M2',
      'Almacenamiento': '128GB',
      'Cámara': 'Sistema de cámaras Pro',
      'Conectividad': 'WiFi 6E + 5G',
      'Accesorios': 'Compatible con Apple Pencil'
    },
    rating: 4.8,
    reviews: 723,
    inStock: true,
    featured: true
  },
  {
    id: '7',
    name: 'Sony Alpha A7 IV',
    brand: 'Sony',
    category: 'cameras',
    price: 2499.99,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg'
    ],
    description: 'Cámara mirrorless full-frame con resolución de 33MP y video 4K.',
    specifications: {
      'Sensor': '33MP Full-Frame CMOS',
      'Video': '4K 60p/120p',
      'Estabilización': '5.5 pasos IBIS',
      'Pantalla': '3" LCD táctil articulada',
      'Conectividad': 'WiFi, Bluetooth, USB-C',
      'Batería': 'Hasta 580 disparos'
    },
    rating: 4.7,
    reviews: 234,
    inStock: true
  },
  {
    id: '8',
    name: 'PlayStation 5',
    brand: 'Sony',
    category: 'gaming',
    price: 499.99,
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    images: [
      'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
    ],
    description: 'La consola de videojuegos más avanzada con SSD ultra rápido y gráficos ray tracing.',
    specifications: {
      'Procesador': 'AMD Zen 2 8-core',
      'GPU': 'AMD RDNA 2',
      'Memoria': '16GB GDDR6',
      'Almacenamiento': '825GB SSD',
      'Resolución': '4K 120fps',
      'Audio': '3D Tempest Audio'
    },
    rating: 4.9,
    reviews: 1567,
    inStock: false
  },
  {
    id: '9',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'headphones',
    price: 249.99,
    originalPrice: 279.99,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    description: 'Auriculares inalámbricos con cancelación activa de ruido y audio espacial.',
    specifications: {
      'Chip': 'H2',
      'Cancelación de ruido': 'Activa',
      'Batería': 'Hasta 6 horas + 24h con estuche',
      'Resistencia': 'IPX4',
      'Audio': 'Espacial personalizado'
    },
    rating: 4.6,
    reviews: 892,
    inStock: true,
    featured: true
  },
  {
    id: '10',
    name: 'Samsung Galaxy Tab S9',
    brand: 'Samsung',
    category: 'tablets',
    price: 799.99,
    image: 'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg',
    images: [
      'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg'
    ],
    description: 'Tablet premium con S Pen incluido y pantalla Dynamic AMOLED 2X.',
    specifications: {
      'Pantalla': '11" Dynamic AMOLED 2X',
      'Procesador': 'Snapdragon 8 Gen 2',
      'Memoria': '8GB RAM',
      'Almacenamiento': '128GB',
      'S Pen': 'Incluido',
      'Resistencia': 'IP68'
    },
    rating: 4.5,
    reviews: 456,
    inStock: true,
    featured: true
  },
  {
    id: '11',
    name: 'Microsoft Surface Pro 9',
    brand: 'Microsoft',
    category: 'tablets',
    price: 1099.99,
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg'
    ],
    description: '2-en-1 versátil que combina la portabilidad de una tablet con el rendimiento de una laptop.',
    specifications: {
      'Procesador': 'Intel Core i5-1235U',
      'Memoria': '8GB RAM',
      'Almacenamiento': '256GB SSD',
      'Pantalla': '13" PixelSense',
      'Peso': '879g',
      'Sistema': 'Windows 11'
    },
    rating: 4.4,
    reviews: 234,
    inStock: true,
    featured: true
  },
  {
    id: '12',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'smartphones',
    price: 999.99,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'
    ],
    description: 'Smartphone con IA avanzada, cámara computacional y Android puro.',
    specifications: {
      'Pantalla': '6.7" LTPO OLED',
      'Procesador': 'Google Tensor G3',
      'Memoria': '12GB RAM',
      'Almacenamiento': '128GB',
      'Cámara': 'Triple cámara 50MP',
      'IA': 'Magic Eraser, Live Translate'
    },
    rating: 4.6,
    reviews: 567,
    inStock: true,
    featured: true
  },
  {
    id: '13',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'gaming',
    price: 349.99,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
    ],
    description: 'Consola híbrida con pantalla OLED de 7 pulgadas y audio mejorado.',
    specifications: {
      'Pantalla': '7" OLED multitáctil',
      'Almacenamiento': '64GB interno',
      'Batería': '4.5-9 horas',
      'Conectividad': 'WiFi, Bluetooth',
      'Modos': 'TV, sobremesa, portátil',
      'Audio': 'Altavoces mejorados'
    },
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    featured: true
  },
  {
    id: '14',
    name: 'HP Spectre x360',
    brand: 'HP',
    category: 'laptops',
    price: 1399.99,
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    images: [
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'
    ],
    description: 'Laptop convertible premium con pantalla táctil 4K y diseño elegante.',
    specifications: {
      'Procesador': 'Intel Core i7-1255U',
      'Memoria': '16GB LPDDR4x',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '13.5" 4K OLED táctil',
      'Peso': '1.36 kg',
      'Batería': 'Hasta 17 horas'
    },
    rating: 4.5,
    reviews: 345,
    inStock: true,
    featured: true
  },
  {
    id: '15',
    name: 'Xiaomi Mi 13 Pro',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 899.99,
    originalPrice: 999.99,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
    ],
    description: 'Smartphone flagship con cámara Leica y carga rápida de 120W.',
    specifications: {
      'Pantalla': '6.73" AMOLED 120Hz',
      'Procesador': 'Snapdragon 8 Gen 2',
      'Memoria': '12GB RAM',
      'Almacenamiento': '256GB',
      'Cámara': 'Triple Leica 50MP',
      'Carga': '120W inalámbrica'
    },
    rating: 4.4,
    reviews: 678,
    inStock: true,
    featured: true
  },
  {
    id: '16',
    name: 'Lenovo ThinkPad X1 Carbon',
    brand: 'Lenovo',
    category: 'laptops',
    price: 1599.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg'
    ],
    description: 'Laptop empresarial ultraliviana con certificación militar y seguridad avanzada.',
    specifications: {
      'Procesador': 'Intel Core i7-1365U',
      'Memoria': '16GB LPDDR5',
      'Almacenamiento': '1TB SSD',
      'Pantalla': '14" 2.8K OLED',
      'Peso': '1.12 kg',
      'Certificación': 'MIL-STD-810H'
    },
    rating: 4.7,
    reviews: 234,
    inStock: true,
    featured: true
  }
];