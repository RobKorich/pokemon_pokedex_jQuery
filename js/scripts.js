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
      return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
        responseJSON.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }).catch(function (e) {
        console.error(e);
      });
    };

    //function loadList() { 
        //return fetch(apiUrl).then(function (response) { /*fetch function used on apiUrl var to get pokemon list / start promise for async*/
          //return response.json(); // returns response and then takes that and converts it to json format from string
        //}).then(function (json) { 
          //json.results.forEach(function (item) { //explain what this line is doing please... I know it is loop start but do not get json.results and what that is
            //var pokemon = { // sets pokemon variable to be an object with name and detailsUrl
              //name: item.name,
              //detailsUrl: item.url
            //};
            //add(pokemon); // normalize the response and store it in the pokemonList array
          //});
        //}).catch(function (e) { //promise catch for error response
          //console.error(e);
        //})
      //}

      function loadDetails(pokemon) {
        var url = pokemon.detailsUrl;
        return $.ajax(url, {dataType: 'json'})
        .then(function (details) {
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = details.types;
          pokemon.weight = details.weight;
        }).catch(function (e) {
          console.error(e);
        });
      }

    //function loadDetails(pokemon) {
        //var url = pokemon.detailsUrl;
        //return fetch(url).then(function (response) {
          //return response.json();
        //}).then(function (details) {
          //Now we add the details to the pokemon
          //pokemon.imageUrl = details.sprites.front_default;
          //pokemon.height = details.height;
          //pokemon.types = details.types;
          //pokemon.weight = details.weight;
        //}).catch(function (e) {
          //console.error(e);
        //});
      //}

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
      //var modalContainer = $('#modal-container');
      //modalContainer.addClass('is-visible');

      //modalContainer.empty(); // clear modal

      //var modal = $('<div class="modal"></div>');

      //var closeButtonElement = $('<button class="modal-close">Close</button>');
      //closeButtonElement.on('click', hideModal);
      var modalBody = $('.modal-body');
      modalBody.empty();
    
      var titleElement = $('<h1>' + pokemon.name + '</h1>');
      //titleElement.text(pokemon.name);

      var pictureElement = $('<img class="picture">');
      pictureElement.attr('src', pokemon.imageUrl);

      var heightElement = $('<p>' + 'Height: ' + pokemon.height + 'ft' + '</p>');
      //heightElement.text('Height: ' + pokemon.height);
     
      var weightElement = $('<p>' + 'Weight: ' + pokemon.weight + 'lb' + '</p>');
      //weightElement.text('Weight: ' + pokemon.weight);
    
      var types = [];
      var typeElement = $('<p></p>');
      $.each(pokemon.types, (i, type) => {
        types.push(type.type.name)
      });
      typeElement.text('Type: ' + types.join(', '));
      
      modalBody.append([
        //closeButtonElement,
        titleElement,
        pictureElement,
        heightElement,
        weightElement,
        typeElement,
      ]);
      //modalContainer.append(modalBody);
    }
    
    /*function hideModal() {
      var modalContainer = $('#modal-container');
      modalContainer.removeClass('is-visible');
    }

    $(window).on('keydown', (e) => {
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
    });*/

    function addListItem(pokemon) {
        var pokedexList = $('.pokemon-list');
        var listItem = $('<li></li>');
        var button = $('<button class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal"></button>');
        button.text(pokemon.name);
        button.on('click', () => showDetails(pokemon));
        listItem.append(button);
        pokedexList.append(listItem);
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
