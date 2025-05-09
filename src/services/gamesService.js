export const saveGame = (game) => {
    const stored = localStorage.getItem("games");
    const games = stored ? JSON.parse(stored) : [];
    games.push(game);
    localStorage.setItem("games", JSON.stringify(games));
};
  
export const getGames = () => {
    const stored = localStorage.getItem("games");
    return stored ? JSON.parse(stored) : [];
};
  