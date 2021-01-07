const items = document.querySelectorAll('.nav ul li');
for(const item of items){
    item.addEventListener('click', () => {
        let name = item.id
        document.querySelector(`.${name}`).classList.remove('hidden');
        for(let v of items){
            let vHTML = document.querySelector(`.${v.id}`);
            if(v.id != name && vHTML){
                document.querySelector(`.${v.id}`).classList.add('hidden')
            }
        }
    })
}

// images

const images = document.querySelectorAll('.images .cont img');

for(const image of images){
    image.addEventListener('click', () => {
        bg = loadImage(image.src);
    })
}

// config
const configButtons = document.querySelectorAll('.config .config-button');

try{
    for(const i in configButtons){
        const configButton = configButtons[i];
        configButton.addEventListener('click', () => {
            if(i == 0){
                showingConditions = !showingConditions;
            }
        })
    }
} catch{}

// characters
const characters = document.querySelector('.characters'); // ERRO

function addPlayers(){
    characters.innerHTML = '';
    for(let i in players){
        const player = players[i];
        
        let cont = document.createElement('div');
        cont.classList.add('character-cont');
        
        let img = document.createElement('img');
        img.src = player.src;
        img.classList.add('character-img');
        img.addEventListener('click', () => {
            getImg().then(v => {
                player.setImg(v);
                addPlayers();
            }).catch(() => {})
        })

        let conditions = document.createElement('div');
        conditions.classList.add('character-conditions');
        let allConditions = Object.keys(Player.conditions);
        let playerConditions = (allConditions.filter(v => 
            player.conditions.includes(Player.conditions[v])
        ).map(v => v.replace('_', ' ')) + '.')
        .replace(/(.*?(\.|,))/g, '<span class="effect">$1</span>');
        conditions.innerHTML = playerConditions;

        let charButtons = document.createElement('div');
        charButtons.classList.add('character-buttons');
        
        let delButton = document.createElement('button');
        delButton.classList.add('delete-character');
        delButton.innerHTML = '-';
        delButton.addEventListener('click', () => {
            if(confirm('tem certeza que quer excluir esse personagem?')) {
                players.splice(i, 1);
                addPlayers();
            }
        })

        let alterButton = document.createElement('button');
        alterButton.classList.add('alter-character');
        alterButton.classList.add('material-icons');
        alterButton.classList.add('small');
        alterButton.innerHTML = 'settings';
        alterButton.addEventListener('click', () => {
            setImage(player.src).then(v =>
                player.imgProjection = v);
        })

        let addEffect = document.createElement('button');
        addEffect.classList.add('add-effect');
        addEffect.innerHTML = '+';
        addEffect.addEventListener('click', () => {
                getEffect().then(v => {
                    if(!player.conditions.includes(v)){
                        player.conditions.push(Player.conditions[v]);
                        
                        let conditions = document.querySelectorAll('.character-cont')[i].childNodes[1];
                        let allConditions = Object.keys(Player.conditions);
                        let playerConditions = (allConditions.filter(v => 
                            player.conditions.includes(Player.conditions[v])
                        ).map(v => v.replace('_', ' ')) + '.')
                        .replace(/(.*?(\.|,))/g, '<span class="effect">$1</span>');
                        conditions.innerHTML = playerConditions;
                        updateEffects();

                    } else{
                        console.log(v)
                    }
                }).catch(() => {});
        })
        
        cont.appendChild(img);
        cont.appendChild(conditions);
        charButtons.appendChild(addEffect);
        charButtons.appendChild(alterButton);
        charButtons.appendChild(delButton);
        cont.appendChild(charButtons);
        characters.appendChild(cont);
    }

    updateEffects();

    let addButton = document.createElement('button')
    addButton.innerHTML = '+';
    addButton.classList.add('add-character');
    addButton.addEventListener('click', async() => {
        try{
            let imgSource = await getImg();
            players.push(new Player(width / 2, height / 2, imgSource));
            addPlayers();
        } catch{}
    })
    characters.appendChild(addButton);
}

// change
const change = document.querySelector('.change');
const cancelButton = document.querySelector('.change .change-cancel');
const changeImgs = document.querySelectorAll('.change .change-cont');

function getImg(){
    let current = '';
    let rejected = false;
    let int;
    change.classList.remove('hidden');
    let p = new Promise((res, rej) => {
        int = setInterval(() => {
            if(current != '') {
                change.classList.add('hidden');
                addPlayers();
                res(current)
                clearInterval(int);
            };
            if(rejected) {
                rej('canceled');
                clearInterval(int);
            }
        }, 500);
    })
    try{
        for(const img of changeImgs){
            img.addEventListener('click', () => {
                current = img.children[0].src;
            })
        }
    } catch{}
    
    cancelButton.addEventListener('click', () => {
        change.classList.add('hidden');
        rejected = true;
    })

    return p;
}

//effect list
showEffects();
function showEffects(){
    const effects = document.querySelector('.effects');
    effects.innerHTML = '';
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('effects-cancel');
    cancelButton.innerHTML = 'Cancel'
    effects.appendChild(cancelButton);

    Object.keys(Player.conditions).map(eff => {

        let effectText = document.createElement('li');
        effectText.classList.add('effect-text');
        effectText.innerHTML = eff.replace('_', ' ');
        effectText.style.color = Player.conditions[eff];

        effects.appendChild(effectText);
    })
}

function updateEffects(){
    const effects = document.querySelectorAll('.effect')
    for(const effect of effects){
        effect.addEventListener('dblclick', function(){
            let mother = this.parentElement.parentElement;
            let motherIndex = [...mother.parentElement.children].findIndex(v => v == mother);
            players[motherIndex].conditions =
            players[motherIndex].conditions.filter(v => 
                v != Player.conditions[this.innerHTML.replace(/\W/g, '')])
            this.parentElement.removeChild(this);
        })
    }
}

function getEffect(){
    const effects = document.querySelector('.effects');
    effects.classList.remove('hidden');
    const effectTexts = document.querySelectorAll('.effects .effect-text');
    let current = '';
    let canceled = false;
    let int;
    let p = new Promise((res, rej) => {
        int = setInterval(() => {
            if(current != ''){
                effects.classList.add('hidden');
                res(current)
                clearInterval(int);
            }
            if(canceled) {
                effects.classList.add('hidden');
                rej('canceled');
                clearInterval(int);
            }
        }, 500);
    })

    for(const effectText of effectTexts){
        effectText.addEventListener('click', () => {
            current = effectText.innerHTML.replace(' ', '_');
        })
    }

    document.querySelector('.effects .effects-cancel').addEventListener('click', () => {
        canceled = true;
    })

    return p;
}

// set image
function setImage(src){
    let setImg = document.querySelector('.set-image');
    setImg.classList.remove('hidden');
    let p = new Promise((res, rej) => {
        let i = setInterval(() => {
            if(setted){
                setImg.classList.add('hidden');
                clearInterval(i);
                clearInterval(int);
                res([pos[0] * -1, pos[1] * -1]);
                pos = [0, 0];
                setted = false;
            }
        }, 500)
    });

    let canvas = document.querySelector('canvas.image');
    let ctx = canvas.getContext('2d');
    let int = setInterval(loop, 1000 / fr);
    let img = new Image();
    img.src = src;
    canvas.width = 200;
    canvas.height = 200;
    let w = canvas.width;
    let h = canvas.height;

    function loop(){
        pos[0] = constrain(pos[0], -img.width + w, 0);
        pos[1] = constrain(pos[1], -img.height + h, 0);

        if(setted){
            clearInterval(int);
        }
        ctx.fillStyle = 'none';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, pos[0], pos[1]);
        ctx.strokeStyle = '#0f0';
    }

    return p;
}
