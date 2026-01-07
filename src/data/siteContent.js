
export const initialSiteContent = {
  global: {
    siteName: "EDGE2 MTR",
    contactPhone: "+919999999999",
    contactEmail: "edge2mtr@gmail.com",
    address: "EDGE2 MTR, Karnataka",
    googleMapsUrl: "https://www.google.com/maps/dir/",
    footerAbout: "Your trusted source for pure, certified organic products. From A2 Desi Cow Ghee to cold-pressed oils, we bring nature's best to your home."
  },
  home: {
    heroTitle: "EDGE2 MTR",
    heroSubtitle: "Wholesome Organic Goodness, Straight From Nature!",
    whyChooseTitle: "Why Choose EDGE2 MTR?",
    whyChooseSubtitle: "We don't just sell our products; we provide wholesome organic goodness and ensure that you get the best quality products at the best price."
  },
  about: {
    title: "About EDGE2 MTR",
    subtitle: "Bringing you the purest organic essentials, directly from nature to your table.",
    features: [
      "100% Organic Certified",
      "Sustainable Farming",
      "No Preservatives",
      "Premium Quality"
    ],
    welcomeParagraph1: "Welcome to EDGE2 MTR, your destination for authentic organic products. We believe that good health begins with good food. That's why we work directly with trusted farmers to bring you products that are free from synthetic chemicals, pesticides, and artificial additives.",
    welcomeParagraph2: "Our journey started with a simple mission: to make pure, traditional, and healthy food accessible to everyone. From our signature A2 Desi Cow Ghee made from traditional bilona method to our cold-pressed oils and raw honey, every product tells a story of tradition, purity, and care. We verify every batch to ensure it meets our high standards of quality and taste.",
    valuesTitle: "Our Values",
    values: [
      { name: "Purity", description: "Absolutely no compromise on quality or ingredients." },
      { name: "Sustainability", description: "Eco-friendly practices that accept and honor nature." },
      { name: "Health", description: "Products that nourish your body and soul." },
      { name: "Integrity", description: "Honest pricing and transparent sourcing." }
    ],
    closingParagraph: "We are committed to fostering a healthier community through the power of real food.",
    finalLine: "Experience the true taste of nature with EDGE2 MTR."
  },
  contact: {
    title: "Get in Touch",
    subtitle: "Have questions about our products? We'd love to hear from you.",
    hours: "9:00 AM - 7:00 PM (Daily)",
    emailTo: "edge2mtr@gmail.com"
  },
  pages: {
    home: [
      { id: 'hero', component: 'HeroSection' },
      { id: 'products', component: 'ProductGridSection' },
      { id: 'features', component: 'WhyChooseUs' },
      { id: 'map', component: 'MapSection' }
    ],
    about: [],
    location: [],
    contact: [],
    blog: []
  }
};

export const getSiteContent = () => {
  const stored = localStorage.getItem('site_content');
  if (stored) return JSON.parse(stored);
  return initialSiteContent;
};

export const saveSiteContent = (content) => {
  localStorage.setItem('site_content', JSON.stringify(content));
  window.dispatchEvent(new Event('storage-content'));
};
