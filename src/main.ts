function main(): void {
    const canvas: HTMLCanvasElement = document.getElementById("canvas") as 
        HTMLCanvasElement;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    let deltaTime: DeltaTime = new DeltaTime;

    let physicsEntities: PhysicsEntity[] = [];
    for (let i:number = 0; i < 7; i++) {
        physicsEntities[i] = new PhysicsEntity({x: Math.floor(Math.random() 
            * 600) + 100, y: Math.floor(Math.random() * 600) + 100}, 
            {x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() 
            * 5)}, {x: 64, y: 64}, 1, true);
    }
    // Top
    physicsEntities[0] = new PhysicsEntity({x: 0, y: 0}, 
        {x: 0, y: 0}, {x: window.innerWidth, y: 64}, 1, false);
    // Right
    physicsEntities[1] = new PhysicsEntity({x: window.innerWidth - 64, y: 0}, 
        {x: 0, y: 0}, {x: 64, y: window.innerWidth}, 1, false);
    // Bottom
    physicsEntities[2] = new PhysicsEntity({x: 0, y: window.innerHeight - 64},
        {x: 0, y: 0}, {x: window.innerWidth, y: 64}, 1, false);
    // Left
    physicsEntities[3] = new PhysicsEntity({x: 0, y: 0}, 
        {x: 0, y: 0}, {x: 64, y: window.innerHeight}, 1, false);

    window.requestAnimationFrame(function() {draw(canvas, context, deltaTime, 
        physicsEntities)});
}
function draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, 
    deltaTime: DeltaTime, physicsEntities: PhysicsEntity[]): void {

    context.clearRect(0, 0, canvas.width, canvas.height);

    deltaTime.update();
    PhysicsEntity.resolveCollisions(physicsEntities);
    for (let i: number = 0; i < physicsEntities.length; i++) {
        physicsEntities[i].update(deltaTime.deltaTime);
        physicsEntities[i].draw(canvas, context);
    }

    window.requestAnimationFrame(function(){draw(canvas, context, deltaTime,
        physicsEntities)});
}

main();