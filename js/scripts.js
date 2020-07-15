var pokemonRepository = (function () { /*IIFE start*/
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; /*pokemon list now loaded from external api*/
        /*{
            name: 'Charmander',
            height: 2, 
            type: ['fire']
        },
        {
            name: 'Pikachu', 
            height: 1, 
            type: ['electric']
        },
        {
            name: 'Squirtle', 
            height: 1.5, 
            type: ['water']
        }
    ];*/

    function loadList() { 
        return fetch(apiUrl).then(function (response) { /*fetch function used on apiUrl var to get pokemon list / start promise for async*/
          return response.json(); // returns response and then takes that and converts it to json format from string
        }).then(function (json) { 
          json.results.forEach(function (item) { //explain what this line is doing please... I know it is loop start but do not get json.results and what that is
            var pokemon = { // sets pokemon variable to be an object with name and detailsUrl
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon); // normalize the response and store it in the pokemonList array
          });
        }).catch(function (e) { //promise catch for error response
          console.error(e);
        })
      }

    function loadDetails(pokemon) {
        var url = pokemon.detailsUrl;
        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (details) {
          //Now we add the details to the pokemon
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = details.types;
          pokemon.weight = details.weight;
        }).catch(function (e) {
          console.error(e);
        });
      }

    /* how to add a pokemon
    console.log(pokemonRepository.getAll());

    pokemonRepository.add({
        name: 'Bulbasaur',
        height: 1,
        type: ['poison']
    });

    console.log(pokemonRepository.getAll());
    */

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function showDetails(pokemon) { //function that is called when pokemon button is clicked on
      loadDetails(pokemon).then(function () {
          showModal(pokemon);
        });
    }

    function showModal(pokemon) { 
      var modalContainer = document.querySelector('#modal-container'); // select modal container from div id in html

      modalContainer.innerHTML = ''; // clear modal

      var modal = document.createElement('div'); // create div element and assign it modal class
      modal.classList.add('modal');

      var closeButtonElement = document.createElement('button'); // create button element and assign it modal-close class
      closeButtonElement.classList.add('modal-close');
      closeButtonElement.innerText = 'Close';
      closeButtonElement.addEventListener('click', hideModal); //add event listener to Close button to run hideModal function on click
      
      var titleElement = document.createElement('h1'); // create h1 element for title
      titleElement.innerText = pokemon.name; // set title text to be title(pokemon.name)

      var contentElement = document.createElement('p'); //create p element for Heigh info
      contentElement.innerText = 'Height: ' + pokemon.height; // set pokemon heigh info

      var weightElement = document.createElement('p');
      weightElement.innerText = 'Weight: ' + pokemon.weight;

      var pictureElement = document.createElement('img'); //create img element for pokemon image
      pictureElement.setAttribute('src', pokemon.imageUrl); //set img source as imageUrl 

      //add created elements
      modal.appendChild(closeButtonElement);
      modal.appendChild(titleElement);
      modal.appendChild(contentElement);
      modal.appendChild(weightElement);
      modal.appendChild(pictureElement);
      modalContainer.appendChild(modal);
      //add is-visible class to modalContainer so you can have a hidden/not hidden version in css
      modalContainer.classList.add('is-visible');
    }
    
    function hideModal() {
      var modalContainer = document.querySelector('#modal-container');
      modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
      var modalContainer = document.querySelector('#modal-container');
      if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
      modalContainer.addEventListener('click', (e) => {
        var target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      })
    });

    function addListItem(pokemon) {
        var pokedexList = document.querySelector('.pokemon-list'); /*selects <ul> in HTML and assigns it as the pokedexList variable*/
        var listItem = document.createElement('li'); /*creates the <li> element and assigns it as the listItem variable*/
        var button = document.createElement('button'); /* creates a <button> element and assings it as the button variable*/
        button.innerText = pokemon.name; /*?? got it to work but why is it pokemon and not pokemonList again*/
        button.classList.add('pokedexButton'); /*adds a class name 'pokedexButton' to button so it can be edited in css*/
        button.addEventListener('click', () => showDetails(pokemon)); /*wrap showDetails function in another function so it isn't called immediately when code runs but when click event executes*/
        listItem.appendChild(button); /*states parent element then adds child button*/
        pokedexList.appendChild(listItem);/*states parent element then adds child listItem*/
    }

    /*only things visible outside of IIFE*/
    return {
        add,
        getAll,
        addListItem,
        loadList,
        loadDetails
    }

})(); /*IIFE end*/

pokemonRepository.loadList().then(function() { /*new code to review*/
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});

/*document.write('<p>' + pokemon.name + ' (height: ' + pokemon.height + ')')
if (pokemon.height > 1) {
    document.write(' - Wow, thats\'s big!')
}
document.write('</p>')*/

/* reference code for later (old version)

for (var i = 0; i < pokemonList.length; i++) {
    var className = 'otherPokemon'
    if (pokemonList[i].name === 'Charmander') {
        className = 'pokemon'
    }
    document.write('<p class="'+ className +'">' + pokemonList[i].name + ' (height: ' + pokemonList[i].height + ')')
    if (pokemonList[i].height > 1) {
        document.write(' - Wow, that\'s big!')
    }
    document.write('</p>')
}
*/