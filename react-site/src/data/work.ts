export type WorkCategory =
  | "brand"
  | "design"
  | "campaigns"
  | "production"
  | "tech"
  | "xperience"
  | "selected-work";

export type WorkImage = {
  src: string;
  alt: string;
};

export type WorkProject = {
  id: string;
  title: string;
  category: WorkCategory;
  image: WorkImage;
  logo?: string;
  tags: string[];
  gallery: WorkImage[];
};

export const categoryLabels: Record<WorkCategory, string> = {
  brand: "Brand",
  design: "Design",
  campaigns: "Campaigns",
  production: "Production",
  tech: "Tech",
  xperience: "Xperience",
  "selected-work": "Selected Work",
};

export const workProjects: WorkProject[] = [
  {
    id: "srnty",
    title: "SRNTY",
    category: "brand",
    image: { src: "assets/profile/srnty-goldenhour.webp", alt: "SRNTY Hotels, golden-hour hero" },
    logo: "assets/clients/library-srnty-hotels.svg",
    tags: ["Brand strategy", "Brand architecture", "Naming"],
    gallery: [
      { src: "assets/profile/srnty-goldenhour.webp", alt: "SRNTY Hotels, golden-hour hero" },
      { src: "assets/profile/srnty-p25.webp", alt: "SRNTY brand hierarchy, Brand Story page 25" },
      { src: "assets/profile/srnty-trifold.webp", alt: "SRNTY Hotels trifold" },
    ],
  },
  {
    id: "vodafone-egypt",
    title: "Vodafone Egypt",
    category: "design",
    image: { src: "assets/profile/vf-p14.webp", alt: "Vodafone Egypt Sustainability Report 2024–2025, Key Highlights page 14" },
    logo: "assets/clients/color-01.svg",
    tags: ["Report design", "Editorial system", "Web / UX"],
    gallery: [
      { src: "assets/profile/vf-p14.webp", alt: "Vodafone Egypt Sustainability Report 2024–2025, Key Highlights page 14" },
      { src: "assets/profile/vf-microsite.webp", alt: "Vodafone Egypt sustainability report microsite, Arabic" },
      { src: "assets/portfolio-refresh/vodafone-19cIF1VQ.webp", alt: "Vodafone 2025 sustainability reporting highlights" },
    ],
  },
  {
    id: "tasaheel",
    title: "Tasaheel",
    category: "campaigns",
    image: { src: "assets/portfolio-refresh/tasaheel-165_8a7G.webp", alt: "Tasaheel Gold campaign — original film still 1" },
    logo: "assets/clients/color-51.svg",
    tags: ["Creative copy", "Production", "Post-production"],
    gallery: [
      { src: "assets/portfolio-refresh/tasaheel-165_8a7G.webp", alt: "Tasaheel Gold campaign — original film still 1" },
      { src: "assets/portfolio-refresh/tasaheel-1gQELgo0.webp", alt: "Tasaheel Gold campaign — original film still 2" },
      { src: "assets/portfolio-refresh/tasaheel-1_p2DMh-.webp", alt: "Tasaheel Gold campaign — original film still 3" },
    ],
  },
  {
    id: "americana-recipes",
    title: "Americana Recipes",
    category: "production",
    image: { src: "assets/profile/zinger_04.webp", alt: "Air-fry lettuce wrap with zinger strips, recipe film frame" },
    logo: "assets/clients/library-americana.png",
    tags: ["Recipe development", "Food styling", "Video production"],
    gallery: [
      { src: "assets/profile/zinger_04.webp", alt: "Air-fry lettuce wrap with zinger strips, recipe film frame" },
      { src: "assets/profile/chicken_04.webp", alt: "Air-fry lettuce wrap chicken burger, overhead preparation frame" },
      { src: "assets/profile/buddha_02.webp", alt: "Air-fry nuggets Buddha bowl, recipe film frame" },
    ],
  },
  {
    id: "americana-foodservice",
    title: "Americana Foodservice",
    category: "tech",
    image: { src: "assets/portfolio-refresh/americana-1XYW8Ioc.webp", alt: "Americana Foodservice digital catalogue landing page" },
    logo: "assets/clients/library-americana.png",
    tags: ["Web design", "Web development", "UX/UI"],
    gallery: [
      { src: "assets/portfolio-refresh/americana-1XYW8Ioc.webp", alt: "Americana Foodservice digital catalogue landing page" },
      { src: "assets/portfolio-refresh/americana-1GoKtt2a.webp", alt: "Americana featured product selection" },
      { src: "assets/portfolio-refresh/americana-13zEqOs5.webp", alt: "Americana catalogue filters and product categories" },
    ],
  },
  {
    id: "americana-qsr",
    title: "Americana QSR",
    category: "xperience",
    image: { src: "assets/profile/mcd-diorama.webp", alt: "McDonald's Americana diorama" },
    logo: "assets/clients/library-americana.png",
    tags: ["Creative concept", "3D model design", "3D printing"],
    gallery: [
      { src: "assets/profile/mcd-diorama.webp", alt: "McDonald's Americana diorama" },
      { src: "assets/profile/americana-storefront.webp", alt: "Americana storefront" },
      { src: "assets/profile/bk-object.webp", alt: "Burger King Americana object" },
    ],
  },
  {
    id: "aman",
    title: "AMAN",
    category: "brand",
    image: { src: "assets/portfolio-refresh/aman-1UqPc9U_.webp", alt: "AMAN reception identity application" },
    logo: "assets/clients/library-aman.svg",
    tags: ["Rebranding & bilingual identity", "Arabic logo refresh", "English logo design"],
    gallery: [
      { src: "assets/portfolio-refresh/aman-1UqPc9U_.webp", alt: "AMAN reception identity application" },
      { src: "assets/portfolio-refresh/aman-1blbe1Rh.webp", alt: "AMAN workspace identity application" },
      { src: "assets/portfolio-refresh/aman-1DBPaLyX.webp", alt: "AMAN merchant kiosk branding" },
    ],
  },
  {
    id: "nuxera",
    title: "Nuxera",
    category: "brand",
    image: { src: "assets/portfolio-refresh/nuxera-1fWBD1PB.webp", alt: "Nuxera wordmark and waveform identity" },
    logo: "assets/clients/library-nuxera.svg",
    tags: ["Branding & positioning", "Social media design", "Graphic design"],
    gallery: [
      { src: "assets/portfolio-refresh/nuxera-1fWBD1PB.webp", alt: "Nuxera wordmark and waveform identity" },
      { src: "assets/portfolio-refresh/nuxera-18oAuS5i.webp", alt: "Nuxera mobile brand application" },
      { src: "assets/portfolio-refresh/nuxera-1x2bF78X.webp", alt: "Nuxera clinical uniform branding" },
    ],
  },
  {
    id: "waffy",
    title: "Waffy",
    category: "brand",
    image: { src: "assets/profile/waffy-1.webp", alt: "Waffy — project artwork" },
    logo: "assets/clients/color-28.svg",
    tags: ["Naming", "Branding concept & strategy", "Packaging"],
    gallery: [
      { src: "assets/profile/waffy-1.webp", alt: "Waffy — project artwork" },
      { src: "assets/profile/waffy-2.webp", alt: "Waffy — project artwork" },
      { src: "assets/portfolio-refresh/waffy-1UA-0ywo.webp", alt: "Waffy naming and mark sketches" },
    ],
  },
  {
    id: "dlng",
    title: "DLNG",
    category: "brand",
    image: { src: "assets/portfolio-refresh/dlng-1idpwEgB.webp", alt: "DLNG stationery identity" },
    logo: "assets/clients/color-24.svg",
    tags: ["Logo design", "Visual identity", "Brand book"],
    gallery: [
      { src: "assets/portfolio-refresh/dlng-1idpwEgB.webp", alt: "DLNG stationery identity" },
      { src: "assets/portfolio-refresh/dlng-1tp7ybos.webp", alt: "DLNG branded transport application" },
      { src: "assets/portfolio-refresh/dlng-1D737Um1.webp", alt: "DLNG building signage" },
    ],
  },
  {
    id: "fasahet-somaya",
    title: "Fasahet Somaya",
    category: "brand",
    image: { src: "assets/profile/fasahet-1.webp", alt: "Fasahet Somaya — project artwork" },
    logo: "assets/clients/color-30.svg",
    tags: ["Branding design & strategy", "Interior & exterior facelift", "Furniture concept"],
    gallery: [
      { src: "assets/profile/fasahet-1.webp", alt: "Fasahet Somaya — project artwork" },
      { src: "assets/portfolio-refresh/fasahet-somaya-1EEm6q48.webp", alt: "Fasahet Somaya restaurant facade in Downtown Cairo" },
      { src: "assets/portfolio-refresh/fasahet-somaya-1MVbE-54.webp", alt: "Somaya at the restaurant" },
    ],
  },
  {
    id: "alx",
    title: "ALX",
    category: "campaigns",
    image: { src: "assets/portfolio-refresh/alx-1DW46l2s.webp", alt: "ALX archive launch campaign portrait" },
    logo: "assets/clients/library-alx-arabia.png",
    tags: ["Launch strategy", "Localisation", "Integrated campaigns"],
    gallery: [
      { src: "assets/portfolio-refresh/alx-1DW46l2s.webp", alt: "ALX archive launch campaign portrait" },
      { src: "assets/portfolio-refresh/alx-1_H8tmed.webp", alt: "ALX archive virtual-assistant launch artwork" },
      { src: "assets/portfolio-refresh/alx-1ixs3l7a.webp", alt: "ALX archive application-deadline artwork, February 2022" },
    ],
  },
  {
    id: "novartis",
    title: "Novartis",
    category: "campaigns",
    image: { src: "assets/portfolio-refresh/novartis-1AaVkTVL.webp", alt: "Novartis thalassemia awareness billboard" },
    logo: "assets/clients/color-23.svg",
    tags: ["Creative concept", "Key visuals", "OOH implementation"],
    gallery: [
      { src: "assets/portfolio-refresh/novartis-1AaVkTVL.webp", alt: "Novartis thalassemia awareness billboard" },
      { src: "assets/portfolio-refresh/novartis-1n4t2y7L.webp", alt: "Novartis awareness campaign in a station" },
      { src: "assets/portfolio-refresh/novartis-1M-hvoxo.webp", alt: "Novartis thalassemia outdoor campaign" },
    ],
  },
  {
    id: "kipco",
    title: "KIPCO",
    category: "production",
    image: { src: "assets/profile/kipco-skyline.webp", alt: "KIPCO corporate video, Kuwait City skyline frame" },
    logo: "assets/clients/library-kipco.png",
    tags: ["Corporate video", "Production"],
    gallery: [{ src: "assets/profile/kipco-skyline.webp", alt: "KIPCO corporate video, Kuwait City skyline frame" }],
  },
  {
    id: "california-garden-recipes",
    title: "California Garden Recipes",
    category: "production",
    image: { src: "assets/portfolio-refresh/california-1ZOJ4Jnj.webp", alt: "California Garden Ramadan recipe — molokhia with chicken and rice" },
    tags: ["Recipe development", "Food styling", "Video production"],
    gallery: [
      { src: "assets/portfolio-refresh/california-1ZOJ4Jnj.webp", alt: "California Garden Ramadan recipe — molokhia with chicken and rice" },
      { src: "assets/portfolio-refresh/california-1FoWfEdE.webp", alt: "California Garden Ramadan recipe — okra tray with chicken" },
    ],
  },
  {
    id: "plastic-bank",
    title: "Plastic Bank",
    category: "xperience",
    image: { src: "assets/portfolio-refresh/plastic-bank-r06-01_tile_square_1x1.webp", alt: "Plastic Bank recognition tile with encapsulated plastic waste" },
    logo: "assets/clients/library-plastic-bank.png",
    tags: ["Strategic gifting", "Product design", "B2B campaign"],
    gallery: [
      { src: "assets/portfolio-refresh/plastic-bank-r06-01_tile_square_1x1.webp", alt: "Plastic Bank recognition tile with encapsulated plastic waste" },
      { src: "assets/portfolio-refresh/plastic-bank-r06-02_coasters_square_1x1.webp", alt: "Plastic Bank handmade resin coaster pair" },
      { src: "assets/portfolio-refresh/plastic-bank-r06-03_pack_square_1x1.webp", alt: "Plastic Bank kraft packaging and the two coaster designs" },
    ],
  },
  {
    id: "joy-scents",
    title: "Joy Scents",
    category: "selected-work",
    image: { src: "assets/profile/joy-1.webp", alt: "Joy Scents — project artwork" },
    logo: "assets/clients/library-joy-scents.png",
    tags: ["Branding", "Logo animation", "Social media design"],
    gallery: [
      { src: "assets/profile/joy-1.webp", alt: "Joy Scents — project artwork" },
      { src: "assets/portfolio-refresh/joy-v08-ultra_bronze.webp", alt: "JOY Ultra — exterior product model study" },
      { src: "assets/portfolio-refresh/joy-v08-portable_black_copper_cap.webp", alt: "JOY Portable — exterior product model study" },
    ],
  },
  {
    id: "j-ra",
    title: "Jēra",
    category: "selected-work",
    image: { src: "assets/portfolio-refresh/jera-v06-02_fibre_ensemble.webp", alt: "Jēra furniture family — product presentation study" },
    logo: "assets/clients/color-26.svg",
    tags: ["Naming & brand story", "Branding design", "Digital strategy"],
    gallery: [
      { src: "assets/portfolio-refresh/jera-v06-02_fibre_ensemble.webp", alt: "Jēra furniture family — product presentation study" },
      { src: "assets/portfolio-refresh/jera-v06-01_suspended_curve.webp", alt: "Jēra Cupcake — suspended product study" },
      { src: "assets/portfolio-refresh/jera-v06-03_fluted_architecture.webp", alt: "Jēra Cupcake material and fluting detail" },
    ],
  },
  {
    id: "afied",
    title: "AFIED",
    category: "selected-work",
    image: { src: "assets/profile/afied-building.webp", alt: "AFIED building signage" },
    logo: "assets/clients/color-29.svg",
    tags: ["Naming", "Branding concept & strategy", "Concept development"],
    gallery: [
      { src: "assets/profile/afied-building.webp", alt: "AFIED building signage" },
      { src: "assets/profile/afied-stationery-f095.webp", alt: "AFIED stationery system" },
      { src: "assets/profile/afied-container.webp", alt: "Powered by AFIED shipping container" },
    ],
  },
  {
    id: "thirteen",
    title: "Thirteen",
    category: "selected-work",
    image: { src: "assets/portfolio-refresh/thirteen-1FkmmNY-.webp", alt: "Thirteen product and packaging photography" },
    logo: "assets/clients/color-59.svg",
    tags: ["Digital strategy", "Photography", "Videography"],
    gallery: [
      { src: "assets/portfolio-refresh/thirteen-1FkmmNY-.webp", alt: "Thirteen product and packaging photography" },
      { src: "assets/portfolio-refresh/thirteen-1HwqkAKf.webp", alt: "Thirteen beauty-oil product photograph" },
      { src: "assets/profile/thirteen-1.webp", alt: "Thirteen — project artwork" },
    ],
  },
  {
    id: "cccj-studio",
    title: "CCCJ Studio",
    category: "selected-work",
    image: { src: "assets/profile/cccj-1.webp", alt: "CCCJ Studio — project artwork" },
    logo: "assets/clients/library-cccj-studio.png",
    tags: ["Content strategy", "Social media", "Video production"],
    gallery: [{ src: "assets/profile/cccj-1.webp", alt: "CCCJ Studio — project artwork" }],
  },
  {
    id: "t-d-designs",
    title: "T&D Designs",
    category: "selected-work",
    image: { src: "assets/portfolio-refresh/t-d-1Baa-nFq.webp", alt: "T&D Designs company profile cover" },
    logo: "assets/clients/library-t-d-designs.png",
    tags: ["Website design", "Company profile design"],
    gallery: [
      { src: "assets/portfolio-refresh/t-d-1Baa-nFq.webp", alt: "T&D Designs company profile cover" },
      { src: "assets/portfolio-refresh/t-d-16s_oSxk.webp", alt: "T&D office furniture catalogue spread" },
      { src: "assets/portfolio-refresh/t-d-1Ea6UGhB.webp", alt: "T&D Designs company profile interior pages" },
    ],
  },
  {
    id: "monka",
    title: "Monka",
    category: "brand",
    image: { src: "assets/portfolio-refresh/monka-1-zN7vuE.webp", alt: "Monka brand and product identity" },
    logo: "assets/clients/color-27.svg",
    tags: ["Strategy", "Branding", "Digital"],
    gallery: [
      { src: "assets/portfolio-refresh/monka-1-zN7vuE.webp", alt: "Monka brand and product identity" },
      { src: "assets/portfolio-refresh/monka-1zXSeukf.webp", alt: "Monka packaging and digital brand applications" },
      { src: "assets/portfolio-refresh/monka-1F8DEyoV.webp", alt: "Monka online store presentation" },
    ],
  },
];
