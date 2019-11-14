const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let compSection;
  let container;
  let form;
  let loader;
  const myGif = document.createElement('img');
  myGif.src = 'loading.gif';

  function el(name, ...children) {
    const element = document.createElement(name);
    for (const child of children) {  /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }
    return element;
  }

  function showImg() {
    loader = el('div', '');
    const loadtext = document.createTextNode('Leita að fyrirtækjum...');
    loader.classList.add('loading');
    compSection.appendChild(loader);
    loader.appendChild(myGif);
    loader.appendChild(loadtext);
    loader.style.display = 'none';
  }

  function show(data) {
    for(const item of data.results) {  /* eslint-disable-line */
      if (item.active === 1) {
        const div = el('div',
          el('dl',
            el('dt', 'Nafn'),
            el('dd', item.name),
            el('dt', 'Kennitala'),
            el('dd', item.sn),
            el('dt', 'Heimilisfang'),
            el('dd', item.address))); 
        div.classList.add('company--active', 'company');
        container.appendChild(div);
      } else {
        const div = el('div',
          el('dl',
            el('dt', 'Nafn'),
            el('dd', item.name),
            el('dt', 'Kennitala'),
            el('dd', item.sn)));
        div.classList.add('company--inactive', 'company');
        container.appendChild(div);
      }
    }
  }

  function empty(elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

  function getData(e) {
    e.preventDefault();
    const inputtexti = document.querySelector('.test').value;
    empty(container);
    if (inputtexti === '' || inputtexti.trim() === '') {
      const villa = document.createTextNode('Lén verður að vera strengur');
      container.appendChild(villa);
    }
    loader.style.display = 'flex';
    fetch(API_URL + inputtexti)
      .then((response) => {
        loader.style.display = 'none';
        if (response.status != 200) {
          throw Error('Villa við að sækja gögn');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        loader.style.display = 'none';
        if (jsonResponse.results.length === 0) {
          empty(container);
          const tomt = document.createTextNode('Ekkert fyrirtæki fannst fyrir leitarstreng');
          container.appendChild(tomt);
        }
        show(jsonResponse);
      })
      .catch(e => console.error('Villa við að sækja gögn', Error));  /* eslint-disable-line */
  }

  function init(companies) {
    compSection = companies;
    container = compSection.querySelector('.results');
    form = compSection.querySelector('form');
    form.addEventListener('submit', getData);
    showImg();
  }
  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.comp');
  program.init(companies);
});
