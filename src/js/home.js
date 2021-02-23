
(async function load() {

  // API url
  const BASE_API = 'https://yts.mx/api/v2/';

  // document elements
  const $actionContainer = document.querySelector('#action');
  const $dramaContainer = document.getElementById('drama');
  const $animationContainer = document.getElementById('animation');

  const $featuringContainer = document.getElementById('featuring');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle =  $modal.querySelector('h1');
  const $modalImage =  $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');
  
  // add attributes to a element
  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  // code to be executed when the user search for a movie
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');

    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    const movie = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
    const HTMLString = featuringTemplate(movie.data.movies[0]);
    $featuringContainer.innerHTML = HTMLString;

  })

  // event to be executed when the user click on a movie
  function showModal() {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
  }

  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards'
  }

  $hideModal.addEventListener('click', () => {
    hideModal();
  });

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal();
    })
  }

  // get the data of the api
  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
  }
  
  // create a template for the movies
  function videoItemTemplate(movie) {
    return (
      `<div class="primaryPlaylistItem"> 
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }

  // Generate template when a movie is found
  function featuringTemplate (movie) {
    return (
      `<div class="featuring">
        <div class="featuring-image">
          <img src="${movie.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${movie.title}</p>
        </div>
      </div>`
    )
  }

  // Generate the template with the data
  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  // Insert the templates in the DOM
  function renderMovieList(list, $container) {
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement)
    });
  }

  // create variables of list of movies based on genres
  const actionList =  await getData(`${BASE_API}list_movies.json?genre=action`);
  const dramaList = await getData(`${BASE_API}list_movies.json?genre=drama`);
  const animationList = await getData(`${BASE_API}list_movies.json?genre=animation`);

  renderMovieList(actionList.data.movies, $actionContainer);
  renderMovieList(dramaList.data.movies, $dramaContainer);
  renderMovieList(animationList.data.movies, $animationContainer);

})()

