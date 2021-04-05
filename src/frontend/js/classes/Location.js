export default class Location {
    #uuid
    #name
    #image
    #hotspots
    
    constructor({
        uuid,
        name,
        image,
        hotspots
    }) {
        this.#uuid = uuid;
        this.#name = name;
        this.#image = image;
        this.#hotspots = hotspots;
    }

    get uuid() {
        return this.#uuid;
    }
    get name() {
        return this.#name;
    }
    get image() {
        return this.#image;
    }
    get hotspots() {
        return this.#hotspots;
    }
}