import ImagesApiService from './js-modules/images-service';
import createMarkup from './js-modules/createMarkup';
import { onError, onEndLoadMore, onTotalHitsNotification } from './js-modules/notifications';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    galleryContainer: document.querySelector('.gallery'),
    form: document.querySelector('.search-form'),
};

const imagesApiService = new ImagesApiService();

const simpleGallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

refs.form.addEventListener('submit', onFindImages);

async function onFindImages(e) {
    e.preventDefault();

    const inputValue = e.currentTarget.elements.searchQuery.value;
    imagesApiService.query = inputValue;

    if (inputValue.trim() === '') {
        return onError();
    } 
    imagesApiService.resetPage();
    imagesApiService.resetHits();
    clearImagesContainer();

    try {
        const response = await imagesApiService.fetchImages();
        if (response.hits.length === 0) {
            return onError();
            }
            onTotalHitsNotification(response.totalHits);
            renderImagesMarkup(response.hits);
    } catch (error) {
        console.log(error);
    }
};


function renderImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(images));
    simpleGallery.refresh();
};

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
};


