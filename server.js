const app = require('express')()
const server = require('http').Server(app)

app.engine('html', require('ejs').renderFile)

app.get('/', async (req, res)  => {
    let { dm, pc } = await getImages();
    res.render(__dirname + '/public/index.html',
    {dm: [...dm], pc: [...pc]});
})

app.get('/file/:file/:dm', (req, res) => {
    let {params: { file, dm }} = req;
    let path = dm != 0 ? `/uploads/dm/` : `/public/${file}`
    if(dm == 0) res.sendFile(__dirname + path);
    else{
        let fs = require('fs');
        fs.readdir(__dirname + path, (err, v) => {
            if(!v.includes(file)){
                path = '/uploads/pc/'
            }
            res.sendFile(__dirname + path + file);
        })
    }
})

app.get('/images', async (req, res) => {
    let { dm, pc } = await getImages();
    res.send({dm: [...dm], pc: [...pc]});
})

function getImages(){
    let fs = require('fs');
    let imgs = {dm: [], pc: []}
    fs.readdir(__dirname + `/uploads/dm`, (err, v) => {
        imgs.dm = v
    });
    fs.readdir(__dirname + '/uploads/pc', (err, v) => {
        imgs.pc = v
        return imgs;
    })

    let p = new Promise((res, rej) => {
        let i = setInterval(() => {
            if(imgs.pc && imgs.dm) {
                clearInterval(i);
                res(imgs);
            }
        }, 100)
    })
    return p;
}

server.listen(5000)
