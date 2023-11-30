import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const PokedexApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [indexOfLastCard, setIndexOfLastCard] = useState(50);
  const itemsPerPage = 50;


  const count=175;
  useEffect(() => {
    // Fetch the list of Pokémon from the API
    
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${count}`)
      .then(response => {
        const results = response.data.results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        setPokemonList(results);
        const promises = results.map(pokemon => axios.get(pokemon.url));
        return Promise.all(promises);
      })
      .then(details => {
        const detailsMap = details.reduce((map, response) => {
          const pokemon = response.data;
          map[pokemon.name] = {
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          };
          return map;
        }, {});
        setPokemonDetails(detailsMap);
      })
      .catch(error => {
        console.error('Error fetching Pokémon data:', error);
      });
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const allPokemon = pokemonList.flatMap(pokemon => pokemonDetails[pokemon.name] ? [pokemonDetails[pokemon.name]] : []);
  const filteredPokemon = allPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCards = allPokemon.length;
  
  // setIndexOfLastCard(indexOfLastCard);

  // const filteredPokemon = pokemonList && pokemonList.filter(pokemon =>
  //   pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  // ).map(pokemon => pokemonDetails[pokemon.name]).filter(pokemon => pokemon);

  // const totalCards = pokemonList.length;
  // const displayedCards = filteredPokemon.length;

  return (
    <div>
      <p className="w-full bg-[rgb(79,128,187)] text-center p-3 rounded-tl-xl  font-medium text-2xl">Pokémon</p>
      <div className="search flex justify-center items-center pt-5">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearch}
          className="border-b-2 w-96 border-gray-200 py-3 px-7"
        />
      </div>

      <div className='flex flex-wrap justify-center items-center pt-5'>
        {filteredPokemon.map((pokemon, index) => (
          <div key={index} className="hover:shadow-md cursor-pointer">
            <div className='relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-60 hover:shadow-lg'>
              <p className='text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900'>{pokemon.name.toUpperCase()}</p>
              <img
                className='relative mx-4 mt-6 overflow-hidden text-white rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40'
                src={pokemon.image}
                alt={`${pokemon.name.toUpperCase()}`}
                onError={(e) => {
                  // Handle image loading errors (e.g., image not found)
                  e.target.src = 'https://via.placeholder.com/60'; // Placeholder image
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center pt-5">
        <button
          className="bg-[rgb(79,128,187)] text-white py-2 px-4 rounded-full"
          onClick={() => {setCurrentPage(currentPage - 1);
            const newIndexOfLastCard = Math.max(itemsPerPage * (currentPage-1), totalCards);
            setIndexOfLastCard(newIndexOfLastCard);
          }}
          disabled={currentPage === 1}
          
        >
          Previous Page
        </button>
        <span className="mx-3">Page {currentPage}</span>
        <button
          className="bg-[rgb(79,128,187)] text-white py-2 px-4 rounded-full"
          onClick={() => {setCurrentPage(currentPage + 1);
            const newIndexOfLastCard = Math.min(itemsPerPage * (currentPage + 1), count);
            setIndexOfLastCard(newIndexOfLastCard);
          }}
          disabled={indexOfLastCard===count}
          
        >
          Next Page
        </button>
      </div>

      <div className="text-center mt-3 text-gray-500">
        Displaying {indexOfLastCard} of {count} Pokémons
      </div>
    </div>
  );
}

export default PokedexApp;
