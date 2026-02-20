export interface Measure {
    id: string;
    name: string;
    volumeMl: number;
    quantity: number;
}

export interface Brand {
    id: string;
    name: string;
    isActive: boolean;
    prices: Record<string, number>;
}

export interface ComparisonResult {
    brandName: string;
    measureName: string;
    volumeMl: number;
    quantity: number;
    price: number;
    pricePerLiter: number;
    isBestValue: boolean;
    savingsPercentage: number;
    hasPrice: boolean;
}

export class DrinkCalculator {
    public static getBrandBestOption(brand: Brand, measures: Measure[]): ComparisonResult | null {
        const validOptions = measures
            .filter(m => (brand.prices[m.id] || 0) > 0 && m.volumeMl > 0 && m.quantity > 0)
            .map(m => {
                const price = brand.prices[m.id] || 0;
                const totalVolumeMl = m.volumeMl * m.quantity;
                
                return {
                    brandName: brand.name,
                    measureName: m.name,
                    volumeMl: m.volumeMl,
                    quantity: m.quantity,
                    price: price,
                    pricePerLiter: (price / totalVolumeMl) * 1000,
                    isBestValue: false,
                    savingsPercentage: 0,
                    hasPrice: true
                };
            });

        if (validOptions.length === 0) return null;

        return validOptions.reduce((prev, curr) => curr.pricePerLiter < prev.pricePerLiter ? curr : prev);
    }

    public static calculateGlobalRanking(brands: Brand[], measures: Measure[]): ComparisonResult[] {
        const bestOptions = brands
            .filter(b => b.isActive)
            .map(b => this.getBrandBestOption(b, measures))
            .filter((res): res is ComparisonResult => res !== null);

        if (bestOptions.length === 0) return [];

        const cheapestPrice = Math.min(...bestOptions.map(r => r.pricePerLiter));

        return bestOptions.map(res => ({
            ...res,
            isBestValue: res.pricePerLiter === cheapestPrice,
            // CORREÇÃO: Divisão pelo cheapestPrice para descobrir quantos % ele é mais caro
            savingsPercentage: res.pricePerLiter === cheapestPrice ? 0 : ((res.pricePerLiter - cheapestPrice) / cheapestPrice) * 100
        })).sort((a, b) => a.pricePerLiter - b.pricePerLiter);
    }

    public static calculateMeasureRanking(brands: Brand[], measure: Measure): ComparisonResult[] {
        const results = brands.filter(b => b.isActive).map(b => {
            const price = b.prices[measure.id] || 0;
            const totalVolumeMl = measure.volumeMl * measure.quantity;
            
            return {
                brandName: b.name,
                measureName: measure.name,
                volumeMl: measure.volumeMl,
                quantity: measure.quantity,
                price: price,
                pricePerLiter: price > 0 ? (price / totalVolumeMl) * 1000 : Infinity,
                isBestValue: false,
                savingsPercentage: 0,
                hasPrice: price > 0
            };
        });

        const validResults = results.filter(r => r.hasPrice);
        
        if (validResults.length > 0) {
            const cheapest = Math.min(...validResults.map(r => r.pricePerLiter));
            results.forEach(res => {
                if (res.hasPrice) {
                    res.isBestValue = res.pricePerLiter === cheapest;
                    // CORREÇÃO: Divisão pelo cheapest para descobrir quantos % ele é mais caro
                    res.savingsPercentage = res.isBestValue ? 0 : ((res.pricePerLiter - cheapest) / cheapest) * 100;
                }
            });
        }

        return results.sort((a, b) => {
            if (!a.hasPrice) return 1;
            if (!b.hasPrice) return -1;
            return a.pricePerLiter - b.pricePerLiter;
        });
    }
}