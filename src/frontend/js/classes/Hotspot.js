export default class Hotspot {
    #uuid
    #position
    #rotation
    #location

    constructor({
        uuid,
        position,
        rotation,
        location
    }) {
        this.#uuid = uuid;
        this.#position = position;
        this.#rotation = rotation;
        this.#location = location;
    }

    get uuid() {
        return this.#uuid;
    }
    get position() {
        return this.#position;
    }
    get rotation() {
        return this.#rotation;
    }
    get location() {
        return this.#location;
    }
}