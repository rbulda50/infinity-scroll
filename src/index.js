import ImagesApiService from './js-modules/images-service';
import createMarkup from './js-modules/createMarkup';
import LoadMoreButton from './js-modules/load-more';
import { onError, onEndLoadMore, onTotalHitsNotification } from './js-modules/notifications';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    galleryContainer: document.querySelector('.gallery'),
    form: document.querySelector('.search-form'),
};

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreButton({
    selector: '.load-more',
});

const simpleGallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

refs.form.addEventListener('submit', onFindImages);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onFindImages(e) {
    e.preventDefault();
    loadMoreBtn.hide();

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
            onError();
            return loadMoreBtn.hide();
            }
            onTotalHitsNotification(response.totalHits);
            renderImagesMarkup(response.hits);
            loadMoreBtn.show();
    } catch (error) {
        console.log(error);
    }
};

async function onLoadMore() {
    const response = await imagesApiService.fetchImages();

    if (imagesApiService.loadedHits > response.totalHits) {
            renderImagesMarkup(response.hits);
            loadMoreBtn.hide();
            return onEndLoadMore();
        } else {
            return renderImagesMarkup(response.hits);
    };
};

function renderImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(images));
    loadMoreBtn.enable();
    simpleGallery.refresh();
};

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
};


