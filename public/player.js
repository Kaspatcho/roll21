class Player{
    constructor(x, y, img){
        this.radius = 30;
        this.x = x;
        this.y = y;
        this.img = loadImage(img);
        this.src = img;
        this.imgProjection = [this.img.width/2, this.img.height/2];
        this.imgScale = 200;
        this.dragging = false;
        this.conditions = [];
        this.condSpacing = 5;
    }

    show(){
        push()
        noStroke();
        for(let i=this.conditions.length; i >= 0; i--){
            let condition = this.conditions[i];
            if(condition){
                fill(condition);
                square((this.x - ((i+1)* this.condSpacing) / 2),
                (this.y - ((i+1)* this.condSpacing) / 2),
                (this.radius + (i+1)* this.condSpacing),
                (this.radius + (i+1)* this.condSpacing))
            }
        }
        image(this.img, this.x, this.y, this.radius, this.radius,
            this.imgProjection[0], this.imgProjection[1], this.imgScale, this.imgScale)
        pop()
    }

    setImg(img){
        this.img = loadImage(img);
        this.src = img;
    }

    static conditions = {
        POISONED : '#23d98a',
        HEXED : '#90fcf3',
        PETRIFIED : '#bfbabb',
        CONCENTRATION : '#5e99ff',
        BANE : '#fb21ff',
        UNCONCIOUS : '#ff5485',
        RAGING : '#f27013',
        INCAPACITATED : '#574c36',
        PRONE : '#825312',
        DEAFENED : '#a83fd9',
        BLINDED : '#a0baba',
        BLESSED : '#fffc4d',
        RESTRAINED : '#1e3d73',
        CURSED : '#333333',
        CHARMED : '#ffdbdb',
        PARALIZED : '#24523c',
        INVISIBLE : '#ae89d6',
        EXHAUSTION : '#2f4469',
        FRIGHTENED : '#a36878',
        GRAPPLED : '#6a8fa8',
        FAERIE_FIRE : '#a3a112',
        STUNNED : '#70d437',
        BANISHED : '#ab0c39',
        HUNTERS_MARK : '#ff0037',
    }
}