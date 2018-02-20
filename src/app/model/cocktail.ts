export class CocktailComponent {
    id: string;
    name: string;
    color: string;

    constructor(id: string, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}

export class Cocktail {
    name = "CT";
    amount = 240;
    layers: CocktailLayer[] = [];

    getFragmentsCount(): number {
        // total fragments
        var total = 0;
        this.layers.forEach(layer => {
            total += layer.components.length;
        })
        return total;
    }

    public getIngredients() {
        var ingredients = {};
        this.layers.forEach(layer => {
            layer.components.forEach(component => {
                if (ingredients[component.id]) {
                    ingredients[component.id] = ingredients[component.id] + 1;
                } else {
                    ingredients[component.id] = 1;
                }
            });
        });
        return ingredients;
    }

    public addComponent(component: CocktailComponent, layerIndex: number) {
        this.layers[layerIndex].components.push(component);
    }

    public removeComponent(layerIndex: number, componentIndex: number) {
        this.layers[layerIndex].components.splice(componentIndex, 1);
    }

    public addLayer(layer: CocktailLayer, layerIndex: number) {
        this.layers.splice(layerIndex, 0, layer);
    }

    public removeLayer(layerIndex: number) {
        this.layers.splice(layerIndex, 1);
    }
}

export class CocktailLayer {
    components: CocktailComponent[] = [];
}
