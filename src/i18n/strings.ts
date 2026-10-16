// Central place for all user-facing text, in English and Swahili.
// This keeps translations maintainable: add a Swahili value next to each
// English one. Language is currently fixed to "en" via DEFAULT_LOCALE;
// swapping it (or wiring a language switcher to `useLocale`) activates
// the Swahili strings already prepared here.

export type Locale = "en" | "sw";

export const DEFAULT_LOCALE: Locale = "en";

export const strings = {
  brand: {
    name: { en: "Pata Online", sw: "Pata Online" },
    promise: { en: "Everything you need, delivered.", sw: "Kila kitu unachohitaji, kwa mlangoni." },
    tagline: {
      en: "Everything you need, in one place.",
      sw: "Kila kitu unachohitaji, mahali pamoja.",
    },
  },
  nav: {
    home: { en: "Home", sw: "Nyumbani" },
    shop: { en: "Shop All", sw: "Bidhaa Zote" },
    explore: { en: "Explore", sw: "Tazama" },
    cart: { en: "Cart", sw: "Kikapu" },
    howItWorks: { en: "How It Works", sw: "Jinsi Inavyofanya Kazi" },
    about: { en: "About", sw: "Kuhusu" },
    contact: { en: "Contact", sw: "Wasiliana" },
    track: { en: "Track Order", sw: "Fuatilia Oda" },
    admin: { en: "Admin", sw: "Msimamizi" },
  },
  home: {
    heroHeadline: { en: "Quality products. Delivered to your door.", sw: "Bidhaa bora. Hadi mlangoni kwako." },
    heroSub: {
      en: "Shop everyday essentials, fashion, beauty and electronics from trusted local suppliers — delivered straight to you by boda boda.",
      sw: "Nunua mahitaji ya kila siku, mitindo, urembo na vifaa vya elektroniki kutoka kwa wauzaji wanaoaminika — vinafikishwa kwako kwa boda boda.",
    },
    shopCta: { en: "Shop Products", sw: "Nunua Bidhaa" },
    categoriesTitle: { en: "Shop by Category", sw: "Nunua kwa Aina" },
    featuredTitle: { en: "Featured Products", sw: "Bidhaa Maalum" },
    newArrivalsTitle: { en: "New Arrivals", sw: "Bidhaa Mpya" },
    deliveryTitle: { en: "How Delivery Works", sw: "Jinsi Delivery Inavyofanya Kazi" },
    trustTitle: { en: "Why Customers Trust Us", sw: "Kwa Nini Wateja Wanatuamini" },
    whatsappCtaTitle: { en: "Prefer to order on WhatsApp?", sw: "Unapenda kuagiza kwa WhatsApp?" },
    whatsappCtaSub: {
      en: "Chat with us directly and we'll help you find what you need.",
      sw: "Ongea nasi moja kwa moja na tutakusaidia kupata unachohitaji.",
    },
  },
  product: {
    addToCart: { en: "Add to Cart", sw: "Weka Kikapuni" },
    orderWhatsapp: { en: "Order via WhatsApp", sw: "Agiza kwa WhatsApp" },
    viewDetails: { en: "View Details", sw: "Ona Maelezo" },
    relatedProducts: { en: "You may also like", sw: "Unaweza pia kupenda" },
    description: { en: "Description", sw: "Maelezo" },
    specifications: { en: "Specifications", sw: "Vipimo" },
    deliveryInfo: { en: "Delivery Information", sw: "Taarifa za Usafirishaji" },
    returnPolicy: { en: "Returns & Warranty", sw: "Marejesho na Udhamini" },
    supplier: { en: "Sold by", sw: "Inauzwa na" },
  },
  stock: {
    in_stock: { en: "In Stock", sw: "Ipo Stock" },
    limited: { en: "Limited Stock", sw: "Stock Kidogo" },
    out_of_stock: { en: "Out of Stock", sw: "Haipo Stock" },
    unconfirmed: { en: "Demo — availability not confirmed", sw: "Mfano — upatikanaji haujathibitishwa" },
  },
  cart: {
    title: { en: "Your Cart", sw: "Kikapu Chako" },
    empty: { en: "Your cart is empty.", sw: "Kikapu chako hakina kitu." },
    subtotal: { en: "Subtotal", sw: "Jumla ndogo" },
    deliveryFee: { en: "Delivery Fee", sw: "Gharama ya Usafirishaji" },
    deliveryFeeNote: {
      en: "Confirmed with your rider based on your location",
      sw: "Itathibitishwa na dereva wa boda kulingana na eneo lako",
    },
    total: { en: "Total", sw: "Jumla Kuu" },
    checkout: { en: "Proceed to Checkout", sw: "Endelea na Malipo" },
    continueShopping: { en: "Continue Shopping", sw: "Endelea Kununua" },
    remove: { en: "Remove", sw: "Ondoa" },
  },
  checkout: {
    title: { en: "Checkout", sw: "Malipo" },
    name: { en: "Full Name", sw: "Jina Kamili" },
    phone: { en: "Phone Number", sw: "Namba ya Simu" },
    university: { en: "City / Area", sw: "Jiji / Eneo" },
    location: { en: "Delivery Address", sw: "Anwani ya Kufikisha" },
    instructions: { en: "Delivery Instructions (optional)", sw: "Maelekezo ya Ufikishaji (hiari)" },
    paymentMethod: { en: "Preferred Payment Method", sw: "Njia ya Malipo Unayopenda" },
    placeOrder: { en: "Place Order", sw: "Weka Oda" },
    guestNote: {
      en: "No account needed — just the details above.",
      sw: "Hauhitaji akaunti — maelezo haya hapo juu yanatosha.",
    },
  },
  order: {
    reference: { en: "Order Reference", sw: "Namba ya Oda" },
    confirmationTitle: { en: "Order Received!", sw: "Oda Imepokelewa!" },
    confirmationSub: {
      en: "Our team will confirm availability and delivery cost shortly. Save your order reference to track status.",
      sw: "Timu yetu itathibitisha upatikanaji na gharama ya usafirishaji hivi karibuni. Hifadhi namba ya oda yako kufuatilia hali.",
    },
    trackTitle: { en: "Track Your Order", sw: "Fuatilia Oda Yako" },
    notPaidYetNotice: {
      en: "This order is not yet marked as paid. Payment is confirmed only through our verified payment process.",
      sw: "Oda hii bado haijawekwa kama imelipwa. Malipo yanathibitishwa tu kupitia mfumo wetu rasmi wa malipo.",
    },
    status: {
      awaiting_confirmation: { en: "Awaiting Confirmation", sw: "Inasubiri Uthibitisho" },
      awaiting_payment: { en: "Awaiting Payment", sw: "Inasubiri Malipo" },
      payment_confirmed: { en: "Payment Confirmed", sw: "Malipo Yamethibitishwa" },
      preparing_order: { en: "Preparing Order", sw: "Oda Inaandaliwa" },
      out_for_delivery: { en: "Out for Delivery", sw: "Ipo Njiani" },
      completed: { en: "Completed", sw: "Imekamilika" },
      cancelled: { en: "Cancelled", sw: "Imeghairiwa" },
      refunded: { en: "Refunded", sw: "Imerejeshwa" },
    },
  },
  footer: {
    rights: { en: "All rights reserved.", sw: "Haki zote zimehifadhiwa." },
  },
} as const;

export function t(entry: { en: string; sw: string }, locale: Locale = DEFAULT_LOCALE) {
  return entry[locale];
}
