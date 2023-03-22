class DeltaTime {
    public deltaTime: number;
    private timeThen: number;
    private timeNow: number
    constructor() {
        this.timeThen = Date.now();
        this.timeNow = 0;
        this.deltaTime = 0;
    }
    public update(): void {
        this.timeNow = Date.now();
        this.deltaTime = (this.timeNow - this.timeThen) / 1000;
        if (this.deltaTime == 0) {
            this.deltaTime = 1;
        }
        this.timeThen = this.timeNow;
    }
}