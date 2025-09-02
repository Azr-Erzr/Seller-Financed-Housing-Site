export const LISTINGS = [
  {
    id: "h1",
    title: "Sunny Craftsman near Park",
    address: "145 Maple Ave",
    city: "Whitby",
    state: "ON",
    images: ["/img/house1.jpg", ""],
    price: 575000,
    downMinPct: 0.08,
    interestRange: [0.055, 0.085],
    termYears: 30,
    dealTypes: ["seller-finance", "rent-to-own"],
    sellerGoals: ["cashflow", "stable-income"],
    bedrooms: 3,
    baths: 2,
    sqft: 1800,
    lot: "40x120",
    badges: ["Rent-to-Own", "Verified Seller"],
    description:
      "Charming craftsman on a quiet street close to the park and schools. Updated kitchen, large backyard, and a finished basement.",
    docsLocked: true
  },
  {
    id: "h2",
    title: "Corner Townhouse • Garage",
    address: "100 Dundas St E #204",
    city: "Whitby",
    state: "ON",
    images: ["/img/house2.jpg", ""],
    price: 599000,
    downMinPct: 0.1,
    interestRange: [0.06, 0.09],
    termYears: 25,
    dealTypes: ["seller-finance"],
    sellerGoals: ["low-risk"],
    bedrooms: 2,
    baths: 2,
    sqft: 1400,
    lot: "—",
    badges: ["Low Down OK"],
    description:
      "Modern corner unit with lots of natural light. Steps to transit and shops. Garage parking. Seller open to longer amortization.",
    docsLocked: true
  }
];

export const PROFILES = [
  {
    id: "p1",
    name: "Alyssa T.",
    avatar: "",
    location: "Whitby",
    downBudget: 60000,
    interestMax: 0.085,
    paymentBudget: 3400,
    monthlyIncome: 9200,
    monthlyDebt: 900,
    dealPreference: ["rent-to-own", "seller-finance"],
    bio: "Young family looking for 3-bed near parks. Comfortable with RTO, prefer steady monthly payments."
  },
  {
    id: "p2",
    name: "Daniel R.",
    avatar: "",
    location: "Oshawa",
    downBudget: 45000,
    interestMax: 0.08,
    paymentBudget: 3000,
    monthlyIncome: 8000,
    monthlyDebt: 600,
    dealPreference: ["seller-finance"],
    bio: "Engineer relocating for work. Seeking townhouse with garage. Comfortable with classic SF terms."
  }
];