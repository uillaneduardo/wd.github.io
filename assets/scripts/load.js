/* ===== Adiciona uma animação ao carregar a tela ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('appLoader');
    if (loader) loader.style.display = 'none';
  }, 1500); // tempo da animação antes de exibir a página
});
