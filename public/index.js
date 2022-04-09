window.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('price');
  if (element === null) {
    return;
  }

  async function updatePrice() {
    try {
      const response = await fetch('/api/v1/aliexpress');
      const data = await response.json();
      element.innerText = Intl.NumberFormat('ru-RU').format(+data.price);
    } catch (e) {
      console.error(e);
    }
  }

  setInterval(updatePrice, 1000 * 60 * 10);
  updatePrice();
});
