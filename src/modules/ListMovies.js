import API from './api.js';
import displayLikes from './displayLike.js';
import { movieApi } from './env.js';
import lazyLoadImages from './lazyLoadImage.js';
import LIKES from './Likes.js';

const createElement = (obj) => {
  const el = document.createElement(obj.tag);
  if (obj.className) el.className = obj.className;
  if (obj.tag === 'img') {
    el.classList.add('lazy');
    el.setAttribute('data-src', obj.src);
    el.alt = 'Lazy-loaded image';
  }
  return el;
};

const createTextNode = (tag, text) => {
  const textNode = document.createTextNode(text);
  tag.appendChild(textNode);
  return tag;
};

const createMovies = (movieDetails, likesArray) => {
  const movie = createElement({ tag: 'div', className: 'movie' });
  movie.setAttribute('id-movie', movieDetails.id);
  // Create Div with class image-container
  const imageContainer = createElement({
    tag: 'div',
    className: 'image-container',
  });
  const img = createElement({
    tag: 'img',
    className: 'image',
    src: movieDetails.image.medium,
  });
  imageContainer.appendChild(img);
  movie.appendChild(imageContainer);

  // create Div with Movie Body
  const movieBody = createElement({
    tag: 'div',
    className: 'd-flex flex-d-column movies-body',
  });
  // create div with Movie-title
  const movieTitle = createElement({
    tag: 'div',
    className:
      'd-flex align-items-center justify-content-space-between movies-title',
  });
  const h2 = createElement({ tag: 'h1' });
  createTextNode(h2, movieDetails.name);
  const iconHeart = createElement({
    tag: 'i',
    className: 'fa-regular fa-heart',
  });
  movieTitle.appendChild(h2);
  movieTitle.appendChild(iconHeart);
  movieBody.appendChild(movieTitle);

  // create div with class likes
  const likes = createElement({
    tag: 'div',
    className: 'd-flex justify-content-end likes',
  });
  const spanLikes = createElement({
    tag: 'span',
  });
  const likeText = displayLikes(likesArray, movieDetails.id);
  const likeCount = likeText.length !== 0 ? likeText : 0;
  createTextNode(spanLikes, `${likeCount} likes`);
  likes.appendChild(spanLikes);
  movieBody.appendChild(likes);
  // create div with class Group buttons
  const groupBtns = createElement({
    tag: 'div',
    className: 'd-flex flex-d-column align-items-center group-btns',
  });
  const commentDiv = createElement({
    tag: 'div',
    className: 'comment',
  });
  const commentButton = createElement({
    tag: 'button',
    className: 'btn btn-comment',
  });
  createTextNode(commentButton, 'comment');
  commentDiv.appendChild(commentButton);
  groupBtns.appendChild(commentDiv);

  const reservationDiv = createElement({
    tag: 'div',
    className: 'reservation',
  });
  const reservationButton = createElement({
    tag: 'button',
    className: 'btn btn-reservation',
  });
  createTextNode(reservationButton, 'reservation');

  reservationDiv.appendChild(reservationButton);
  groupBtns.appendChild(reservationDiv);

  movieBody.appendChild(groupBtns);
  movie.appendChild(movieBody);

  return movie;
};

const CommentPopup = (event) => {
  const commentButton = event.target;
  const movie = commentButton.closest('.movie');
  const movieId = movie.getAttribute('id-movie');
  // Perform the desired action when the comment button is clicked
  const api = new API('https://api.tvmaze.com/shows');
  let currentPopup = null;
  if (currentPopup) {
    currentPopup.classList.add('d-none');
  }
  api.displayShow(parseInt(movieId, 10)).then((popupDiv) => {
    currentPopup = popupDiv;
  });
};

const displayMovies = async () => {
  const moviesList = document.querySelector('.movies-item');

  if (moviesList) {
    const spinner = document.querySelector('.movies-contient .spinner');
    spinner.style.display = 'block';
    const api = new API(movieApi);
    const movies = await api.getData('shows');
    moviesList.style.display = 'none';
    const Likes = new LIKES();
    const likesArray = await Likes.getlikes();

    movies.forEach(async (movie) => {
      const movieElement = createMovies(movie, likesArray);
      const commentButton = movieElement.querySelector('.btn-comment');
      commentButton.addEventListener('click', CommentPopup);
      moviesList.appendChild(movieElement);
    });
    lazyLoadImages();
    spinner.style.display = 'none';
    moviesList.style.display = 'flex';
  }
};

window.onload = displayMovies;
