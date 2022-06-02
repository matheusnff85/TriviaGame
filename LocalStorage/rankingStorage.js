export const setRanking = (newRanking) => {
  localStorage.setItem('ranking', JSON.stringify(newRanking));
};

export const getRanking = () => {
  let RANKING = [];
  const getRankingList = localStorage.getItem('ranking');
  RANKING = getRankingList ? JSON.parse(getRankingList) : [];
  return RANKING;
};

export const addToRanking = (player) => {
  const players = getRanking();
  players.push(player);
  setRanking(players);
};

/*
  Referências / Material para estudo:
  https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/
  https://hashnode.com/post/store-multiple-objects-with-same-name-in-localstorage-using-storejs-cjuso20wv000pj5s18a88xo3w
*/
