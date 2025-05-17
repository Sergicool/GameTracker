export const ORIGINS = ["Indie", "Doble A", "Triple A"];

export const CATEGORIES = {
    Singleplayer: ["One time story", "Replayable by gameplay", "Recurring by content"],
    Mixto: ["Flexible", "Cooperative"],
    Multijugador: ["PvP", "PvE"]
};

export const TIERS = ["S", "A", "B", "C", "D", "E"];

export const DEFAULT_GAME = {
    name: "",
    imageUrl: "",
    yearPlayed: null,
    origin: "",
    category: "",
    subcategory: "",
    genres: [],

    tier: null,
    tierPosition: null,
    isFavoriteOfYear: false
};
