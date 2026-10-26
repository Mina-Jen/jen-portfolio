// image: put a file in assets/images and set e.g. "assets/images/ai-care.jpg". Leave "" for a placeholder.
export const projects = [
  {
    title: "Sinag: Banking Application",
    summary: "Full-stack banking platform with a customer portal and a read-only admin view. Customers open accounts, deposit, withdraw and transfer; operators get live ledger reconciliation and an anomaly queue. Every movement is idempotent, audited and secured with JWT.",
    tags: ["Spring Boot","React","MySQL","Docker","JWT"],
    stats: [
      { value: "643", label: "tests" },
      { value: "2", label: "portals" },
      { value: "100%", label: "audited" }
    ],
    image: "assets/images/banking-dashboard.jpg",
    imageAlt: "Sinag banking application customer dashboard showing a total balance, deposit, withdraw and transfer actions, and a savings account card.",
    imageWidth: 1200,
    imageHeight: 844,
    browserUrl: "Sinag — customer dashboard",
    link: "https://github.com/Mina-Jen/banking-application",
    featured: true
  },
  { title: "AI-Care", summary: "Clinic management system for PUP–Mabini Campus Medical Clinics with appointments, electronic records, certificates and a Gemini-powered inquiry chatbot. Secured with OTP and CSRF protection.", tags: ["Full-stack","Gemini API","Agile"], image: "", link: "" },
  { title: "Agriculture E-Commerce", summary: "Responsive e-commerce site for agricultural products, optimized for mobile and desktop.", tags: ["HTML","CSS","JavaScript"], image: "", link: "" },
  { title: "Wedding Website", summary: "Responsive wedding-themed site built during an internship.", tags: ["React","Vite"], image: "", link: "" },
  { title: "Product Catalog System", summary: "Catalog app with CRUD, search and data persistence.", tags: [".NET C#","EF Core","SQLite"], image: "", link: "" }
];
