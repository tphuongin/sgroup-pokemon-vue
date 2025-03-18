

<script setup>
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };
  
  import { defineProps } from 'vue';
  const { pokemon } = defineProps({
    pokemon: Object,
  });
  function capitalizeName(name){
    return name?.charAt(0).toUpperCase() + name?.slice(1);
  }
</script>


<template>
  <div class="pokemon-card">
    <div>
      #{{pokemon.id}}
    </div>
    <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    <div class="pokemon-name">{{ capitalizeName(pokemon.name) }}</div>
    <span class="pokemon-type">
      <span class="pokemon-type-card" v-for="pokemonType in pokemon.types" :key="typeColors.slot" :style="{backgroundColor: typeColors[pokemonType.type.name]}">{{ pokemonType.type.name }}</span>
    </span>
  </div>

</template>

<style scoped>
  .pokemon-card {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 15%;
    margin: 1.1%;
    background-color: rgb(245, 169, 202);
    border-radius: 10px;
    text-align: center;
    padding: 10px;
    transition: 0.3s;
    cursor: pointer;
  }
  .pokemon-card:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
  .pokemon-type-card {
    border-radius: 5px;
    font-weight: bold;
    padding: 4px;
  }
  .pokemon-type {
    display: flex;
    justify-content: center;
    gap: 4px;
  }
  .pokemon-name {
    font-weight: bold;
    font-size: larger;
}
</style> 
