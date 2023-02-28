import ImagesApiService from './js-modules/images-service';
import createMarkup from './js-modules/createMarkup';
import { onError, onEndLoadMore, onTotalHitsNotification } from './js-modules/notifications';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';


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
window.addEventListener('scroll', throttle(checkPosition, 250))

async function onFindImages(e) {
    try {
    e.preventDefault();
    imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    if (imagesApiService.searchQuery === '') {
        return onError();
    } 
        imagesApiService.resetPage();
        imagesApiService.resetHits();
        clearImagesContainer();
        const {hits} = await imagesApiService.fetchImages();

        if (hits.length !== 0) {
                onTotalHitsNotification(imagesApiService.totalHits);
                return renderImagesMarkup(hits);
            }
    } catch (error) {
        console.log(error)
    }
};

async function onLoadMore() {
    if (imagesApiService.loadedHits > imagesApiService.totalHits) {
        onEndLoadMore();
    }
    const response = await imagesApiService.fetchImages();
    return renderImagesMarkup(response.hits)
};

async function checkPosition() {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const threshold = height - screenHeight / 2;
    const position = scrolled + screenHeight;
    if (position >= threshold) {
        return onLoadMore();
    };
};

function renderImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(images));
    return simpleGallery.refresh();
};

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
};
