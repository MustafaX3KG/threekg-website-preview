export type Client = {
  name: string;
  logo: string;
};

export type ClientSector = {
  sector: string;
  clients: Client[];
};

export const clientSectors: ClientSector[] = [
  {
    sector: "Food FMCG & Hospitality",
    clients: [
      { name: "Americana", logo: "assets/clients/library-americana.png" },
      { name: "Kerma Dairy", logo: "assets/clients/color-43.svg" },
      { name: "MG Foods", logo: "assets/clients/library-mg-foods.png" },
      { name: "Bruz", logo: "assets/clients/library-bruz.png" },
      { name: "Waffy", logo: "assets/clients/color-28.svg" },
      { name: "Fasahet Somaya", logo: "assets/clients/color-30.svg" },
      { name: "Four Seasons Hotel Cairo", logo: "assets/clients/color-61.svg" },
      { name: "SRNTY Hotels", logo: "assets/clients/library-srnty-hotels.svg" },
      { name: "Savola", logo: "assets/clients/color-41.svg" },
      { name: "Ganna", logo: "assets/clients/library-ganna.png" },
      { name: "Rawaby", logo: "assets/clients/library-rawaby.png" },
      { name: "Monka", logo: "assets/clients/color-27.svg" },
      { name: "Pepper", logo: "assets/clients/color-63.svg" },
    ],
  },
  {
    sector: "Healthcare & Pharma",
    clients: [
      { name: "Novartis", logo: "assets/clients/color-23.svg" },
      { name: "Abbott", logo: "assets/clients/color-21.svg" },
      { name: "Nuxera", logo: "assets/clients/library-nuxera.svg" },
    ],
  },
  {
    sector: "Development & Sustainability",
    clients: [
      { name: "Plastic Bank", logo: "assets/clients/library-plastic-bank.png" },
      { name: "AFRIKA KOMMT!", logo: "assets/clients/library-afrika-kommt.png" },
      { name: "AFIED", logo: "assets/clients/color-29.svg" },
    ],
  },
  {
    sector: "Financial Services & Fintech",
    clients: [
      { name: "AMAN", logo: "assets/clients/color-20.svg" },
      { name: "Fawry Plus", logo: "assets/clients/library-fawry-plus.png" },
      { name: "Orient Takaful", logo: "assets/clients/color-12.svg" },
      { name: "Tasaheel", logo: "assets/clients/color-51.svg" },
      { name: "ALEXBANK", logo: "assets/clients/library-alexbank.png" },
      { name: "KIPCO", logo: "assets/clients/library-kipco.png" },
      { name: "Kashat", logo: "assets/clients/official-kashat.svg" },
      { name: "Tamam", logo: "assets/clients/library-tamam.png" },
    ],
  },
  {
    sector: "Technology Telecom & Education",
    clients: [
      { name: "Vodafone Egypt", logo: "assets/clients/color-01.svg" },
      { name: "ALX Arabia", logo: "assets/clients/library-alx-arabia.png" },
      { name: "Giza Systems", logo: "assets/clients/library-giza-systems.png" },
      { name: "Salasa", logo: "assets/clients/color-54.svg" },
      { name: "Printbox", logo: "assets/clients/library-printbox.png" },
      { name: "CCCJ Studio", logo: "assets/clients/library-cccj-studio.png" },
    ],
  },
  {
    sector: "Industry Automotive & Real Estate",
    clients: [
      { name: "DLNG", logo: "assets/clients/color-24.svg" },
      { name: "T&D Designs", logo: "assets/clients/library-t-d-designs.png" },
      { name: "Automobilak", logo: "assets/clients/color-33.svg" },
      { name: "Hyde Park", logo: "assets/clients/library-hyde-park.png" },
    ],
  },
  {
    sector: "Media Culture & Lifestyle",
    clients: [
      { name: "Masr 360", logo: "assets/clients/official-masr360.svg" },
      { name: "Tatweeg News", logo: "assets/clients/color-25.svg" },
      { name: "Thirteen", logo: "assets/clients/color-59.svg" },
      { name: "Joy Scents", logo: "assets/clients/library-joy-scents.png" },
      { name: "Dr Scent", logo: "assets/clients/library-dr-scent.png" },
      { name: "Jēra", logo: "assets/clients/color-26.svg" },
    ],
  },
];
