<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const pokemonName = route.params.name;

const pokemon = ref(null);
const pokemonDes = ref(null);
const pokemonEvo = ref(null);
const evolutionData = ref([]);
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
const stats = ["HP", "ATK", "DEF", "SPA", "SPD", "SPD"];

async function fetchPokemon() {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        const response = await fetch(url);
        pokemon.value = await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

async function fetchPokemonSpecies() {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
        const response = await fetch(url);
        pokemonDes.value = await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon species:", error);
    }
}

async function fetchPokemonEvolution() {
    try {
        if (!pokemonDes.value) return;

        const evolutionChainUrl = pokemonDes.value.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionChainUrl);
        const chain = await evolutionResponse.json();

        const evolutions = [];
        let currentEvolution = chain.chain;

        while (currentEvolution) {
            const name = currentEvolution.species.name;
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokemonData = await pokemonResponse.json();

            evolutions.push({
                name,
                image: pokemonData.sprites.front_default
            });

            currentEvolution = currentEvolution.evolves_to.length ? currentEvolution.evolves_to[0] : null;
        }

        evolutionData.value = evolutions;
    } catch (error) {
        console.error("Error fetching evolution data:", error);
    }
}

onMounted(async () => {
    await fetchPokemon();
    await fetchPokemonSpecies();
    await fetchPokemonEvolution();
});
function capitalizeName(name){
    return name?.charAt(0).toUpperCase() + name?.slice(1);
};
const goBack = () => {
    router.push('/');
    }
</script>

<template>
    <div class="container">
        <button class="btn-back" @click="goBack"> < Back </button>
        <img v-if="pokemon" :src="pokemon.sprites.front_default" :alt="pokemon.name" style="width:200px">
        <span class="pokemon-type" >
            <span class="pokemon-type-card" style="padding: 5px; margin: 0 3px; border-radius: 3px;" v-for="pokemonType in pokemon?.types" 
                :key="pokemonType.slot" 
                :style="{ backgroundColor: typeColors[pokemonType.type.name] }">
                {{ pokemonType.type.name }}
            </span>
        </span>
        <h2>{{ capitalizeName(pokemon?.name) }}</h2>
        <div>{{ pokemonDes?.flavor_text_entries?.[0]?.flavor_text }}</div>

        <div class="infor">
            <div>
                <h3>Height</h3>
                <span class="background-zone">{{ pokemon?.height }}</span>
            </div>
            <div>
                <h3>Weight</h3> 
                <span class="background-zone">{{ pokemon?.weight }}</span>
            </div>
        </div>

        <div>
            <h3 style="display: flex; justify-content: center; ">Abilities</h3>
            <div>
                <span class="pokemon-ability background-zone" v-for="pokemonAbility in pokemon?.abilities" 
                    :key="pokemonAbility.ability.name">
                    {{ pokemonAbility.ability.name }}
                </span>
            </div>
        </div>

        <div>
            <h3 style="text-align: center;">Stats</h3>
            <div class="stats-container">
                <div class="pokemon-stat" v-for="(pokemonStat, index) in pokemon?.stats" :key="pokemonStat.stat.name">
                    <span class="stat-name">{{ stats[index] }}</span>
                    <span class="stat-value">{{ pokemonStat.base_stat }}</span>
                </div>
            </div>
        </div>

        <div>
            <h3 style="text-align: center;">Evolution</h3>
            <div class="evolution-container">
                <div v-for="(evo, index) in evolutionData" :key="evo.name" class="evolution-item">
                    <p>{{ capitalizeName(evo.name) }}</p>
                    <img :src="evo.image" :alt="evo.name" width="120px">
                    <span v-if="index < evolutionData.length - 1" class="evolution-arrow"> > </span>
                </div>
            </div>
        </div>


    </div>
    
</template>

<style scoped>
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;        
        justify-content: center;
        margin: 50px;
        gap: 10px;
    }
    .btn-back{
        margin-right: auto;
        position: fixed;
        top: 30px;
        left: 70px;
        border: none;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 5px 5px 50px gray;
        background-color: aliceblue;
        cursor: pointer;
    }
    .infor{
        display: flex;
        gap: 100px;
    }
    .background-zone{
        background-color: rgb(244, 232, 217);
        padding: 7px;
        margin: 10px;
        border-radius: 10px;
    }

    .stats-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
    }

    .pokemon-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 20px;
        padding: 10px 15px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        font-weight: bold;
        min-width: 20px;
    }

    .stat-name {
        color: white;
        font-size: 14px;
        padding: 5px 10px;
        border-radius: 20px;
        text-transform: uppercase;
    }

    .stat-value {
        font-size: 16px;
        margin-top: 5px;
    }


    .pokemon-stat:nth-child(1) .stat-name { background-color: red; }     /* HP */
    .pokemon-stat:nth-child(2) .stat-name { background-color: orange; }  /* ATK */
    .pokemon-stat:nth-child(3) .stat-name { background-color: yellow; }  /* DEF */
    .pokemon-stat:nth-child(4) .stat-name { background-color: skyblue; } /* SPA */
    .pokemon-stat:nth-child(5) .stat-name { background-color: green; }   /* SPD */
    .pokemon-stat:nth-child(6) .stat-name { background-color: pink; }    /* SPD */

    .evolution-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-top: 10px;
    }

    .evolution-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
    }

    .evolution-arrow {
        font-size: 25px;
        font-weight: bold;
        position: absolute;
        top: 50%;
        right: -15px;
        transform: translateY(-50%);
    }
</style>