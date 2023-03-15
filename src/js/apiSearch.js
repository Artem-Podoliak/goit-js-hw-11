import axios from 'axios';
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '34388571-e7436fad89988abd77e9e1e04';

export default class SearchImg {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    try {
      const images = await axios
        .get(
          `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
        )
        .then(response => {
          const data = response.data;

          if (data.hits.length === 0) {
            this.incorrectQuery();
          }
          if (this.page * 40 >= data.totalHits && data.hits.length !== 0) {
            this.endOfGallery();
          }
          if (this.page === 1 && data.totalHits !== 0) {
            this.amountOfHits(data.totalHits);
          }

          this.incrementPage();
          return data;
        });
      return images;
    } catch (error) {
      this.errorQuery(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  incorrectQuery() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  endOfGallery() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  amountOfHits(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  errorQuery(error) {
    Notiflix.Notify.failure(
      `Oops! Something went wrong. Error: ${error.message}`
    );
  }
}
