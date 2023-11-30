import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokedexApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState({});

  useEffect(() => {
    // Fetch the list of Pokémon from the API
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151') // Limiting to the original 151 Pokémon for simplicity
      .then(response => {
        const results = response.data.results;
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
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredPokemon = pokemonList && pokemonList.filter(pokemon =>
  pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
 )
 .map(pokemon => pokemonDetails[pokemon.name])
 .filter(pokemon => pokemon); 

  return (
  
    
  
    <div>
    <p className="w-full bg-[rgb(79,128,187)] text-center p-3 rounded-tl-xl  font-medium text-2xl">Pokémon</p>
    <div className="search flex justify-center items-center pt-5"><input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={handleSearch}
        className="border-b-2 w-96 border-gray-200 py-3 px-7"
      />
    </div>
      
      
      <div className='flex flex-wrap justify-center items-center pt-5'>
        {filteredPokemon.map((pokemon, index) => ( <div key={index}> 
            <div className='relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-60'>
            <p className='text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900'>{pokemon.name.toUpperCase()}</p>
            <img className='relative mx-4 mt-6 overflow-hidden text-white rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40'
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
    </div>
    
    

    
    
  );
}

export default PokedexApp;
