class Vector2 {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    static randomUnit() {
        const angle = Math.random() * Math.PI * 2;
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static dotProduct(vector0, vector1) {
        return vector0.x * vector1.x + vector0.y * vector1.y;
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        let magnitude = this.mag();
        this.x /= magnitude;
        this.y /= magnitude;
    }
}