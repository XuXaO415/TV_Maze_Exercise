/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
    //DONE TODO: Make an ajax request to the searchShows api.  Remove
    // hard coded data.
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
    console.log(res);
    let showInfo = res.data.map(q => {
        let show = q.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : null,
        };
    });

    return showInfo;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $('#shows-list');
    $showsList.empty();

    for (let show of shows) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
             <div class="card" data-show-id="${show.id}">
               <div class="card-body">
               <img class="card-img-top" src="#/path/to/image">
                 <h5 class="card-title">${show.name}</h5>
                 <p class="card-text">${show.summary}</p>
               </div>
             </div>
           </div>
          `
        );

        $showsList.append($item);
    }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
    evt.preventDefault();

    let query = $('#search-query').val();
    if (!query) return;

    $('#episodes-area').hide();

    let shows = await searchShows(query);

    populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
    // DONE -- I think?? TODO: get episodes from tvmaze
    //       you can get this by making GET request to
    //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    console.log(res.data);
    //DONE --?? TODO: return array-of-episode-info, as described in docstring above
    //using map to to transform and return a new array
    let episodeList = res.data.map(results => ({
        id: results.id,
        name: results.name,
        season: results.season,
        number: results.number,
    }));
    console.log(episodeList);
    return episodeList;
}

function populateEpisodes(episode) {
    let $eList = $('#episode-list');
    $eList.empty();

    for (let episode of episodes) {
        let $item = $(`
        <ul>
        <li>${episode.id}
        ${episode.name} (season ${episode.season}, episode${episode.number} )
        </li>
        </ul>
        `);
        $('#episode-area').show();
    }

    $(
        '#shows-list'
    ).on('click', '.get-episodes', async function handleEpisodeClick(evt) {
        let showId = $(evt.target).closest('.Show').data('show-id');
        let episodes = await getEpisodes(showId);
        populateEpisodes(episodes);
    });
}