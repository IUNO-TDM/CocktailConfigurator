export class TdmComponent {
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
    layers: CocktailLayer[] = [];
}

export class CocktailLayer {
    components: CocktailLayerComponent[] = [];
}

export class CocktailLayerComponent {
    component: TdmComponent;
    amount: number;

    constructor(component: TdmComponent, amount: number) {
        this.component = component;
        this.amount = amount;
    }
}