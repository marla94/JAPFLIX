let moviesData = [];

getJSONData(MOVIES_LIST_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
        moviesData = resultObj.data;
    }
});

// Mostrar las peliculas
const moviesContainer = document.getElementById("lista");

function showMoviesData(moviesArray) {
    moviesContainer.innerHTML = "";
    for (let item of moviesArray) {
        let list = document.createElement('li');
        list.className = "row border border-light rounded p-2 mb-1";
        list.setAttribute("data-bs-toggle", "offcanvas");
        list.setAttribute("data-bs-target", "#offcanvasTop");
        list.setAttribute("aria-controls", "offcanvasTop");
        list.style.cursor = "pointer";
        list.innerHTML = `
                <div class="col-9">
                     <h4>${item.title}</h4>
                     <p class="text-secondary"><em>${item.tagline}</em></p>
                </div>
                <div class="col-3 text-center my-auto">
                    ${drawStars(item.vote_average)}
                </div>`
        list.onclick = () => {
            showDetails(item);
        } 
        moviesContainer.appendChild(list);
    }
}

function clearMoviesData() {
    moviesContainer.innerHTML = "";
}

// Buscar en la lista
function searchMovies(moviesArray, searchQuery) {
    let query = normalizeText(searchQuery);

    let filteredMovies = moviesArray.filter(
        (movie) => {
            let movieTitle = normalizeText(movie.title);
            let genreString = movie.genres.map(x => x.name).join(', ');
            let movieGenre = normalizeText(genreString);
            let movieTagline = normalizeText(movie.tagline);
            let movieOverview = normalizeText(movie.overview);

            return movieTitle.includes(query) || movieGenre.includes(query) || movieTagline.includes(query) || movieOverview.includes(query)
        }
    )
    showMoviesData(filteredMovies);
}

// Normalizar los textos
function normalizeText(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
}

// Evento buscar
const searchButton = document.getElementById("btnBuscar");

searchButton.addEventListener('click', () => {
    const searchValue = document.getElementById("inputBuscar").value;
    if (searchValue == "") {
        clearMoviesData()
    } else {
        searchMovies(moviesData, searchValue);
    }
})

// Función para mostrar estrellas en lugar de números
function drawStars(rating) {
    let ratingHTML = ""
    for (let i = 1; i <= 10; i++) {
        if (i <= rating) {
            ratingHTML += '<span class="fa fa-star checked"></span>';
        } else if ((i - 0.5) <= rating) {
            ratingHTML += '<span class="fa fa-star half-checked"></span>';
        } else {
            ratingHTML += '<span class="fa fa-star not-checked"></span>';
        }
    }
    return ratingHTML;
}

// Funcion para mostrar información adicional de la pelicula
function showDetails(movie){
    document.getElementById('offcanvasTopLabel').textContent = movie.title;
    document.getElementById('offcanvas-body-main').textContent = movie.overview;
    let genresList = document.getElementById('offcanvas-body-footer');
    let genresText = movie.genres.map(genre => genre.name).join(' - '); 
    genresList.textContent = genresText; 
    let offcanvasFooter = document.querySelector('#offcanvas-body-footer');
    let dropdownMenu = `
    <div class="dropdown-center text-end">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      More
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item">Year: ${new Date(movie.release_date).getFullYear()}</li>
      <li class="dropdown-item">Runtime: ${movie.runtime} mins</li>
      <li class="dropdown-item">Budget: $${movie.budget.toLocaleString()}</li>
      <li class="dropdown-item">Revenue: $${movie.revenue.toLocaleString()}</li>
    </ul>
  </div>
     `;
    offcanvasFooter.innerHTML += dropdownMenu;
}