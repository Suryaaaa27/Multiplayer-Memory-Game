document.addEventListener("DOMContentLoaded", () => {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
  scores.sort((a, b) => (b.winnerScore || 0) - (a.winnerScore || 0));

  const tbody = document.querySelector('#leaderboard tbody');
  tbody.innerHTML = '';

  scores.forEach(entry => {
    const player1 = entry.player1 || {};
    const player2 = entry.player2 || {};
    const winner = entry.winner || "Draw";

    const avatar1 = player1.email ? `https://www.gravatar.com/avatar/${md5(player1.email.trim().toLowerCase())}?d=identicon` : "https://www.gravatar.com/avatar/?d=mp";
    const avatar2 = player2.email ? `https://www.gravatar.com/avatar/${md5(player2.email.trim().toLowerCase())}?d=identicon` : "https://www.gravatar.com/avatar/?d=mp";

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${avatar1}" class="avatar" alt="avatar1" /></td>
      <td>${player1.name || "Player 1"}</td>
      <td>${player1.score || 0}</td>
      <td><img src="${avatar2}" class="avatar" alt="avatar2" /></td>
      <td>${player2.name || "Player 2"}</td>
      <td>${player2.score || 0}</td>
      <td><strong>${winner}</strong></td>
      <td>${entry.date || ""}</td>
    `;
    tbody.appendChild(row);
  });
});
