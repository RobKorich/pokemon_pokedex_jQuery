var pokemonRepository = (function () { /*IIFE start*/
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; /*pokemon list now loaded from external api*/
   
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
      var modalBody = $('.modal-body');
      var modalTitle = $('.modal-title');
      modalBody.empty();
      modalTitle.empty();
      
      var titleElement = $('<h1 id="pokemonName">' + pokemon.name + '</h1>');
      modalTitle.append(titleElement);
      
      var pictureElement = $('<img class="picture">');
      pictureElement.attr('src', pokemon.imageUrl);

      var heightElement = $('<p>' + 'Height: ' + pokemon.height + ' ft' + '</p>');
      
      var weightElement = $('<p>' + 'Weight: ' + pokemon.weight + ' lb' + '</p>');
      
      var types = [];
      var typeElement = $('<p></p>');
      $.each(pokemon.types, (i, type) => {
        types.push(type.type.name)
      });
      typeElement.text('Type: ' + types.join(', '));
      
      modalBody.append([
        pictureElement,
        heightElement,
        weightElement,
        typeElement,
      ]);
    }
    
    function addListItem(pokemon) {
        var pokedexList = $('.pokemon-list');
        var listItem = $('<button type= "button" class="btn btn-lg btn-primary rounded-pill list-group-item" data-toggle="modal" data-target="#exampleModal"></button>');
        listItem.text(pokemon.name);
        listItem.on('click', () => showDetails(pokemon));
        pokedexList.append(listItem);
    }

    /*only things visible outside of IIFE*/
    return {
        add,
        getAll,
        addListItem,
        loadList,
        loadDetails,
    }

})(); /*IIFE end*/

pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});

//Search bar
$(document).ready(function () {
  $('#myInput').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('.list-group-item').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
  })
})