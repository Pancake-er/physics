class DeltaTime {
    date: Date;
    timeThen: number;
    timeNow: number;
    deltaTime: number;
    t: number;
    constructor() {
        this.timeThen = Date.now();
        this.timeNow = 0;
        this.deltaTime = 0;
        this.t = 0
    }
    update(): void {
        this.timeNow = Date.now();
        this.deltaTime = (this.timeNow - this.timeThen) / 1000;
        this.t += this.deltaTime;
        if (this.deltaTime == 0) {
            this.deltaTime = 1;
        }
        this.timeThen = this.timeNow;
    }
}