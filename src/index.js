import './main.scss'

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderMarkup } from './renderMarkup';


const searchFormRef = document.querySelector('#search-form');
const submitBtnRef = document.querySelector('[type="submit"]')
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let name = '';
let page = 1;
let limit = 40;
let disabled = false;
let lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 250, captionsData: 'alt', });

const API_KEY = '31248055-e075bd58b7f60ee40b8d7aef1';
const BASE_URL = 'https://pixabay.com/api/';

async function getImg(name, page, limit) {
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`);
        if (response.total === 0) {
            return;
        }
        const picture = await response.data;
        return picture
    } catch (error) {
    }
};


galleryRef.addEventListener('click', e => e.preventDefault());

loadMoreBtn.addEventListener('click', debounce(() => {
    loadMoreBtn.classList.add("is-hidden");
    page += 1;
    makeFetchResponse(name, page);
}, 300));

searchFormRef.addEventListener('submit', e => {
    e.preventDefault();
    if (disabled) return;
    submitBtnRef.removeAttribute("disabled");
    disabled = false;
    loadMoreBtn.classList.add("is-hidden");
    const { elements } = e.target;
    const { searchQuery } = elements;
    if (!searchQuery.value.trim()) {
        Notify.warning("line is empty");
        searchQuery.value = '';
        return
    };
    name = searchQuery.value.trim();
    page = 1;
    makeFetchResponse(name, page);
    searchQuery.value = '';
});

loadMoreBtn.classList.add("is-hidden");

async function makeFetchResponse(name, page) {
    try {
        const picture = await getImg(name, page, limit);
        const { totalHits, hits } = picture;
        if (!hits.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            loadMoreBtn.classList.add("is-hidden");
            galleryRef.innerHTML = '';
            return
        } else if (hits.length < limit && page === 1) {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            loadMoreBtn.classList.add("is-hidden");
            lightbox.refresh();
            galleryRef.innerHTML = '';
        } else if (hits.length < limit) {
            Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.classList.add("is-hidden");
        }
        else if (page === 1) {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            loadMoreBtn.classList.remove("is-hidden");
            lightbox.refresh();
            galleryRef.innerHTML = '';
        }
        else loadMoreBtn.classList.remove("is-hidden");
        renderMarkup(hits);
    } catch (error) {
        console.log(error);
    }
}