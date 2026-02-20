<template>
  <main class="min-h-screen bg-stone-950 text-stone-100 py-6 sm:py-8 px-4 font-sans selection:bg-amber-500/30">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 bg-stone-900/50 p-3 sm:p-4 rounded-2xl border border-stone-800/50">
        <label class="flex items-center space-x-2 cursor-pointer text-xs text-stone-400 hover:text-amber-500 transition-colors w-full sm:w-auto justify-center sm:justify-start">
          <input type="checkbox" v-model="showDetailedRanking" class="accent-amber-500 w-4 h-4">
          <span class="font-bold uppercase tracking-wider">Ranking Detalhado</span>
        </label>
        
        <button @click="shareStateUrl" 
                class="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-3 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <span>{{ shareStatus }}</span>
        </button>
      </div>

      <header class="text-center space-y-2">
        <h1 class="text-5xl sm:text-6xl font-black text-amber-500 tracking-tighter uppercase italic drop-shadow-md">Smart Drink</h1>
        <p class="text-stone-400 font-medium text-sm sm:text-base">O duelo definitivo entre marcas, unidades e packs.</p>
      </header>

      <section v-if="!showDetailedRanking && globalRanking.length > 0" class="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 shadow-2xl">
        <h2 class="text-center text-xs font-black text-amber-500 uppercase tracking-widest mb-6 italic">🏆 Melhor Custo-Benefício de Cada Marca</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(res, idx) in globalRanking" :key="res.brandName" 
               class="p-4 rounded-2xl border transition-all bg-stone-900 border-stone-800"
               :class="{ 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]': res.isBestValue }">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-black uppercase tracking-tighter" :class="res.isBestValue ? 'text-amber-500' : 'text-stone-500'">{{ idx + 1 }}º Lugar</span>
              <span v-if="res.isBestValue" class="text-[10px] bg-stone-950 text-amber-500 px-2 py-0.5 rounded-full font-bold">ECONOMIA REAL</span>
            </div>
            <h3 class="text-xl font-black mt-1 text-white">{{ res.brandName }}</h3>
            <p class="text-xs text-stone-400">
              {{ res.measureName }} 
              <span class="font-bold text-stone-300">
                ({{ res.quantity > 1 ? `${res.quantity}x ` : '' }}{{ res.volumeMl }}ml)
              </span> 
              por R$ {{ res.price.toFixed(2) }}
            </p>
            <div class="mt-4 pt-4 border-t border-stone-800">
              <p class="text-sm font-bold text-stone-200">R$ {{ res.pricePerLiter.toFixed(2) }} / Litro</p>
              <p v-if="!res.isBestValue" class="text-[10px] font-bold text-red-400">+{{ res.savingsPercentage.toFixed(1) }}% mais caro</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="showDetailedRanking" class="space-y-6">
        <div v-for="measure in globalMeasures" :key="measure.id" class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div class="bg-stone-950/80 px-4 py-2 border-b border-stone-800 flex justify-between items-center">
            <h3 class="text-sm font-black text-amber-500 uppercase tracking-widest">
              {{ measure.name }} 
              <span class="text-stone-500 font-normal">({{ measure.quantity > 1 ? `${measure.quantity}x ` : '' }}{{ measure.volumeMl }}ml)</span>
            </h3>
          </div>
          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="res in getMeasureRanking(measure)" :key="res.brandName" 
                 class="p-3 rounded-xl border flex flex-col justify-between"
                 :class="res.isBestValue ? 'bg-amber-500/10 border-amber-500/50' : (res.hasPrice ? 'bg-stone-950/50 border-stone-800' : 'bg-stone-950/20 border-stone-900 opacity-50')">
              
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-sm text-stone-200">{{ res.brandName }}</span>
                <span v-if="res.isBestValue" class="text-[9px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded-sm font-black">VENCEDOR</span>
              </div>
              
              <div v-if="res.hasPrice">
                <p class="text-lg font-black text-amber-400">R$ {{ res.price.toFixed(2) }}</p>
                <p class="text-[10px] text-stone-500 mt-1">R$ {{ res.pricePerLiter.toFixed(2) }} / L</p>
                <p v-if="!res.isBestValue" class="text-[10px] text-red-400 mt-0.5">+{{ res.savingsPercentage.toFixed(1) }}%</p>
              </div>
              <div v-else class="py-2">
                <p class="text-[10px] text-stone-600 uppercase font-bold italic">Sem valor definido</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div class="flex overflow-x-auto bg-stone-950/50 border-b border-stone-800 scrollbar-hide">
          <button v-for="brand in brands" :key="brand.id"
                  @click="activeBrandId = brand.id"
                  class="px-6 py-4 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-3 border-b-2"
                  :class="activeBrandId === brand.id ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-transparent text-stone-500 hover:text-stone-300'">
            <input type="checkbox" v-model="brand.isActive" @change="updateGlobal" class="accent-amber-500">
            {{ brand.name }}
          </button>
          <button @click="addBrand" class="px-6 py-4 text-amber-500/50 hover:text-amber-500 text-sm font-bold">+ Nova Marca</button>
        </div>

        <div class="p-6">
          <div v-if="activeBrandIndex !== -1" class="space-y-6">
            <div class="flex justify-between items-center">
              <input v-model="brands[activeBrandIndex]!.name" class="bg-transparent text-2xl font-black text-white focus:outline-none border-b border-stone-800 focus:border-amber-500">
              <button @click="removeBrand(brands[activeBrandIndex]!.id)" class="text-xs text-red-500/50 hover:text-red-500 uppercase font-bold">Excluir Marca</button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="measure in globalMeasures" :key="measure.id" class="bg-stone-950/50 p-3 rounded-xl border border-stone-800 relative">
                <div v-if="measure.quantity > 1" class="absolute -top-2 -right-2 bg-amber-500 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded-full">
                  PACK
                </div>
                <p class="text-[10px] font-bold text-stone-400 uppercase leading-tight mb-2">
                  {{ measure.name }} <br>
                  <span class="text-stone-600 font-normal">({{ measure.quantity > 1 ? `${measure.quantity}x ` : '' }}{{ measure.volumeMl }}ml)</span>
                </p>
                <label class="text-[9px] text-stone-500 block">Preço R$</label>
                <input v-model.number="brands[activeBrandIndex]!.prices[measure.id]" type="number" step="0.01" @input="updateGlobal" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-amber-500 focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-stone-800/50">
              <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Adicionar Novo Recipiente ou Pack</p>
              <div class="flex flex-wrap gap-3">
                <input v-model="newMeasureName" type="text" placeholder="Nome (Ex: Pack Lata)" class="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 w-40">
                <input v-model.number="newMeasureMl" type="number" placeholder="Volume (ml)" class="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 w-28">
                <input v-model.number="newMeasureQty" type="number" placeholder="Qtd" class="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 w-20">
                <button @click="addGlobalMeasure" class="bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Adicionar</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { DrinkCalculator, type Brand, type Measure, type ComparisonResult } from './domain/DrinkCalculator';
import SiteFooter from './components/SiteFooter.vue';

const globalMeasures = ref<Measure[]>([
    { id: 'm1', name: 'Lata', volumeMl: 350, quantity: 1 },
    { id: 'm2', name: 'Pack Lata 12', volumeMl: 350, quantity: 12 },
    { id: 'm3', name: 'Latão', volumeMl: 473, quantity: 1 },
    { id: 'm4', name: 'Long Neck', volumeMl: 330, quantity: 1 },
    { id: 'm5', name: 'Garrafa', volumeMl: 600, quantity: 1 }
]);

const newMeasureName = ref('');
const newMeasureMl = ref<number | null>(null);
const newMeasureQty = ref<number | null>(1);

const brands = ref<Brand[]>([
    { id: 'b1', name: 'Heineken', isActive: true, prices: {} },
    { id: 'b2', name: 'Budweiser', isActive: true, prices: {} },
    { id: 'b3', name: 'Corona', isActive: true, prices: {} }
]);

const activeBrandId = ref('b1');
const showDetailedRanking = ref(false); // Alterado para iniciar detalhado por padrão
const globalRanking = ref<ComparisonResult[]>([]);
const shareStatus = ref('Gerar Link de Compartilhamento');

// Encontra o índice da marca ativa para o TypeScript ficar feliz no v-model
const activeBrandIndex = computed(() => brands.value.findIndex(b => b.id === activeBrandId.value));

// -- GERENCIAMENTO DA URL E ESTADO --

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('d');
    
    if (encodedData) {
        try {
            const decodedJson = decodeURIComponent(escape(atob(encodedData)));
            const parsedState = JSON.parse(decodedJson);
            
            if (parsedState.brands && parsedState.measures) {
                brands.value = parsedState.brands;
                globalMeasures.value = parsedState.measures;
                if (brands.value.length > 0) {
                    activeBrandId.value = brands.value[0]?.id ?? '';
                }
                
                // NOVO: Abre o ranking detalhado automaticamente se veio de um link!
                showDetailedRanking.value = true;
            }
        } catch (e) {
            console.error('Falha ao restaurar dados da URL. Carregando estado padrão.', e);
        }
    }
    updateGlobal();
});

async function shareStateUrl() {
    const stateToShare = {
        brands: brands.value,
        measures: globalMeasures.value
    };
    
    const jsonStr = JSON.stringify(stateToShare);
    const encodedData = btoa(unescape(encodeURIComponent(jsonStr)));
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?d=${encodedData}`;

    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Meu Duelo Smart Drink',
                text: 'Veja qual bebida compensa mais!',
                url: shareUrl
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            shareStatus.value = 'Link Copiado!';
            setTimeout(() => { shareStatus.value = 'Gerar Link de Compartilhamento'; }, 3000);
        }
    } catch (err) {
        console.error('Erro ao compartilhar', err);
    }
}

// -- FUNÇÕES DE GERENCIAMENTO --

function addBrand() {
    const id = 'b' + Date.now().toString();
    brands.value.push({ id, name: 'Nova Marca', isActive: true, prices: {} });
    activeBrandId.value = id;
}

function removeBrand(id: string) {
    brands.value = brands.value.filter(b => b.id !== id);
    if (activeBrandId.value === id) {
        activeBrandId.value = brands.value[0]?.id ?? '';
    }
    updateGlobal();
}

function addGlobalMeasure() {
    const name = newMeasureName.value;
    const ml = newMeasureMl.value;
    const qty = newMeasureQty.value;

    if (name && ml && ml > 0) {
        globalMeasures.value.push({
            id: 'm' + Date.now().toString(),
            name: name,
            volumeMl: ml,
            quantity: qty && qty > 0 ? qty : 1
        });
        newMeasureName.value = '';
        newMeasureMl.value = null;
        newMeasureQty.value = 1;
    }
}

function updateGlobal() {
    globalRanking.value = DrinkCalculator.calculateGlobalRanking(brands.value, globalMeasures.value);
}

function getMeasureRanking(measure: Measure): ComparisonResult[] {
    return DrinkCalculator.calculateMeasureRanking(brands.value, measure);
}

watch(brands, updateGlobal, { deep: true });
</script>