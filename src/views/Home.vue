<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import router from '@/router';

const searchPokemon = ref('');
const pokemonList = ref([]);
const filteredPokemon = ref([]);
const limit = ref(36);
const offset = ref(0);

async function fetchPokemon() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit.value}&offset=${offset.value}`
    );
    const data = await response.json();
    const details = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );
    pokemonList.value.push(...details);
    filteredPokemon.value = pokemonList.value; // Cập nhật danh sách hiển thị ban đầu
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchPokemon);

// Theo dõi searchPokemon và pokemonList, cập nhật ngay khi nhập
watchEffect(() => {
  if (searchPokemon.value.trim()) {
    filteredPokemon.value = pokemonList.value.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchPokemon.value.toLowerCase())
    );
  } else {
    filteredPokemon.value = pokemonList.value;
  }
});

const loadMore = () => {
  offset.value += limit.value;
  fetchPokemon();
};

const goTo = (pokemonName) => {
  router.push({ name: 'PokemonDetail', params: { name: pokemonName } });
};
</script>

<template>
  <div class="container">
    <h1 style="color: rgb(215, 95, 115)">POKEMON API</h1>
    <input
      type="text"
      v-model="searchPokemon"
      placeholder="Search some Pokemon"
      class="input"
    />
    <div class="container-pokemon">
      <PokemonCard
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @click="goTo(pokemon.name)"
      ></PokemonCard>
    </div>
    <button v-if="!searchPokemon" class="more-button" @click="loadMore">
      Load more
    </button>
    <p v-if="filteredPokemon.length === 0">
      No Pokemon match with
      <span style="font-weight: bold">{{ searchPokemon }}</span>
    </p>
  </div>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin: 0;
  padding: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.input {
  padding: 20px;
  border-radius: 30px;
  width: 30%;
  margin-bottom: 50px;
  border: 2px pink solid;
  text-align: left;
}
.container-pokemon {
  display: flex;
  flex-wrap: wrap;
  width: 96vw;
  overflow-x: hidden;
  margin: 10px;
}
.more-button {
  padding: 10px;
  width: 20%;
  margin: 30px auto;
  background-color: rgb(229, 128, 145);
  border-radius: 7px;
  cursor: pointer;
  font-size: larger;
}
</style>
