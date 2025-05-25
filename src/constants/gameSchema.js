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
};


export const gameTrackerData = {
    "genres": [
        {
            "genre": "Adventure",
            "color": "#1e90ff"
        }
    ],
    "years": [
        2015
    ],
    "tiers": [
        {
            "name": "S",
            "color": "#ff0000",
            "position": 1
        }
    ],
    "games": [
        {
            "name": "Dead Cells",
            "year": "2020",
            "origin": "Indie",
            "category": "Singleplayer",
            "subcategory": "Recurring by content",
            "genres": [
                "Souls-like",
                "Roguevania",
                "Platformer",
                "Hardcore",
                "Action"
            ],
            "tier": null,
            "tierPosition": null,
            "globalPosition": null
        }
    ]
}