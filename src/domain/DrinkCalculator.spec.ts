import { describe, it, expect } from 'vitest';
import { DrinkCalculator, type Brand, type Measure } from './DrinkCalculator';

describe('DrinkCalculator', () => {

    const globalMeasures: Measure[] = [
        { id: 'm1', name: 'Lata', volumeMl: 350, quantity: 1 },
        { id: 'm2', name: 'Pack Lata 12', volumeMl: 350, quantity: 12 },
        { id: 'm3', name: 'Garrafa', volumeMl: 600, quantity: 1 }
    ];

    describe('getBrandBestOption (Melhor Custo da Marca)', () => {
        it('deve calcular corretamente o preco por litro de um item avulso', () => {
            const brand: Brand = {
                id: 'b1', name: 'Marca A', isActive: true,
                prices: { 'm1': 3.50 } // 350ml por R$3.50 = R$10,00/L
            };

            const result = DrinkCalculator.getBrandBestOption(brand, globalMeasures);

            expect(result).not.toBeNull();
            expect(result?.pricePerLiter).toBe(10);
            expect(result?.measureName).toBe('Lata');
        });

        it('deve calcular corretamente o preco por litro considerando a quantidade do pack', () => {
            const brand: Brand = {
                id: 'b1', name: 'Marca A', isActive: true,
                // Pack com 12 latas de 350ml (4200ml total) por R$ 33.60 = R$8,00/L
                prices: { 'm2': 33.60 } 
            };

            const result = DrinkCalculator.getBrandBestOption(brand, globalMeasures);

            expect(result?.pricePerLiter).toBe(8);
            expect(result?.volumeMl).toBe(350);
            expect(result?.quantity).toBe(12);
        });

        it('deve retornar a opcao mais barata por litro dentro da mesma marca', () => {
            const brand: Brand = {
                id: 'b1', name: 'Marca A', isActive: true,
                prices: { 
                    'm1': 4.00,  // R$ 11.42/L
                    'm3': 6.00   // R$ 10.00/L (Mais barato)
                } 
            };

            const result = DrinkCalculator.getBrandBestOption(brand, globalMeasures);

            expect(result?.measureName).toBe('Garrafa');
            expect(result?.price).toBe(6.00);
        });

        it('deve retornar nulo se a marca nao possuir precos definidos ou validos', () => {
            const brand: Brand = { id: 'b1', name: 'Marca A', isActive: true, prices: {} };
            const result = DrinkCalculator.getBrandBestOption(brand, globalMeasures);
            
            expect(result).toBeNull();
        });
    });

    describe('calculateGlobalRanking (Duelo de Marcas)', () => {
        it('deve ordenar as marcas da mais barata para a mais cara e calcular a porcentagem de economia', () => {
            const brands: Brand[] = [
                { id: 'b1', name: 'Cara', isActive: true, prices: { 'm1': 7.00 } }, // R$ 20/L
                { id: 'b2', name: 'Barata', isActive: true, prices: { 'm1': 3.50 } }  // R$ 10/L
            ];

            const ranking = DrinkCalculator.calculateGlobalRanking(brands, globalMeasures);

            expect(ranking.length).toBe(2);
            
            // Primeiro lugar (Barata)
            expect(ranking[0]!.brandName).toBe('Barata');
            expect(ranking[0]!.isBestValue).toBe(true);
            expect(ranking[0]!.savingsPercentage).toBe(0);

            // Segundo lugar (Cara)
            expect(ranking[1]!.brandName).toBe('Cara');
            expect(ranking[1]!.isBestValue).toBe(false);
            expect(ranking[1]!.savingsPercentage).toBe(100); 
        });

        it('deve ignorar marcas inativas no ranking global', () => {
            const brands: Brand[] = [
                { id: 'b1', name: 'Marca Ativa', isActive: true, prices: { 'm1': 3.50 } },
                { id: 'b2', name: 'Marca Inativa', isActive: false, prices: { 'm1': 1.00 } }
            ];

            const ranking = DrinkCalculator.calculateGlobalRanking(brands, globalMeasures);

            expect(ranking.length).toBe(1);
            expect(ranking[0]!.brandName).toBe('Marca Ativa');
        });
    });

    describe('calculateMeasureRanking (Ranking Detalhado por Recipiente)', () => {
        it('deve comparar diferentes marcas para a mesma medida', () => {
            const lata = globalMeasures[0]!; // Adicionado !
            const brands: Brand[] = [
                { id: 'b1', name: 'Marca A', isActive: true, prices: { 'm1': 4.00 } },
                { id: 'b2', name: 'Marca B', isActive: true, prices: { 'm1': 3.50 } }
            ];

            const ranking = DrinkCalculator.calculateMeasureRanking(brands, lata);

            expect(ranking[0]!.brandName).toBe('Marca B'); 
            expect(ranking[0]!.isBestValue).toBe(true);
            expect(ranking[1]!.brandName).toBe('Marca A');
        });

        it('deve colocar marcas sem preco definido para a medida no final da lista', () => {
            const lata = globalMeasures[0]!; // Adicionado !
            const brands: Brand[] = [
                { id: 'b1', name: 'Sem Preco', isActive: true, prices: {} },
                { id: 'b2', name: 'Com Preco', isActive: true, prices: { 'm1': 5.00 } }
            ];

            const ranking = DrinkCalculator.calculateMeasureRanking(brands, lata);

            expect(ranking[0]!.brandName).toBe('Com Preco');
            expect(ranking[0]!.hasPrice).toBe(true);
            
            expect(ranking[1]!.brandName).toBe('Sem Preco');
            expect(ranking[1]!.hasPrice).toBe(false);
            expect(ranking[1]!.isBestValue).toBe(false);
        });
    });

});