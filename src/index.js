import ImagesApiService from './js-modules/images-service';
import createMarkup from './js-modules/createMarkup';
import { onError, onEndLoadMore, onTotalHitsNotification } from './js-modules/notifications';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    galleryContainer: document.querySelector('.gallery'),
    form: document.querySelector('.search-form'),
    bottomOfPage: document.querySelector('#bottomOfPage'),
};

const imagesApiService = new ImagesApiService();

const simpleGallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

refs.form.addEventListener('submit', onFindImages);

async function onFindImages(e) {
    try {
            e.preventDefault();
            imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

        if (!imagesApiService.searchQuery) {
            clearImagesContainer();
            return onError();
        }
            clearImagesContainer();
            imagesApiService.resetPage();
            imagesApiService.resetHits();
            const response = await imagesApiService.fetchImages();
        if (imagesApiService.totalHits === 0) {
            return onError();
        }
            onTotalHitsNotification(imagesApiService.totalHits);
            renderImagesMarkup(response.hits);
            return;
    } catch (error) {
        console.log(error);
    };
};

const onLoadMore = async entries => {
    entries.forEach(async entry => {
        if (entry.isIntersecting &&
            imagesApiService.loadedHits < imagesApiService.totalHits &&
            imagesApiService.searchQuery !== '') {
            const response = await imagesApiService.fetchImages();
            renderImagesMarkup(response.hits);
        } else if (imagesApiService.loadedHits > imagesApiService.totalHits) {
            return onEndLoadMore();
        };
    });
};

const observer = new IntersectionObserver(onLoadMore, {
  rootMargin: '200px',
});
observer.observe(refs.bottomOfPage)

function renderImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(images));
    simpleGallery.refresh();
    return;
};

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
};
