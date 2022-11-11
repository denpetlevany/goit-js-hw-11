let lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 250, captionsData: 'alt', });
const galleryRef = document.querySelector('.gallery');
function renderMarkup(hits) {
    const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                    <a href="${largeImageURL}">
                    <img class="img-preview" src="${webformatURL}" alt="${tags}" loading="lazy" /> 
                    </a>
                    <div class="info">
                        <p class="info-item">
                        <b>Likes <span>${likes}</span> </b>
                        </p>
                        <p class="info-item">
                        <b>Views <span>${views}</span></b>
                        </p>
                        <p class="info-item">
                        <b>Comments <span>${comments}</span></b>
                        </p>
                        <p class="info-item">
                        <b>Downloads <span>${downloads}</span></b>
                        </p>
                    </div>
                </div>`
    }
    ).join("");
    galleryRef.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
};
export {renderMarkup}