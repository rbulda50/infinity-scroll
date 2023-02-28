import Notiflix from 'notiflix';

function onError() {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function onEndLoadMore() {
    return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
};

function onTotalHitsNotification(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};


export { onError, onEndLoadMore, onTotalHitsNotification };