const {promises : fs} = require('fs');

class Contenedor {
    constructor (oneway){
        this.oneway = oneway
    }


    async save(obj){
        const objs = await this.getAll();
        let newId;

        if (objs.length == 0){
            newId = 1;
        }else {
            newId = objs[objs.length - 1].id + 1;
        }

        const newObj ={...obj , id: newId}
        objs.push (newObj);
        try {
           await fs.writeFile(this.oneway, JSON.stringify(objs,null,2));
            return newId
        } catch (error) {
            throw new Error (`Fail to save:${error}`);
        }
    }



    async getById(id) {
        const objs = await this.getAll();
        const obj = objs.find(x => x.id == id);
        return obj;
    }

    async getAll(){
        try {
            const objs = await fs.readFile(this.oneway,'utf-8');
            return JSON.parse(objs);

        } catch (error) {
            return []
        }
    } 

    async deleteById(id){
        let collection = []
        await fs.readFile(`./${this.oneway}`,'utf-8')
        .then( contenido => {
            let col = JSON.parse(contenido)
            for (const ob of col) {
                if(ob.id != id) {
                    collection.push(ob)
                }
            }
        })
        .catch( err => console.log(err));
        await fs.writeFile(`./${this.oneway}`, JSON.stringify(collection));
        console.log('Deleted Objeto eliminado!');
        console.log('******************');
    }

    async deleteAll(){
        await fs.writeFile(`./${this.oneway}`, '');
        console.log('Todos los objetos fueron eliminados');
    }

}

module.exports = Contenedor 