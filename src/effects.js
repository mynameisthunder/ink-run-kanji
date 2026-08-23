export function burst() {
  const colors = ["#f04b2f", "#284fef", "#f2c94c", "#24825f", "#171714"];
  for (let index = 0; index < 38; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${-20 - Math.random() * 180}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - .5) * 260}px`);
    piece.style.setProperty("--r", `${(Math.random() - .5) * 900}deg`);
    piece.style.animationDelay = `${Math.random() * 260}ms`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 1500);
  }
}
