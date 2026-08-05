// ===============================
// ELEMENTOS HTML
// ===============================


const defeatScene = document.getElementById("defeatScene");
const retryButton = document.getElementById("retryButton");

const selectionScene = document.getElementById("selectionScene");
const gameScene = document.getElementById("gameScene");


const previousCharacter = document.getElementById("previousCharacter");
const nextCharacter = document.getElementById("nextCharacter");
const confirmCharacter = document.getElementById("confirmCharacter");


const btnAttack = document.getElementById("btnAttack");
const btnSkill = document.getElementById("btnSkill");
const btnPotion = document.getElementById("btnPotion");
const btnDefend = document.getElementById("btnDefend");
const btnRestart = document.getElementById("btnRestart");



const characterImage = document.getElementById("characterImage");
const characterName = document.getElementById("characterName");

const characterHP = document.getElementById("characterHP");
const characterAttack = document.getElementById("characterAttack");
const characterDefense = document.getElementById("characterDefense");


const heroName = document.getElementById("heroName");
const enemyName = document.getElementById("enemyName");

const heroImage = document.getElementById("heroImage");
const enemyImage = document.getElementById("enemyImage");


const heroHP = document.getElementById("heroHP");
const enemyHP = document.getElementById("enemyHP");

const heroHPBar = document.getElementById("heroHPBar");
const enemyHPBar = document.getElementById("enemyHPBar");


const heroLevel = document.getElementById("heroLevel");
const heroXP = document.getElementById("heroXP");
const heroGold = document.getElementById("heroGold");
const heroPotions = document.getElementById("heroPotions");

const enemyLevel = document.getElementById("enemyLevel");


const logText = document.getElementById("logText");





// ===============================
// PERSONAJES
// ===============================


const personajes = [

    {
        nombre:"Pintor Austriaco",
        hp:150,
        ataque:100,
        defensa:25,
        imagen:"imagenes/pintorAustriaco.png"
    },

    {
        nombre:"Soldado Palestino",
        hp:200,
        ataque:50,
        defensa:50,
        imagen:"imagenes/SoldadoPalestino.png"
    },

];


let personajeSeleccionado = 0;





// ===============================
// CLASE PERSONAJE
// ===============================


class Personaje{


    constructor(nombre,hp,ataque,defensa,imagen){


        this.nombre = nombre;

        this.hp = hp;

        this.hpMax = hp;

        this.ataque = ataque;

        this.defensa = defensa;

        this.imagen = imagen;


        this.nivel = 1;

        this.xp = 0;

        this.oro = 0;

        this.pociones = 3;

        this.defendiendo = false;


    }





    recibirDaño(daño){


        if(this.defendiendo){

            daño = Math.floor(daño / 2);

            agregarLog(
                `<span class="defense">
                🛡 Daño reducido a ${daño}
                </span>`
            );

            this.defendiendo=false;

        }


        this.hp -= daño;


        if(this.hp < 0)
            this.hp=0;


        return daño;

    }




    atacar(objetivo){


        let daño = this.ataque - objetivo.defensa;


        if(daño < 1)
            daño=1;



        if(Math.random()<0.15){

            daño*=2;

            agregarLog(
                `<span class="critical">
                💥 Golpe crítico
                </span>`
            );

        }



        return objetivo.recibirDaño(daño);

    }




    defender(){


        this.defendiendo=true;


        agregarLog(
            `<span class="defense">
            🛡 ${this.nombre} se defendió
            </span>`
        );


    }




    curarse(){


        if(this.pociones<=0){

            agregarLog(
                `<span class="warning">
                No quedan bendiciones
                </span>`
            );

            return false;

        }


        this.pociones--;

        let cantidad=30;


        this.hp += cantidad;


        if(this.hp>this.hpMax)
            this.hp=this.hpMax;



        agregarLog(
            `<span class="heal">
            Los dioses antisemitas te bendicen con ${cantidad} de HP
            </span>`
        );


        return true;


    }




    habilidad(objetivo){


        let daño=this.ataque*2;


        objetivo.recibirDaño(daño);


        agregarLog(
            `<span class="skill">
            Golpe NEIN: ${daño} daño
            </span>`
        );


        return true;


    }


}







// ===============================
// ENEMIGOS
// ===============================


const enemigos=[


    {
        nombre:"Judio",
        hp:20,
        ataque:8,
        defensa:2,
        imagen:"imagenes/Judio.png"
    },


    {
        nombre:"Benjamin Netanyahu",
        hp:70,
        ataque:14,
        defensa:5,
        imagen:"imagenes/Netanyahu.png"
    },


    {
        nombre:"Estado legitimo de Israel",
        hp:100,
        ataque:22,
        defensa:8,
        imagen:"imagenes/Israel.png"
    }

];



function crearEnemigo(){


    let base =
    enemigos[Math.floor(Math.random()*enemigos.length)];


    let nivel =
    Math.floor(Math.random()*10)+1;



    let e = new Personaje(

        base.nombre,
        base.hp+nivel*15,
        base.ataque+nivel*2,
        base.defensa+nivel,
        base.imagen

    );


    e.nivel=nivel;


    return e;

}







let heroe;

let enemigo;

let logs=[];





// ===============================
// COMBATE
// ===============================


function nuevoCombate(){


    enemigo=crearEnemigo();


    agregarLog(
        `<span class="warning">
        ⚠ Apareció ${enemigo.nombre} de nivel ${enemigo.nivel}
        </span>`
    );


    actualizar();


}





function turno(accion){



    if(!enemigo)
        return;



    if(accion==="atacar")
        heroe.atacar(enemigo);



    if(accion==="defender")
        heroe.defender();



    if(accion==="objeto")
        heroe.curarse();



    if(accion==="habilidad")
        heroe.habilidad(enemigo);




    actualizar();




    if(enemigo.hp<=0){

        nuevoCombate();

        return;

    }




    setTimeout(()=>{


        enemigo.atacar(heroe);


        actualizar();



        if(heroe.hp<=0){

            perder();

        }


    },700);



}







function perder(){


    gameScene.classList.add("hidden");


    defeatScene.classList.remove("hidden");


}







// ===============================
// INTERFAZ
// ===============================


function actualizar(){


    heroName.textContent=heroe.nombre;

    heroImage.src=heroe.imagen;


    enemyName.textContent=enemigo.nombre;

    enemyImage.src=enemigo.imagen;



    heroHP.textContent=
    `${heroe.hp}/${heroe.hpMax}`;


    enemyHP.textContent=
    `${enemigo.hp}/${enemigo.hpMax}`;



    heroHPBar.style.width=
    `${heroe.hp/heroe.hpMax*100}%`;



    enemyHPBar.style.width=
    `${enemigo.hp/enemigo.hpMax*100}%`;



    heroLevel.textContent=
    "Nivel: "+heroe.nivel;


    heroPotions.textContent=
    "Objetos: "+heroe.pociones;


}





function agregarLog(texto){


    logs.unshift(texto);


    if(logs.length>8)
        logs.pop();


    logText.innerHTML=
    logs.join("<br>");

}







// ===============================
// SELECCION
// ===============================


function mostrarSeleccion(){


    let p=personajes[personajeSeleccionado];


    characterImage.src=p.imagen;

    characterName.textContent=p.nombre;

    characterHP.textContent="HP: "+p.hp;

    characterAttack.textContent="Ataque: "+p.ataque;

    characterDefense.textContent="Defensa: "+p.defensa;


}



previousCharacter.onclick=()=>{


    personajeSeleccionado--;


    if(personajeSeleccionado<0)
        personajeSeleccionado=personajes.length-1;


    mostrarSeleccion();

};



nextCharacter.onclick=()=>{


    personajeSeleccionado++;


    if(personajeSeleccionado>=personajes.length)
        personajeSeleccionado=0;


    mostrarSeleccion();

};





confirmCharacter.onclick=()=>{


    let p=personajes[personajeSeleccionado];


    heroe=new Personaje(

        p.nombre,
        p.hp,
        p.ataque,
        p.defensa,
        p.imagen

    );



    selectionScene.classList.add("hidden");

    gameScene.classList.remove("hidden");


    nuevoCombate();


};







btnAttack.onclick=()=>turno("atacar");

btnDefend.onclick=()=>turno("defender");

btnPotion.onclick=()=>turno("objeto");

btnSkill.onclick=()=>turno("habilidad");



btnRestart.onclick=()=>{

    location.reload();

};



retryButton.onclick=()=>{

    location.reload();

};



mostrarSeleccion();