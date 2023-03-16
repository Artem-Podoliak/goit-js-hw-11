import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchImg from './js/apiSearch';
import './css/styles.css'// 

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

const seargImg = new SearchImg();

const lightbox = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: '250',
});

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtnEl.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  resetMarkup()

  const searchName = e.currentTarget.elements.searchQuery.value.trim();
  seargImg.searchQuery = searchName;

  if (searchName !== '') {
    seargImg.resetPage();
    const imgDataColection = await seargImg.fetchImg();

    renderGallery(imgDataColection);
    
    if (imgDataColection.hits.length < imgDataColection.totalHits) {
      showLoadMoreBtnEl()
    }
  }
}

async function onLoadMore() {
  const nextImgDataColection = await seargImg.fetchImg();
  renderGallery(nextImgDataColection);
  
  
  if ((seargImg.page - 1) * 40 >= nextImgDataColection.totalHits) {
    hideLoadMoreBtnEl() 
  }
}

function renderGallery(data) {
  const imgCards = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a class="photo-card__item" href="${largeImageURL}">
    <div class="photo-card__tumb">
    <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
    <div class="info">
      <p class="info-item">
      <b class="info-item__param">Likes</b>
      <span class="info-item__num">${likes}</span>
      </p>
      <p class="info-item">
      <b class="info-item__param">Views</b>
      <span class="info-item__num">${views}</span>
      </p>
      <p class="info-item">
      <b class="info-item__param">Comments</b>
      <span class="info-item__num">${comments}</span>
      </p>
      <p class="info-item">
      <b class="info-item__param">Downloads</b>
      <span class="info-item__num">${downloads}</span>
      </p>
    </div>
    </a>
  </div>`
    )
    .join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', imgCards);

  lightbox.refresh();

  makeSmoothScroll()
  
}

function resetMarkup() {
    if (refs.galleryEl.childNodes.length !== 0) {
        refs.galleryEl.innerHTML = ''
        hideLoadMoreBtnEl()
    }
}

function showLoadMoreBtnEl() {
    refs.loadMoreBtnEl.classList.remove('hiden')
}

function hideLoadMoreBtnEl() {
    refs.loadMoreBtnEl.classList.add('hiden')
}

function makeSmoothScroll() {
    if (seargImg.page - 1 > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
  
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }