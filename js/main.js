// What should happen on clicking the Search button to get a Pokemon
//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

// This is the function that gets the pokemon details on search
function getFetch(){
  const pokemon = document.querySelector('input').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`

  if(pokemon == ''){
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=180`
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data);
          // To clear the results upon each new search
          clearPrev();

          let pokeArr = data.results;
  
          // Randomize results gotten from fetch
          let newPokeArr = randomize(pokeArr);
          console.log(newPokeArr);
          // Iterate through the array and fetch pokemon for each name using the getPokemon function;
          newPokeArr.forEach((e) => getPokemon(e.name));

          // Wait for all pokemons to be generated then call the popup function to create and show popups
          setTimeout(() => {
            forPopup();
          }, 1000);
        })
        .catch(err => {
            console.log(`error ${err}`)
        });

  }else{
    fetch(url)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
            // To clear the results upon each new search
            clearPrev();

            // Call the createAndShowCard function to populate the DOM with the results;
            createAndShowCard(data);

            // Wait for all pokemons to be generated then call the popup function to create and show popups
            setTimeout(() => {
              forPopup();
            }, 1000);
          })
          .catch(err => {
              console.log(`error ${err}`)
          });
  }  

  const cards = document.querySelectorAll('.pokemon-card');
  console.log(cards);
}

// This is to clear out the DOM upon each new search or on page refresh
function clearPrev(){
  const cards = document.querySelectorAll('.pokemon-card');
  if(cards){
    cards.forEach(e => e.remove());
  }
}

function randomize(pokeArr){
  let chance = Math.random();
  if(chance < 0.2) newPokeArr = pokeArr.slice(143, -1);
  else if(chance < 0.4) newPokeArr = pokeArr.slice(36, 72);
  else if(chance < 0.6) newPokeArr = pokeArr.slice(108, 144);
  else if(chance < 0.8) newPokeArr = pokeArr.slice(0, 36);
  else newPokeArr = pokeArr.slice(72, 108);

  return newPokeArr;
}

// This function is to get each random pokemons
function getPokemon(pokemonName){
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // Call the createAndShowCard function to populate the DOM with the results;
        createAndShowCard(data);
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function createAndShowCard(data){
  // Get the parent container to house the cards --- Card container
  const cardsContainer = document.querySelector('.cards-container');

  // Create the div for the card and add a class name to it;
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('pokemon-card');

  // Create each content of the card and attach a class name to them as well;
  const pokeImg = document.createElement('img');
  pokeImg.classList.add('pokemon-img');
  const imgSrc = data.sprites.other['official-artwork']['front_default'];
  pokeImg.src = imgSrc;

  const pokeName = document.createElement('h3');
  pokeName.textContent = data.name;

  // This one is to house the pokemon types within the card;
  const typeDiv = document.createElement('div');
  typeDiv.classList.add('pokemon-types');

  const ul = document.createElement('ul');
  // There should be a function to iterate through the types and append to the DOM;
    function getTypes(){
      const types = data.types;
      types.forEach((e => {
        const li = document.createElement('li');
        li.classList.add('type');
        li.textContent = e.type.name;

        // Append the type to the ul;
        ul.appendChild(li);
      }))
    }
    getTypes();

  // Appending the child elements to their respective parents;
  // First, the ul to the typeDiv;
  typeDiv.appendChild(ul);
  // Next, the pokeImg, pokeName and typeDiv to the cardDiv;
  cardDiv.appendChild(pokeImg);
  cardDiv.appendChild(pokeName);
  cardDiv.appendChild(typeDiv);
  // Finally, the cardDiv to the cardsContainer;
  cardsContainer.appendChild(cardDiv);
}

function forPopup(){
  // Add an event listener to each card that is created for showing the popup
  const cards = document.querySelectorAll('.pokemon-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      let chosenName = card.children[1].textContent;
      const url = `https://pokeapi.co/api/v2/pokemon/${chosenName}`
  
      fetch(url)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            // Call the showPopup function to create popup
            showPopup(data);
          })
          .catch(err => {
              console.log(`error ${err}`)
          });
      
      document.querySelector('.overlay').classList.add('is-active');
      document.querySelector('.pokemon-details-popup').classList.add('is-active');
      const closeBtn = document.querySelector('.close-btn');
      closeBtn.classList.remove('hide-close-btn');

      setTimeout(() => {
        const popupContainer = document.querySelector('.pokemon-details-popup');
        const overallContainer = document.querySelector('.details-overall-container');
        console.log(overallContainer)
        closeBtn.addEventListener('click', closePopup);

        function closePopup(){
          document.querySelector('.overlay').classList.remove('is-active');
          if(overallContainer) overallContainer.remove();

          popupContainer.classList.remove('is-active');
          closeBtn.classList.add('hide-close-btn');
        }
      }, 1000)
    })
  })
}

// /This is the showPopup function to show a card with more details about the selected pokemon
function showPopup(data){
  // Popup container
  const popupDiv = document.querySelector('.pokemon-details-popup');

  //Create container for all content
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('details-overall-container');

  // Create the h3 for the Pokemon name;
  const h3PokeName = document.createElement('h3');
  h3PokeName.textContent = data.name;

  // Create container to host all details of the selected pokemon
  const pokeDetailsContainer = document.createElement('div');
  pokeDetailsContainer.classList.add('pokemon-details-container');

  // Create the first div sub-container of the popup and add class name;
  const subDiv1 = document.createElement('div');
  subDiv1.classList.add('pokemon-img-and-type');

  // Create the child elements of the first div and add class names;
  const popupImg = document.createElement('img');
  const imgSrc = data.sprites['other']['official-artwork']['front_default'];
  popupImg.src = imgSrc;

  const popupTypeDiv = document.createElement('div');
  popupTypeDiv.classList.add('pokemon-types');

  const popupTypesUl = document.createElement('ul');
  // A function to iterate through the types and append to the DOM;
    function getPokeTypes(){
      const popupTypes = data.types;
      popupTypes.forEach((e => {
        const li = document.createElement('li');
        li.classList.add('type');
        li.textContent = e.type.name;

        // Append the type to the ul;
        popupTypesUl.appendChild(li);
      }))
    }
    getPokeTypes();
    popupTypeDiv.appendChild(popupTypesUl);//appending types to the types div

  // Append all children of subDiv1 appropraitely;
  subDiv1.appendChild(popupImg);
  subDiv1.appendChild(popupTypeDiv);

  
  // Create the second div sub-container of the popup and add class name;
  const subDiv2 = document.createElement('div');
  subDiv2.classList.add('pokemon-other-details');

  // Create the child elements of subDiv2 and attach class names as required
  const statsDiv = document.createElement('div');
  statsDiv.classList.add('pokemon-stats');
    /***These are the child elements for the pokemon stats div***/
    const statsH4 = document.createElement('h4');
    statsH4.textContent = 'Stats';

    const statsUl = document.createElement('ul');
      // A function to get the stats and append to the ul;
      function getStats(){
        const pokeStats = data.stats.filter((e,i) => i != 3 && i != 4 );
        pokeStats.forEach(e => {
          const li = document.createElement('li');
          li.classList.add('stat');
          li.textContent = `${e.stat.name.toUpperCase()}: ${e['base_stat']}`;

          // Append stat to the ul
          statsUl.appendChild(li);
        })
      }
      getStats();
    
    // Append child elements of statsDiv
    statsDiv.appendChild(statsH4);
    statsDiv.appendChild(statsUl);

  const ableDiv = document.createElement('div');
  ableDiv.classList.add('pokemon-abilities');
    /***These are the child elements for the pokemon abilities div***/
    const ableH4 = document.createElement('h4');
    ableH4.textContent = 'Abilities';

    const ableUl = document.createElement('ul');
      // A function to get the stats and append to the ul;
      function getAbility(){
        const pokeAble = data.abilities;
        pokeAble.forEach(e => {
          const li = document.createElement('li');
          li.classList.add('ability');
          li.textContent = e.ability.name;

          // Append stat to the ul
          ableUl.appendChild(li);
        })
      }
      getAbility();
    
    // Append child elements of ableDiv
    ableDiv.appendChild(ableH4);
    ableDiv.appendChild(ableUl);

  const whDiv = document.createElement('div');
  whDiv.classList.add('pokemon-weight-height');
      /*** These are the child elements for the weight-height div ***/
      const p1 = document.createElement('p');
      p1.textContent = `Weight: ${data.weight/10}kg`
      const p2 = document.createElement('p');
      p2.textContent = `Height: ${data.height*10}cm`

      // Append child elements to the whDiv
      whDiv.appendChild(p1);
      whDiv.appendChild(p2);

  // Append all child elements of subDiv2 to itself
  subDiv2.appendChild(statsDiv);
  subDiv2.appendChild(ableDiv);
  subDiv2.appendChild(whDiv);

  // Next, append both subDivs to the pokemon details contianer
  pokeDetailsContainer.appendChild(subDiv1);
  pokeDetailsContainer.appendChild(subDiv2);

  // Next, append the pokemon name and pokemon details container to the popup div
  detailsContainer.appendChild(h3PokeName);
  detailsContainer.appendChild(pokeDetailsContainer);

  // Finally, append the details container to the popup div
  popupDiv.appendChild(detailsContainer);
}