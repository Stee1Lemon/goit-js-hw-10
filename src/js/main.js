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

refs.breedEl.addEventListener('click', findCatInfo);

fetchBreeds().then(addAllCatsToList).catch(showError);
fetchCatByBreed;

// створити клас і внести змінну туди
let shownCat = '';
let catToFind = '';

function addAllCatsToList(data) {
  const catOption = data
    .map(cat => {
      const catOption = `<option value="${cat.id}">${cat.name}</option>`;
      return catOption;
    })
    .join('');
  refs.breedEl.insertAdjacentHTML('beforeend', catOption);
  toggleLoadingPhrase();

  // catIds = new SlimSelect({
  //   select: '.breed-select',
  //   events: {
  //     afterClose: () => {
  //       catToFind = catIds.selectEl.value;
  //       findCatInfo(catToFind);
  //     },
  //   },
  // });

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
  if (error.response) {
    toggleLoadingPhrase();
    setTimeout(() => {
      refs.errorEl.classList.remove('is-hidden');
    }, 4000);
    console.log(error.response.status);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
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
