export const categories = [
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    accent: "#C94B5F",
    soft: "#F3D8DC",
    cardBg: "#F6A9BC",
    mood: "Bold, editorial, expressive",
    tagline: "Silhouettes that speak first.",
    description:
      "Seasonless pieces cut for presence. Sculpted tailoring, tactile knits, and evening-ready form.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tech",
    name: "Tech",
    slug: "tech",
    accent: "#3B82F6",
    soft: "#DCEBFF",
    cardBg: "#A8CBFF",
    mood: "Futuristic, precise, energetic",
    tagline: "Objects with intent.",
    description:
      "Quiet hardware and luminous tools designed to disappear into the ritual of making.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "home",
    name: "Home",
    slug: "home",
    accent: "#6F8064",
    soft: "#DDE5D7",
    cardBg: "#B9CBAC",
    mood: "Warm, natural, calm",
    tagline: "Rooms that hold still.",
    description:
      "Stone, linen, and slow light. Objects for rooms that feel lived-in, not staged.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "fitness",
    name: "Fitness",
    slug: "fitness",
    accent: "#E86A33",
    soft: "#FFE1D2",
    cardBg: "#FFB68C",
    mood: "Energetic, powerful, dynamic",
    tagline: "Motion, then recovery.",
    description:
      "Kit for the hour that asks more of you — and the hour that gives it back.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "travel",
    name: "Travel",
    slug: "travel",
    accent: "#159A9C",
    soft: "#D5F0EF",
    cardBg: "#8FDCD6",
    mood: "Adventurous, fresh, open",
    tagline: "Carry less. Stay longer.",
    description:
      "Luggage, layers, and field notes for cities you haven’t named yet.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  },
]

export const getCategory = (slug) => categories.find((c) => c.slug === slug)
