import { UserRole } from '../schemas/user.schema';

export const usersData = [
  {
    username: 'admin',
    email: 'admin@akva.com',
    password: 'Admin123!',
    role: UserRole.AdminUser,
    emailVerified: true,
  },
  {
    username: 'user',
    email: 'user@akva.com',
    password: 'User123!',
    role: UserRole.User,
    emailVerified: true,
  },
];

export const productsData = [
  {
    name: 'Акваріум Juwel Rio 125',
    subtitle: 'Преміум акваріум для початківців та професіоналів',
    price: 8500,
    oldPrice: 9500,
    description:
      'Juwel Rio 125 - це класичний прямокутний акваріум об\'ємом 125 літрів. Комплектується світлодіодним освітленням, внутрішнім фільтром та нагрівачем. Ідеальний вибір для тримання тропічних риб.',
    category: ['Акваріуми', 'Juwel', 'Прісноводні'],
    tags: 'акваріум, juwel, rio, 125 літрів',
    fulfillmentTime: 3,
    image: [
      {
        title: 'Основне фото',
        description: 'Вид спереду',
        image: 'https://placehold.co/800x600/0066cc/ffffff?text=Juwel+Rio+125',
      },
      {
        title: 'Бічний вид',
        description: 'Вид збоку',
        image: 'https://placehold.co/800x600/0066cc/ffffff?text=Side+View',
      },
    ],
    characteristics: [
      { name: "Об'єм", value: '125 літрів' },
      { name: 'Розміри', value: '81x36x50 см' },
      { name: 'Освітлення', value: 'LED HeliaLux' },
      { name: 'Фільтр', value: 'Bioflow M' },
    ],
  },
  {
    name: 'Зовнішній фільтр Tetra EX 800 Plus',
    subtitle: 'Потужна фільтрація для акваріумів до 300 літрів',
    price: 3200,
    oldPrice: 3800,
    description:
      'Tetra EX 800 Plus - зовнішній канистровий фільтр з продуктивністю 800 л/год. Має 5 типів фільтрації та систему швидкого старту. Тихий та ефективний.',
    category: ['Фільтри', 'Tetra', 'Зовнішні фільтри'],
    tags: 'фільтр, tetra, зовнішній, канистровий',
    fulfillmentTime: 2,
    image: [
      {
        title: 'Фільтр Tetra EX 800',
        description: 'Зовнішній фільтр',
        image: 'https://placehold.co/800x600/228B22/ffffff?text=Tetra+EX+800',
      },
    ],
    characteristics: [
      { name: 'Продуктивність', value: '800 л/год' },
      { name: 'Для акваріумів', value: 'до 300 літрів' },
      { name: 'Потужність', value: '10.5 Вт' },
      { name: 'Кількість кошиків', value: '5' },
    ],
  },
  {
    name: 'Корм Tetra Pro Energy',
    subtitle: 'Преміум корм для тропічних риб',
    price: 450,
    oldPrice: 520,
    description:
      'Tetra Pro Energy - високоякісний корм у вигляді чіпсів для підвищення енергії та життєвих сил акваріумних риб. Містить концентрат енергії для активних риб.',
    category: ['Корми', 'Tetra', 'Для тропічних риб'],
    tags: 'корм, tetra, чіпси, тропічні риби',
    fulfillmentTime: 1,
    image: [
      {
        title: 'Tetra Pro Energy',
        description: 'Банка корму',
        image: 'https://placehold.co/800x600/FF6347/ffffff?text=Tetra+Pro+Energy',
      },
    ],
    characteristics: [
      { name: "Об'єм", value: '250 мл' },
      { name: 'Тип', value: 'Чіпси' },
      { name: 'Призначення', value: 'Тропічні риби' },
    ],
  },
  {
    name: 'LED світильник Chihiros A Series',
    subtitle: 'Професійне освітлення для акваріумів з рослинами',
    price: 4200,
    oldPrice: 4800,
    description:
      'Chihiros A Series - потужний LED світильник для акваріумів з живими рослинами. Забезпечує оптимальний спектр для фотосинтезу. Регулювання яскравості через Bluetooth.',
    category: ['Освітлення', 'Chihiros', 'LED'],
    tags: 'світильник, led, chihiros, рослини',
    fulfillmentTime: 5,
    image: [
      {
        title: 'Chihiros A Series',
        description: 'LED світильник',
        image: 'https://placehold.co/800x600/FFD700/000000?text=Chihiros+LED',
      },
    ],
    characteristics: [
      { name: 'Потужність', value: '45 Вт' },
      { name: 'Колірна температура', value: '8000K' },
      { name: 'Довжина', value: '60 см' },
      { name: 'Керування', value: 'Bluetooth' },
    ],
  },
  {
    name: 'CO2 система JBL ProFlora',
    subtitle: 'Повна система подачі CO2 для рослинного акваріуму',
    price: 6800,
    oldPrice: 7500,
    description:
      'JBL ProFlora - професійна система подачі CO2 для акваріумів з рослинами. Включає балон, редуктор, електромагнітний клапан та дифузор. Забезпечує стабільну подачу CO2.',
    category: ['CO2 системи', 'JBL', 'Для рослин'],
    tags: 'co2, jbl, рослини, система',
    fulfillmentTime: 4,
    image: [
      {
        title: 'JBL ProFlora',
        description: 'CO2 система',
        image: 'https://placehold.co/800x600/32CD32/ffffff?text=JBL+CO2',
      },
    ],
    characteristics: [
      { name: 'Балон', value: '500 г' },
      { name: 'Редуктор', value: 'З манометром' },
      { name: 'Клапан', value: 'Електромагнітний' },
      { name: 'Для акваріумів', value: 'до 400 літрів' },
    ],
  },
  {
    name: 'Ґрунт ADA Aqua Soil Amazonia',
    subtitle: 'Поживний ґрунт для акваріумів з рослинами',
    price: 1800,
    oldPrice: 2100,
    description:
      'ADA Aqua Soil Amazonia - преміальний поживний ґрунт японського виробництва. Забезпечує оптимальні умови для росту акваріумних рослин. Знижує pH та пом\'якшує воду.',
    category: ['Ґрунти', 'ADA', 'Поживні'],
    tags: 'ґрунт, ada, amazonia, рослини',
    fulfillmentTime: 3,
    image: [
      {
        title: 'ADA Amazonia',
        description: 'Поживний ґрунт',
        image: 'https://placehold.co/800x600/8B4513/ffffff?text=ADA+Amazonia',
      },
    ],
    characteristics: [
      { name: "Об'єм", value: '9 літрів' },
      { name: 'Тип', value: 'Поживний' },
      { name: 'Колір', value: 'Чорний' },
      { name: 'Виробник', value: 'Японія' },
    ],
  },
  {
    name: 'Нагрівач Eheim Jager 150W',
    subtitle: 'Надійний терморегулятор для акваріуму',
    price: 980,
    oldPrice: 1150,
    description:
      'Eheim Jager - класичний скляний нагрівач з точним терморегулятором. Потужність 150W підходить для акваріумів 200-300 літрів. Повністю занурюваний.',
    category: ['Нагрівачі', 'Eheim', 'Скляні'],
    tags: 'нагрівач, eheim, jager, терморегулятор',
    fulfillmentTime: 2,
    image: [
      {
        title: 'Eheim Jager',
        description: 'Нагрівач',
        image: 'https://placehold.co/800x600/FF4500/ffffff?text=Eheim+Jager',
      },
    ],
    characteristics: [
      { name: 'Потужність', value: '150 Вт' },
      { name: 'Для акваріумів', value: '200-300 літрів' },
      { name: 'Довжина', value: '38 см' },
      { name: 'Діапазон', value: '18-34°C' },
    ],
  },
  {
    name: 'Компресор Tetra APS 300',
    subtitle: 'Тихий та потужний компресор для аерації',
    price: 850,
    oldPrice: 980,
    description:
      'Tetra APS 300 - надзвичайно тихий компресор для аерації акваріумів до 300 літрів. Оснащений гумовими ніжками для зменшення вібрації та шуму.',
    category: ['Компресори', 'Tetra', 'Аерація'],
    tags: 'компресор, tetra, аерація, повітря',
    fulfillmentTime: 2,
    image: [
      {
        title: 'Tetra APS 300',
        description: 'Компресор',
        image: 'https://placehold.co/800x600/4169E1/ffffff?text=Tetra+APS+300',
      },
    ],
    characteristics: [
      { name: 'Продуктивність', value: '300 л/год' },
      { name: 'Для акваріумів', value: 'до 300 літрів' },
      { name: 'Потужність', value: '4.5 Вт' },
      { name: 'Рівень шуму', value: '<25 дБ' },
    ],
  },
];

export const pageData = {
  name: 'Main page',
  about: {
    title: 'Про нас',
    subtitle: 'Найкращий магазин акваріумістики в Україні',
    description:
      'AKVA - це ваш надійний партнер у світі акваріумістики. Ми пропонуємо широкий асортимент акваріумів, обладнання, рослин та риб. Наші експерти завжди готові допомогти вам створити акваріум вашої мрії. Працюємо з 2015 року та маємо тисячі задоволених клієнтів по всій Україні.',
  },
  category: [
    { active: true, value: 'Акваріуми' },
    { active: true, value: 'Фільтри' },
    { active: true, value: 'Освітлення' },
    { active: true, value: 'Корми' },
    { active: true, value: 'CO2 системи' },
    { active: true, value: 'Ґрунти' },
    { active: true, value: 'Декор' },
    { active: false, value: 'Морські акваріуми' },
  ],
  slider: [
    {
      title: 'Новинки сезону',
      description: 'Найкращі акваріуми та обладнання 2024 року',
      image: 'https://placehold.co/1920x600/0066cc/ffffff?text=AKVA+-+Новинки+сезону',
    },
    {
      title: 'Знижки до 30%',
      description: 'На все обладнання Tetra та JBL',
      image: 'https://placehold.co/1920x600/228B22/ffffff?text=Знижки+до+30%25',
    },
    {
      title: 'Безкоштовна доставка',
      description: 'При замовленні від 2000 грн',
      image: 'https://placehold.co/1920x600/FF6347/ffffff?text=Безкоштовна+доставка',
    },
  ],
  bestseller: [
    {
      title: 'Juwel Rio 125',
      description: 'Хіт продажів',
      image: 'https://placehold.co/400x300/0066cc/ffffff?text=Juwel+Rio',
    },
    {
      title: 'Tetra EX 800',
      description: 'Найкращий фільтр',
      image: 'https://placehold.co/400x300/228B22/ffffff?text=Tetra+EX',
    },
    {
      title: 'Chihiros LED',
      description: 'Топ освітлення',
      image: 'https://placehold.co/400x300/FFD700/000000?text=Chihiros',
    },
  ],
  workFeatures: [
    {
      title: 'Швидка доставка',
      description: 'Доставляємо по всій Україні за 1-3 дні',
      image: 'https://placehold.co/200x200/4169E1/ffffff?text=Доставка',
    },
    {
      title: 'Гарантія якості',
      description: 'Офіційна гарантія на все обладнання',
      image: 'https://placehold.co/200x200/32CD32/ffffff?text=Гарантія',
    },
    {
      title: 'Консультації',
      description: 'Безкоштовні консультації від експертів',
      image: 'https://placehold.co/200x200/FF6347/ffffff?text=Консультації',
    },
    {
      title: 'Вигідні ціни',
      description: 'Найкращі ціни та регулярні акції',
      image: 'https://placehold.co/200x200/FFD700/000000?text=Ціни',
    },
  ],
  info: {
    title: 'Контакти',
    subtitle: "Зв'яжіться з нами",
    telephone: 380501234567,
    email: 'info@akva.com.ua',
    instagram: 'https://instagram.com/akva_ua',
    facebook: 'https://facebook.com/akva.ua',
  },
  whatNew: [
    {
      title: 'Нові акваріуми Juwel 2024',
      description: 'Оновлена лінійка з покращеним освітленням',
      image: 'https://placehold.co/400x300/0066cc/ffffff?text=Juwel+2024',
    },
    {
      title: 'CO2 системи JBL',
      description: 'Повний асортимент систем подачі CO2',
      image: 'https://placehold.co/400x300/32CD32/ffffff?text=JBL+CO2',
    },
  ],
  fulfillmentProcedure: [
    {
      title: 'Крок 1: Замовлення',
      description: 'Оберіть товари та оформіть замовлення онлайн',
      image: 'https://placehold.co/300x200/4169E1/ffffff?text=1',
    },
    {
      title: 'Крок 2: Підтвердження',
      description: 'Менеджер зателефонує для підтвердження',
      image: 'https://placehold.co/300x200/32CD32/ffffff?text=2',
    },
    {
      title: 'Крок 3: Доставка',
      description: 'Отримайте замовлення зручним способом',
      image: 'https://placehold.co/300x200/FF6347/ffffff?text=3',
    },
    {
      title: 'Крок 4: Підтримка',
      description: 'Консультації після покупки безкоштовно',
      image: 'https://placehold.co/300x200/FFD700/000000?text=4',
    },
  ],
};

export const reviewsData = [
  {
    name: 'Олександр',
    title: 'Чудовий акваріум!',
    description:
      'Замовив Juwel Rio 125, дуже задоволений якістю. Фільтр працює тихо, освітлення потужне. Рекомендую!',
    rating: 5,
    productIndex: 0, // Juwel Rio 125
  },
  {
    name: 'Марія',
    title: 'Відмінний фільтр',
    description:
      'Tetra EX 800 Plus - найкращий зовнішній фільтр, який я використовувала. Вода кришталево чиста.',
    rating: 5,
    productIndex: 1, // Tetra EX 800
  },
  {
    name: 'Ігор',
    title: 'Риби в захваті',
    description: 'Корм Tetra Pro Energy риби їдять із задоволенням. Стали активнішими та яскравішими.',
    rating: 4,
    productIndex: 2, // Корм Tetra Pro Energy
  },
  {
    name: 'Анна',
    title: 'Рослини ростуть як ніколи',
    description:
      'Світильник Chihiros A Series перетворив мій акваріум. Рослини почали активно рости та перлитися.',
    rating: 5,
    productIndex: 3, // Chihiros LED
  },
  {
    name: 'Петро',
    title: 'Якісний ґрунт',
    description: 'ADA Amazonia - це стандарт для рослинних акваріумів. Трохи мутить воду спочатку, але потім все чудово.',
    rating: 4,
    productIndex: 5, // ADA Amazonia
  },
];
