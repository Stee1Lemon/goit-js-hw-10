import { fetchBreeds, fetchCatByBreed } from './cat-api';
import '../css/common.css';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const refs = {
  breedEl: document.querySelector('.breed-select'),
  catInfoEl: document.querySelector('.cat-info'),
  loadingEl: document.querySelector('.loader-p'),
  errorEl: document.querySelector('.error'),
};

refs.breedEl.addEventListener('change', findCatInfo);

fetchBreeds().then(addAllCatsToList).catch(showError);
fetchCatByBreed;

// створити клас і внести змінну туди
let shownCat = '';

function addAllCatsToList(data) {
  const catOption = data
    .map(cat => {
      const catOption = `<option value="${cat.id}">${cat.name}</option>`;
      return catOption;
    })
    .join('');
  refs.breedEl.insertAdjacentHTML('beforeend', catOption);

  new SlimSelect({
    select: '#breed-select',
  });

  refs.breedEl.classList.remove('is-hidden');
}

function findCatInfo(event) {
  const catId = event.currentTarget.value;
  if (catId === shownCat) {
    return;
  }
  toggleLoadingPhrase();
  toggleCatInfo();
  fetchCatByBreed(catId).then(showCatInfo).catch(showError);
}

function showCatInfo(item) {
  const catImg = item[0];
  const catInfo = catImg.breeds[0];
  makeCatCard(catImg, catInfo);
  toggleLoadingPhrase();
  toggleCatInfo();
}

function showError(error) {
  if (error) {
    toggleLoadingPhrase();
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    console.log(error.message);
  }
}

function makeCatCard(catImg, catInfo) {
  const markUp = `
  <div class='container'>
    <img src='${catImg.url}' alt='Cat ${catInfo.name}'/>
  </div>
  <div>
    <h1 class='title'">${catInfo.name}</h1>
    <p>${catInfo.description}</p>
    <p class='habits'>${catInfo.temperament}</p>
  </div>`;
  refs.catInfoEl.innerHTML = markUp;
  shownCat = catInfo.id;
}

function toggleLoadingPhrase() {
  refs.loadingEl.classList.toggle('is-hidden');
}

function toggleCatInfo() {
  refs.catInfoEl.classList.toggle('is-hidden');
}
