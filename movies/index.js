const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? URL_IMG = "images/pic1.jpg" : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie){
        return movie.Title;
    },

    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "60f55ded",
                s: searchTerm,
                // t: "The Avengers"
            },
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};

// from autocomplete.js
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('.left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('.left-summary'), 'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('.right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('.right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    // console.log(movie);
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "60f55ded",
            i: movie.imdbID,
            // t: "The Avengers"
        },
    });
    // console.log(response.data);
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side==='left'){
        leftMovie = response.data;
    }
    else{
        rightMovie = response.data;
    };
    // if(leftMovie && rightMovie){
    //     runComparison();
    // }
};

const runComparison = ()=>{
    const leftSideStats = document.querySelectorAll('.left-summary .notification');
    const rightSideStats = document.querySelectorAll('.right-summary .notification');

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats[index];

        const leftValue = parseInt(leftStat.dataset.value);
        const rightValue = parseInt(rightStat.dataset.value);

        console.log(leftValue, rightValue);

        if(rightValue > leftValue){
            rightStat.classList.add('is-success');
            leftStat.classList.add('is-danger')
        }
        // else if(rightValue === leftValue){
        //     rightStat.classList.add('is-info');
        //     leftStat.classList.add('is-info');
        // }
        else{
            leftStat.classList.add('is-success');
            rightStat.classList.add('is-danger');
        };
    });
};

const infoBtn = document.querySelector('#button-1');
infoBtn.addEventListener('click', runComparison);

// const clearBtn = document.querySelector('#clear');
// clearBtn.addEventListener('click', ()=>{
//     const left = document.querySelectorAll('.left-summary');
//     const right = document.querySelectorAll('.right-summary');
//     left.innerHTML = '';
//     right.innerHTML = '';
// });

const movieTemplate = (movieDetail) => {
    // Box-Office
    let dollars = movieDetail.BoxOffice;
    if(dollars === "N/A"){
        dollars = 0;
    }
    else{
        dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    };

    const metaScoresValue = parseInt(movieDetail.Metascore); // MetaScores
    const imdbRatingValue = parseFloat(movieDetail.imdbRating.replace(/,/g, '')); // imdbRatings
    const imdbVotesValue = parseInt(movieDetail.imdbVotes.replace(/,/g, '')); // imdbVotes

    const awards = movieDetail.Awards.split(' ').reduce((prev, curr) => {
        const value = parseInt(curr);
        if(isNaN(value)){
            return prev;
        }
        else{
            return prev + value;
        };
        
    }, 0);

    return `
        <div class='movie-info'>
            <article class='media'>
                <figure class='media-left'>
                    <p class='image'>
                        <img src="${movieDetail.Poster}" />
                    </p>
                </figure>
                <div class='media-content'>
                    <div class='content'>
                        <h1>${movieDetail.Title}</h1>
                        <h6>${movieDetail.Genre}</h6>
                        <p><em>${movieDetail.Plot}</em></p>
                    </div>
                </div>        
            </article>

            <article data-value=${awards} class='notification is-primary'>
                <p class='title'>${movieDetail.Awards}</p>
                <p class='subtitle'>Awards</p>
            </article>

            <article data-value=${dollars} class='notification is-primary'>
                <p class='title'>${movieDetail.BoxOffice}</p>
                <p class='subtitle'>Box-Office</p>
            </article>

            <article data-value=${metaScoresValue} class='notification is-primary'>
                <p class='title'>${movieDetail.Metascore}</p>
                <p class='subtitle'>Metascore</p>
            </article>

            <article data-value=${imdbRatingValue} class='notification is-primary'>
                <p class='title'>${movieDetail.imdbRating}</p>
                <p class='subtitle'>Imdb Rating</p>
            </article>
            
            <article data-value=${imdbVotesValue} class='notification is-primary'>
                <p class='title'>${movieDetail.imdbVotes}</p>
                <p class='subtitle'>IMDB Votes</p>
            </article>
        </div>
    `;
};