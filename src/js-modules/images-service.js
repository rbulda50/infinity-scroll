import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33896615-ace76cd589cb7d39e22f51a75';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.loadedHits = 0;
    }
    async fetchImages() {
        try {
            const options = {
                params: {
                    key: API_KEY,
                    q: this.searchQuery,
                    per_page: 40,
                    page: this.page,
                    image_type: "photo",
                    orientation: "horizontal",
                    safesearch: true,
                }
            };
            const response = await axios(BASE_URL, options);
            this.page += 1;
            this.loadedHits += options.params.per_page;
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    resetPage() {
        this.page = 1;
    };

    resetHits() {
        this.loadedHits = 0;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };
}