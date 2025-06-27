import { Product, Category, Pack, User, Order } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Fruits & Légumes', description: 'Produits frais biologiques' },
  { id: '2', name: 'Céréales & Graines', description: 'Céréales complètes et graines' },
  { id: '3', name: 'Produits Laitiers', description: 'Lait et fromages bio' },
  { id: '4', name: 'Épices & Herbes', description: 'Épices et herbes aromatiques' },
  { id: '5', name: 'Huiles & Vinaigres', description: 'Huiles pressées à froid' },
  { id: '6', name: 'Thés & Infusions', description: 'Thés et tisanes biologiques' },
  { id: '7', name: 'Noix & Fruits Secs', description: 'Noix, amandes et fruits séchés' }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Pommes Bio du Verger',
    price: 4.50,
    costPrice: 2.25,
    description: 'Pommes biologiques fraîches, cultivées sans pesticides dans nos vergers locaux. Variété Golden Delicious, parfaites pour croquer ou cuisiner.',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '1',
    origin: 'Maroc, Meknès',
    stock: 50,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Quinoa Bio Tricolore',
    price: 8.90,
    costPrice: 4.45,
    description: 'Mélange de quinoa rouge, blanc et noir. Riche en protéines et sans gluten. Idéal pour vos salades et plats chauds.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '2',
    origin: 'Maroc, Errachidia',
    stock: 30,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-10T08:30:00Z'
  },
  {
    id: '3',
    name: 'Fromage de Chèvre Bio',
    price: 12.50,
    costPrice: 7.50,
    description: 'Fromage de chèvre crémeux, fabriqué de manière artisanale avec du lait de chèvres élevées au pâturage.',
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '3',
    origin: 'Maroc, Ifrane',
    stock: 15,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '4',
    name: 'Curcuma en Poudre Bio',
    price: 6.20,
    costPrice: 3.10,
    description: 'Curcuma biologique en poudre, aux propriétés anti-inflammatoires reconnues. Parfait pour vos currys et boissons détox.',
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    origin: 'Maroc, Taroudant',
    stock: 25,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: '5',
    name: 'Huile d\'Olive Extra Vierge',
    price: 15.80,
    costPrice: 9.50,
    description: 'Huile d\'olive extra vierge pressée à froid, au goût fruité et délicat. Parfaite pour l\'assaisonnement et la cuisson douce.',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=500',
    category: '5',
    origin: 'Maroc, Ouazzane',
    stock: 20,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-05T11:15:00Z'
  },
  {
    id: '6',
    name: 'Thé Vert Sencha Bio',
    price: 9.40,
    costPrice: 4.70,
    description: 'Thé vert japonais Sencha biologique, aux notes fraîches et végétales. Riche en antioxydants.',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc, Azrou',
    stock: 35,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-03T09:00:00Z'
  },
  {
    id: '7',
    name: 'Carottes Bio du Potager',
    price: 3.20,
    costPrice: 1.60,
    description: 'Carottes biologiques croquantes et sucrées, cultivées dans le respect de l\'environnement.',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '1',
    origin: 'Maroc, Larache',
    stock: 45,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-14T13:30:00Z'
  },
  {
    id: '8',
    name: 'Avoine Bio Complète',
    price: 5.60,
    costPrice: 2.80,
    description: 'Flocons d\'avoine complets biologiques, parfaits pour vos petits-déjeuners et porridges nutritifs.',
    image: 'https://images.pexels.com/photos/216951/pexels-photo-216951.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '2',
    origin: 'Maroc, Khénifra',
    stock: 40,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-11T07:45:00Z'
  },
  {
    id: '9',
    name: 'Menthe Séchée Bio',
    price: 4.20,
    costPrice: 2.10,
    description: 'Feuilles de menthe séchées naturelles, idéales pour thé, infusion ou cuisine. Fraîcheur intense et goût authentique.',
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc',
    stock: 35,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-16T09:00:00Z'
  },
  {
    id: '10',
    name: 'Verveine Séchée Bio',
    price: 5.80,
    costPrice: 2.90,
    description: 'Verveine séchée apaisante et parfumée. Parfaite pour les infusions relaxantes ou desserts légers.',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc, Chefchaouen',
    stock: 25,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-17T10:30:00Z'
  },
  {
    id: '11',
    name: 'Thym Séché Bio',
    price: 3.90,
    costPrice: 1.95,
    description: 'Thym séché au goût méditerranéen puissant et parfumé. Idéal pour plats mijotés ou tisanes.',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    origin: 'Maroc, Taza',
    stock: 30,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-18T11:15:00Z'
  },
  {
    id: '12',
    name: 'Romarin Séché Bio',
    price: 4.50,
    costPrice: 2.25,
    description: 'Romarin séché à l\'arôme boisé intense. Pour parfumer grillades, légumes rôtis ou infusions.',
    image: 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    origin: 'Maroc, Al Hoceima',
    stock: 28,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-19T14:20:00Z'
  },
  {
    id: '13',
    name: 'Lavande Séchée Bio',
    price: 6.70,
    costPrice: 3.35,
    description: 'Lavande séchée aux notes florales délicates. À utiliser en infusion, dessert ou sachets parfumés.',
    image: 'https://images.pexels.com/photos/1458318/pexels-photo-1458318.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc, Ouarzazate',
    stock: 20,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-20T08:45:00Z'
  },
  {
    id: '14',
    name: 'Sauge Séchée Bio',
    price: 5.20,
    costPrice: 2.60,
    description: 'Sauge séchée à la saveur intense. Traditionnelle en tisane ou cuisine rustique.',
    image: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    origin: 'Maroc, Beni Mellal',
    stock: 22,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-21T12:30:00Z'
  },
  {
    id: '15',
    name: 'Mélisse Séchée Bio',
    price: 7.30,
    costPrice: 3.65,
    description: 'Mélisse séchée à la douceur citronnée. Calmante et rafraîchissante en infusion.',
    image: 'https://images.pexels.com/photos/4041394/pexels-photo-4041394.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc, Sefrou',
    stock: 18,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-22T15:10:00Z'
  },
  {
    id: '16',
    name: 'Absinthe (Chiba) Séchée Bio',
    price: 8.50,
    costPrice: 4.25,
    description: 'Absinthe séchée traditionnelle et amère. Typique des infusions marocaines, goût puissant et authentique.',
    image: 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    origin: 'Maroc, Atlas',
    stock: 15,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-23T16:00:00Z'
  },
  {
    id: '17',
    name: 'Amandes Grillées Bio',
    price: 12.50,
    costPrice: 6.25,
    description: 'Amandes grillées au croquant naturel. Riches en protéines et fibres, parfaites en snack ou en cuisine.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Agadir',
    stock: 40,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-24T09:00:00Z'
  },
  {
    id: '18',
    name: 'Noix Bio',
    price: 15.80,
    costPrice: 7.90,
    description: 'Noix à la saveur authentique. Sources d\'oméga-3, idéales pour salades, desserts ou à croquer.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Azilal',
    stock: 35,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-25T10:30:00Z'
  },
  {
    id: '19',
    name: 'Noisettes Bio',
    price: 13.20,
    costPrice: 6.60,
    description: 'Noisettes à la douceur toastée. Délicates et énergétiques, parfaites pour vos pauses santé.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Tafraout',
    stock: 30,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-26T11:15:00Z'
  },
  {
    id: '20',
    name: 'Cacahuètes Grillées Bio',
    price: 8.90,
    costPrice: 4.45,
    description: 'Cacahuètes grillées pour une énergie instantanée. Naturelles ou légèrement salées, riches en magnésium.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Berkane',
    stock: 45,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-27T12:00:00Z'
  },
  {
    id: '21',
    name: 'Noix de Cajou Bio',
    price: 18.50,
    costPrice: 9.25,
    description: 'Noix de cajou au goût doux et crémeux. Tendres et nutritives, idéales en collation ou en cuisine.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Essaouira',
    stock: 25,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-28T13:30:00Z'
  },
  {
    id: '22',
    name: 'Noix de Coco Séchée Bio',
    price: 7.60,
    costPrice: 3.80,
    description: 'Noix de coco séchée à la saveur exotique. Râpée ou en copeaux, parfaite pour desserts et mueslis.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Nador',
    stock: 20,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-29T14:15:00Z'
  },
  {
    id: '23',
    name: 'Raisins Secs Bio',
    price: 6.40,
    costPrice: 3.20,
    description: 'Raisins secs au sucre naturel. Riches en fer et fibres, parfaits pour snacks ou pâtisseries.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Figuig',
    stock: 35,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-01-30T15:00:00Z'
  },
  {
    id: '24',
    name: 'Dattes Séchées Bio',
    price: 9.80,
    costPrice: 4.90,
    description: 'Dattes séchées, énergie pure. Sucrées naturellement, riches en potassium et fibres.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Tafilalet',
    stock: 30,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-01-31T16:00:00Z'
  },
  {
    id: '25',
    name: 'Pruneaux Bio',
    price: 8.20,
    costPrice: 4.10,
    description: 'Pruneaux à la douceur digestive. Moelleux, riches en fibres, bons pour la digestion.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Midelt',
    stock: 25,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-02-01T09:30:00Z'
  },
  {
    id: '26',
    name: 'Figues Séchées Bio',
    price: 11.50,
    costPrice: 5.75,
    description: 'Figues séchées à la saveur méditerranéenne. Tendres et sucrées, excellentes au petit-déjeuner ou en salade.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Taounate',
    stock: 20,
    certifiedOrganic: true,
    featured: false,
    createdAt: '2024-02-02T10:45:00Z'
  },
  {
    id: '27',
    name: 'Pistaches Grillées Bio',
    price: 22.90,
    costPrice: 11.45,
    description: 'Pistaches grillées à la saveur fine. Croquantes et salées, parfaites en apéritif sain.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    origin: 'Maroc, Boulemane',
    stock: 15,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-02-03T11:30:00Z'
  },
  {
    id: '28',
    name: 'Panier Cadeau Fruits Bio',
    price: 45.00,
    costPrice: 22.50,
    description: 'Panier cadeau fruits bio - Fraîcheur à offrir. Fruits frais de saison, 100% bio. Un cadeau sain, naturel et plein de saveurs.',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '1',
    origin: 'Maroc, Producteurs locaux',
    stock: 10,
    certifiedOrganic: true,
    featured: true,
    createdAt: '2024-02-04T12:00:00Z'
  }
];

export const samplePacks: Pack[] = [
  {
    id: 'pack-1',
    name: 'Pack Découverte Bio',
    description: 'Un assortiment parfait pour découvrir nos meilleurs produits biologiques. Idéal pour débuter votre transition vers le bio.',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 1 },
      { productId: '4', quantity: 1 }
    ],
    originalPrice: 19.60, // Will be calculated based on products
    packPrice: 15.99,
    discount: 18,
    stock: 25,
    featured: true,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'pack-2',
    name: 'Pack Petit Déjeuner Healthy',
    description: 'Tout ce qu\'il faut pour commencer la journée avec énergie et vitalité. Produits biologiques sélectionnés pour leur qualité nutritionnelle.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '2', quantity: 1 },
      { productId: '8', quantity: 1 },
      { productId: '6', quantity: 1 }
    ],
    originalPrice: 23.90,
    packPrice: 19.99,
    discount: 16,
    stock: 15,
    featured: false,
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: 'pack-3',
    name: 'Pack Cuisine du Monde',
    description: 'Explorez les saveurs du monde avec cette sélection d\'épices et d\'huiles premium. Pour les amateurs de cuisine authentique.',
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '4', quantity: 2 },
      { productId: '5', quantity: 1 }
    ],
    originalPrice: 22.00,
    packPrice: 17.99,
    discount: 18,
    stock: 20,
    featured: true,
    createdAt: '2024-01-03T10:00:00Z'
  },
  {
    id: 'pack-4',
    name: 'Pack Herbes & Infusions',
    description: 'Collection d\'herbes séchées biologiques pour vos infusions et tisanes. Détente et bien-être garantis.',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '9', quantity: 1 }, // Menthe
      { productId: '10', quantity: 1 }, // Verveine
      { productId: '13', quantity: 1 }, // Lavande
      { productId: '15', quantity: 1 }  // Mélisse
    ],
    originalPrice: 24.00,
    packPrice: 19.99,
    discount: 17,
    stock: 12,
    featured: true,
    createdAt: '2024-01-24T10:00:00Z'
  },
  {
    id: 'pack-5',
    name: 'Pack Herbes de Cuisine',
    description: 'Sélection d\'herbes aromatiques séchées pour sublimer vos plats. Saveurs méditerranéennes authentiques.',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '11', quantity: 1 }, // Thym
      { productId: '12', quantity: 1 }, // Romarin
      { productId: '14', quantity: 1 }  // Sauge
    ],
    originalPrice: 13.60,
    packPrice: 11.99,
    discount: 12,
    stock: 18,
    featured: false,
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'pack-6',
    name: 'Pack Noix & Amandes',
    description: 'Sélection de noix et amandes premium. Riches en protéines et oméga-3, parfaites pour une alimentation équilibrée.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '17', quantity: 1 }, // Amandes
      { productId: '18', quantity: 1 }, // Noix
      { productId: '19', quantity: 1 }, // Noisettes
      { productId: '21', quantity: 1 }  // Cajou
    ],
    originalPrice: 59.00,
    packPrice: 49.99,
    discount: 15,
    stock: 15,
    featured: true,
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'pack-7',
    name: 'Pack Fruits Secs Énergétiques',
    description: 'Collection de fruits séchés naturels pour faire le plein d\'énergie. Idéal pour sportifs et gourmands.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '23', quantity: 1 }, // Raisins secs
      { productId: '24', quantity: 1 }, // Dattes
      { productId: '25', quantity: 1 }, // Pruneaux
      { productId: '26', quantity: 1 }  // Figues
    ],
    originalPrice: 35.90,
    packPrice: 29.99,
    discount: 16,
    stock: 20,
    featured: true,
    createdAt: '2024-02-06T10:00:00Z'
  },
  {
    id: 'pack-8',
    name: 'Pack Apéritif Sain',
    description: 'Assortiment de noix grillées pour vos apéritifs healthy. Saveurs authentiques et bienfaits nutritionnels.',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600',
    items: [
      { productId: '20', quantity: 1 }, // Cacahuètes
      { productId: '27', quantity: 1 }, // Pistaches
      { productId: '17', quantity: 1 }  // Amandes
    ],
    originalPrice: 44.30,
    packPrice: 37.99,
    discount: 14,
    stock: 12,
    featured: false,
    createdAt: '2024-02-07T10:00:00Z'
  }
];

export const sampleUsers: User[] = [
  {
    id: '1',
    email: 'fatima.benali@gmail.com',
    firstName: 'Fatima',
    lastName: 'Benali',
    walletBalance: 125.00,
    totalSpent: 59.70, // order-001: 34.80 + order-007: 24.90
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    email: 'ahmed.tazi@gmail.com',
    firstName: 'Ahmed',
    lastName: 'Tazi',
    walletBalance: 85.00,
    totalSpent: 33.70, // order-002: 18.70 + delivery: 15.00
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    email: 'khadija.alami@gmail.com',
    firstName: 'Khadija',
    lastName: 'Alami',
    walletBalance: 200.00,
    totalSpent: 107.29, // order-003: 57.30 + order-008: 49.99
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    email: 'youssef.idrissi@gmail.com',
    firstName: 'Youssef',
    lastName: 'Idrissi',
    walletBalance: 95.00,
    totalSpent: 35.70, // order-004: 35.70
    createdAt: '2024-01-25T16:45:00Z'
  },
  {
    id: '5',
    email: 'aicha.benjelloun@gmail.com',
    firstName: 'Aicha',
    lastName: 'Benjelloun',
    walletBalance: 110.00,
    totalSpent: 21.60, // order-005: 21.60
    createdAt: '2024-02-01T11:20:00Z'
  },
  {
    id: '6',
    email: 'omar.cherkaoui@gmail.com',
    firstName: 'Omar',
    lastName: 'Cherkaoui',
    walletBalance: 150.00,
    totalSpent: 58.50, // order-006: 43.50 + delivery: 15.00
    createdAt: '2024-02-05T13:10:00Z'
  }
];

export const sampleOrders: Order[] = [
  {
    id: 'order-001',
    userId: '1', // Fatima Benali
    items: [
      { productId: '17', productName: 'Amandes Grillées Bio', quantity: 2, price: 12.50 },
      { productId: '24', productName: 'Dattes Séchées Bio', quantity: 1, price: 9.80 }
    ],
    total: 34.80,
    status: 'delivered',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-02-15',
    createdAt: '2024-02-10T10:30:00Z',
    confirmedAt: '2024-02-10T11:00:00Z',
    shippingAddress: {
      street: 'Rue Hassan II, 45',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-002',
    userId: '2', // Ahmed Tazi
    items: [
      { productId: '11', productName: 'Thym Séché Bio', quantity: 2, price: 3.90 },
      { productId: '13', productName: 'Lavande Séchée Bio', quantity: 1, price: 6.70 },
      { productId: '9', productName: 'Menthe Séchée Bio', quantity: 1, price: 4.20 }
    ],
    total: 18.70,
    status: 'delivered',
    deliveryType: 'express',
    deliveryPrice: 15.00,
    estimatedDelivery: '2024-02-12',
    createdAt: '2024-02-08T14:20:00Z',
    confirmedAt: '2024-02-08T14:45:00Z',
    shippingAddress: {
      street: 'Avenue Mohammed V, 123',
      city: 'Rabat',
      postalCode: '10000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-003',
    userId: '3', // Khadija Alami
    items: [
      { productId: '18', productName: 'Noix Bio', quantity: 1, price: 15.80 },
      { productId: '21', productName: 'Noix de Cajou Bio', quantity: 1, price: 18.50 },
      { productId: '26', productName: 'Figues Séchées Bio', quantity: 2, price: 11.50 }
    ],
    total: 57.30,
    status: 'shipped',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-02-20',
    createdAt: '2024-02-16T09:15:00Z',
    confirmedAt: '2024-02-16T10:00:00Z',
    shippingAddress: {
      street: 'Rue de la Kasbah, 78',
      city: 'Marrakech',
      postalCode: '40000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-004',
    userId: '4', // Youssef Idrissi
    items: [
      { productId: '27', productName: 'Pistaches Grillées Bio', quantity: 1, price: 22.90 },
      { productId: '23', productName: 'Raisins Secs Bio', quantity: 2, price: 6.40 }
    ],
    total: 35.70,
    status: 'confirmed',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-02-25',
    createdAt: '2024-02-18T16:45:00Z',
    confirmedAt: '2024-02-18T17:00:00Z',
    shippingAddress: {
      street: 'Rue Talaa Kebira, 56',
      city: 'Fès',
      postalCode: '30000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-005',
    userId: '5', // Aicha Benjelloun
    items: [
      { productId: '10', productName: 'Verveine Séchée Bio', quantity: 1, price: 5.80 },
      { productId: '15', productName: 'Mélisse Séchée Bio', quantity: 1, price: 7.30 },
      { productId: '16', productName: 'Absinthe (Chiba) Séchée Bio', quantity: 1, price: 8.50 }
    ],
    total: 21.60,
    status: 'delivered',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-02-14',
    createdAt: '2024-02-09T11:20:00Z',
    confirmedAt: '2024-02-09T12:00:00Z',
    shippingAddress: {
      street: 'Boulevard du 20 Août, 89',
      city: 'Agadir',
      postalCode: '80000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-006',
    userId: '6', // Omar Cherkaoui
    items: [
      { productId: '19', productName: 'Noisettes Bio', quantity: 2, price: 13.20 },
      { productId: '20', productName: 'Cacahuètes Grillées Bio', quantity: 1, price: 8.90 },
      { productId: '25', productName: 'Pruneaux Bio', quantity: 1, price: 8.20 }
    ],
    total: 43.50,
    status: 'pending',
    deliveryType: 'express',
    deliveryPrice: 15.00,
    estimatedDelivery: '2024-02-22',
    createdAt: '2024-02-19T13:10:00Z',
    shippingAddress: {
      street: 'Rue Ibn Battuta, 34',
      city: 'Tanger',
      postalCode: '90000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-007',
    userId: '1', // Fatima Benali - Second order
    items: [
      { productId: '12', productName: 'Romarin Séché Bio', quantity: 1, price: 4.50 },
      { productId: '14', productName: 'Sauge Séchée Bio', quantity: 1, price: 5.20 },
      { productId: '22', productName: 'Noix de Coco Séchée Bio', quantity: 2, price: 7.60 }
    ],
    total: 24.90,
    status: 'delivered',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-01-28',
    createdAt: '2024-01-25T15:30:00Z',
    confirmedAt: '2024-01-25T16:00:00Z',
    shippingAddress: {
      street: 'Rue Hassan II, 45',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc'
    }
  },
  {
    id: 'order-008',
    userId: '3', // Khadija Alami - Pack order
    items: [
      { productId: 'pack-6', productName: 'Pack Noix & Amandes', quantity: 1, price: 49.99 }
    ],
    total: 49.99,
    status: 'delivered',
    deliveryType: 'standard',
    deliveryPrice: 0,
    estimatedDelivery: '2024-01-20',
    createdAt: '2024-01-15T12:00:00Z',
    confirmedAt: '2024-01-15T12:30:00Z',
    shippingAddress: {
      street: 'Rue de la Kasbah, 78',
      city: 'Marrakech',
      postalCode: '40000',
      country: 'Maroc'
    }
  }
];

// Initialize data in localStorage if not exists
export const initializeData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(sampleOrders));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  if (!localStorage.getItem('packs')) {
    localStorage.setItem('packs', JSON.stringify(samplePacks));
  }
};

// Force update data in localStorage (useful for development)
export const updateData = () => {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('packs', JSON.stringify(samplePacks));
  localStorage.setItem('users', JSON.stringify(sampleUsers));
  localStorage.setItem('orders', JSON.stringify(sampleOrders));
  console.log('✅ Data updated with new products, packs, users, and orders!');
};