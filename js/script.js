let moviesData = [];
const moviesContainer = document.getElementById("lista");

getJSONData(MOVIES_LIST_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
        moviesData = resultObj.data;
    }
});

// Mostrar las peliculas
function showMoviesData(moviesArray) {
    moviesContainer.innerHTML = "";
    for (const item of moviesArray) {
        moviesContainer.innerHTML += `<li class="row border border-light rounded pt-3 pb-1 mb-1">
                 <div class="col-9">
                     <h3>${item.title}</h3>
                     <p><em>${item.tagline}</em></p>
                 </div>
                 <div class="col-3 text-center">
                    ${drawStars(item.vote_average)}
                 </div>`
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
        } else if ((i - 0.5) <= rating /*&& i > rating*/) {
            ratingHTML += '<span class="fa fa-star half-checked"></span>';
        } else {
            ratingHTML += '<span class="fa fa-star not-checked"></span>';
        }
    }
    return ratingHTML;
}