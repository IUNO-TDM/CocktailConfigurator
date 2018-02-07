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
    amount = 240;
    layers: CocktailLayer[] = [];
}

export class CocktailLayer {
    components: TdmComponent[] = [];
}
