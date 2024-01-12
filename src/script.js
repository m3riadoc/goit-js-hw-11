import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let currentPage = 1;
  let currentQuery = '';

  let lightbox = new SimpleLightbox('.gallery a', {});

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    currentQuery = event.target.elements.searchQuery.value;
    currentPage = 1;
    gallery.innerHTML = '';
    fetchImages(currentQuery, currentPage);
  });

  loadMoreBtn.addEventListener('click', function () {
    currentPage++;
    fetchImages(currentQuery, currentPage);
  });

  async function fetchImages(query, page) {
    const apiKey = '41785648-f43bb48e8e18549a52f9d9da0';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hits.length === 0) {
        alert(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

     data.hits.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';

    const link = document.createElement('a');
    link.href = image.largeImageURL;
    link.setAttribute('data-lightbox', 'gallery');
    link.className = 'image-link';

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    link.appendChild(img);

    const description = document.createElement('div');
    description.className = 'photo-description';

   
    const likes = document.createElement('p');
    likes.textContent = `Likes: ${image.likes}`;

    const views = document.createElement('p');
    views.textContent = `Views: ${image.views}`;

    const comments = document.createElement('p');
    comments.textContent = `Comments: ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.textContent = `Downloads: ${image.downloads}`;

    [likes, views, comments, downloads].forEach(item => description.appendChild(item));
   
    photoCard.appendChild(link);
    photoCard.appendChild(description);
    gallery.appendChild(photoCard);
});


      lightbox.refresh();

      loadMoreBtn.style.display = data.hits.length < 40 ? 'none' : 'block';
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }
});
