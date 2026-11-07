const filters = document.querySelector('#filters');
const controls = [...filters.querySelectorAll('button')];
const products = [...document.querySelectorAll('.product')];
const groupTitles = [...document.querySelectorAll('.group-title')];
const count = document.querySelector('#count');

filters.hidden = false;
filters.addEventListener('click', event => {
  const selected = event.target.closest('[data-filter]');
  if (!selected) return;
  controls.forEach(control => control.setAttribute('aria-pressed', String(control === selected)));
  const category = selected.dataset.filter;
  let matches = 0;
  products.forEach(product => {
    const visible = category === 'All' || product.dataset.category === category;
    product.hidden = !visible;
    if (visible) matches += 1;
  });
  groupTitles.forEach(title => { title.hidden = category !== 'All'; });
  count.textContent = matches + (matches === 1 ? ' item' : ' items');
  const top = document.querySelector('#collection').getBoundingClientRect().top;
  if (top < 0) document.querySelector('#shop-title').scrollIntoView({ block: 'start' });
});
