interface Vector2 {
    x: number;
    y: number;
}
interface CollidingDirections {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}
class PhysicsEntity {
    public position: Vector2;
    public velocity: Vector2;
    public acceleration: Vector2;
    public size: Vector2;
    public mass: number;

    // Determines weather to do motion for this.
    private doKinematics: boolean;

    /* Used so that you don't move towards sides that are touching to 
        prevent jittering. */
    private collidingDirections: CollidingDirections;

    /* Used to make sure you don't try and collide with yourself. You might also
        be able to compare references for this? */
    private static newId: number = 0;
    readonly id: number;

    private static pixelsPerMeter: number = 100;

    private img: HTMLImageElement;
    constructor(position: Vector2, velocity: Vector2, size: Vector2, 
        mass: number, doKinematics: boolean) 
    {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = {x: 0, y: 9.81};
        this.size = size;
        this.mass = mass;

        this.doKinematics = doKinematics;

        this.collidingDirections = {top: false, right: false, bottom: false,
            left: false};

        this.id = PhysicsEntity.newId;
        PhysicsEntity.newId++;

        this.img = new Image();
        this.img.src = "images/blue_block.png";
    }
    update(deltaTime: number): void {
        if (this.doKinematics) {
            this.velocity.x += this.acceleration.x * deltaTime;
            this.velocity.y += this.acceleration.y * deltaTime;

            if (this.collidingDirections.top && this.velocity.y < 0) {
                this.velocity.y = 0;
            }
            if (this.collidingDirections.right && this.velocity.x > 0) {
                this.velocity.x = 0;
            }
            if (this.collidingDirections.bottom && this.velocity.y > 0) {
                this.velocity.y = 0;
            }
            if (this.collidingDirections.left && this.velocity.x < 0) {
                this.velocity.x = 0;
            }

            this.position.x += this.velocity.x * deltaTime 
                * PhysicsEntity.pixelsPerMeter;
            this.position.y += this.velocity.y * deltaTime
                * PhysicsEntity.pixelsPerMeter;
        }
    }
    static checkIfTouching(entity1: PhysicsEntity, 
        entity2: PhysicsEntity): boolean 
    {
        if (entity1.position.x <= entity2.position.x + entity2.size.x 
            && entity1.position.x + entity1.size.x >= entity2.position.x 
            && entity1.position.y <= entity2.position.y + entity2.size.y
            && entity1.position.y + entity1.size.y >= entity2.position.y) 
        {
            return true;
        }
        return false;
    }
    static calculateDepth(entity1: PhysicsEntity, 
        entity2: PhysicsEntity): Vector2 
    {
        let entity1Center: Vector2 = {x: entity1.position.x + entity1.size.x 
            / 2, y: entity1.position.y + entity1.size.y / 2};
        let entity2Center: Vector2 = {x: entity2.position.x + entity2.size.x 
            / 2, y: entity2.position.y + entity2.size.y / 2};
        return {x: entity1.size.x / 2 + entity2.size.x / 2 
            - Math.abs(entity1Center.x - entity2Center.x), y: entity1.size.y / 2 
            + entity2.size.y / 2 - Math.abs(entity1Center.y - entity2Center.y)};
    }
    static separateBasedOnDepth(entity: PhysicsEntity, oldEntity: PhysicsEntity,
        otherOldEntity: PhysicsEntity, depth: Vector2) 
    {
        if (depth.x < depth.y) {
            if (oldEntity.position.x < otherOldEntity.position.x) {
                entity.position.x -= depth.x / 2;
                entity.collidingDirections.right = true;
            }
            else {
                entity.position.x += depth.x / 2;
                entity.collidingDirections.left = true;
            }
        }
        else {
            if (oldEntity.position.y < otherOldEntity.position.y) {
                entity.position.y -= depth.y / 2;
                entity.collidingDirections.bottom = true;
            }
            else {
                entity.position.y += depth.y / 2;
                entity.collidingDirections.top = true;
            }
        }
    }
    static resolveCollisions(physicsEntities: PhysicsEntity[]): void {
        let oldPhysicsEntities: PhysicsEntity[] = [...physicsEntities]; 
        for (let i: number = 0; i < oldPhysicsEntities.length; i++) {

            physicsEntities[i].collidingDirections = {top: false, 
                right: false, bottom: false, left: false};

            for (let j: number = 0; j < oldPhysicsEntities.length; j++) {
                if (oldPhysicsEntities[i].doKinematics == false 
                    || oldPhysicsEntities[i].id == oldPhysicsEntities[j].id) 
                {
                    continue;
                }
                if (PhysicsEntity.checkIfTouching(oldPhysicsEntities[i], 
                    oldPhysicsEntities[j])) 
                {   
                    PhysicsEntity.separateBasedOnDepth(physicsEntities[i], 
                        oldPhysicsEntities[i], oldPhysicsEntities[j], 
                        PhysicsEntity.calculateDepth(oldPhysicsEntities[i], 
                        oldPhysicsEntities[j]));
                }
            }
        }
    }
    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.drawImage(this.img, this.position.x, this.position.y, 
            this.size.x, this.size.y);
    }
}