$(document).ready(function () {
    let tokenAcceso = "4905856019427443";
    let ultimasBusquedas = [];
    $("#btnBuscarPorID").on("click", function () {

        let idHeroe = $("#idHeroe").val();
        if (validacionInput(idHeroe)) {
            console.log(idHeroe);
            $.ajax({
                type: "GET",
                url: `https://superheroapi.com/api.php/${tokenAcceso}/${idHeroe}`,
                dataType: "json",
                success: function (datosApi) {
                    renderDOM(datosApi);
                    //CON EL FIN DE CUMPLIR CON REQUERIMIENTO DE HACER CICLO, SE IMPLEMENTA ESTA FUNCIONALIDAD
                    ultimasBusquedas.push(datosApi);
                    if (ultimasBusquedas.length > 5) {
                        ultimasBusquedas.shift();
                    }
                    mostrarUltimasBusquedas(ultimasBusquedas);
                    if (validacionGrafico(datosApi.powerstats.intelligence, datosApi.powerstats.strength, datosApi.powerstats.speed, datosApi.powerstats.durability, datosApi.powerstats.power, datosApi.powerstats.combat)) {
                        cargarGrafico(datosApi.powerstats.intelligence, datosApi.powerstats.strength, datosApi.powerstats.speed, datosApi.powerstats.durability, datosApi.powerstats.power, datosApi.powerstats.combat);
                    }
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    });
});
function mostrarUltimasBusquedas(ultimasBusquedas) {
    let mostrarUltimas = "";
    console.log(ultimasBusquedas);
    for (let i = 0; i < ultimasBusquedas.length; i++) {
        $('.div-busqueda').empty();
        mostrarUltimas += `
                    <p>${ultimasBusquedas[i].id}, ${ultimasBusquedas[i].name
            }`;
    }
    $('.div-busqueda').append(mostrarUltimas);
}
function renderDOM(datosApi) {
    //DESESTRUCTURACION DE OBJETOS: EXTRAE MULTIPLES PROPIEDADES DE UN OBJETO Y LAS ASIGNA A VARIABLE
    let { id, name, biography, powerstats, appearance, image, work, connections } = datosApi;
    let { "full-name": fullName, "alter-egos": alterEgos, aliases, "place-of-birth": placeOfBirth, "first-appearance": firstAppearance, publisher, alignment } = biography;
    let { intelligence, strength, speed, durability, power, combat } = powerstats;
    let { gender, race, height, weight, "eye-color": eyeColor, "hair-color": hairColor } = appearance;
    let { occupation, base } = work;
    let { "group-affiliation": groupAffilation, relatives } = connections;
    let { url } = image;
    //CUANDO HAY CARACTERES ESPECIALES O PALABRAS RESERVADAS EN LA PROPIEDAD DE UN OBJETO, EN VEZ DE USAR . SE USAN [""] EJ ["full-name"]
    $('.tab-content .resultado, .card-title ').empty();//SE RESETEAN VALORES PQ SE ACUMULABAN
    $('#chartContainer').empty();//SE RESETEA GRAFICO PQ 
    desplazamientoYmostrar();
    //ATRIBUTO A <img>
    $('.img-card-hero').attr("src", url);
    $('.card-title').append(name);

    //DATOS PARA CADA PESTAÑA DE LA CARD EVALUADO CON EXPRESIONES TERNARIAS
    $('#tab1 .resultado').append(`
        <p><b>ID:</b> ${id !== "null" ? id : "Sin información"}</p>
        <p><b>Full name:</b> ${fullName !== "null" && fullName !== "-" ? fullName : "Sin información"}</p>
        <p><b>Alter egos:</b> ${alterEgos !== "null" && alterEgos !== "-" ? alterEgos : "Sin información"}</p>
        <p><b>Aliases:</b> ${aliases && aliases.length && aliases[0] !== "-" ? aliases.join(", ") : "Sin información"}</p>
        <p><b>Place of Birth:</b> ${placeOfBirth !== "null" && placeOfBirth !== "-" ? placeOfBirth : "Sin información"}</p>
        <p><b>First appearance:</b> ${firstAppearance !== "null" && firstAppearance !== "-" ? firstAppearance : "Sin información"}</p>
        <p><b>Publisher:</b> ${publisher !== "null" && publisher !== "-" ? publisher : "Sin información"}</p>
        <p><b>Aligment:</b> ${alignment !== "null" && alignment !== "-" ? alignment : "Sin información"}</p>      
        `);

    $('#tab2 .resultado').append(`
        <p><b>Gender:</b> ${gender !== "null" && gender !== "-" ? gender : "Sin información"}</p>
        <p><b>Race:</b> ${race !== "null" && race !== "-" ? race : "Sin información"}</p>
        <p><b>Height:</b> ${height[1] !== "null" && height[1] !== "-" ? height[1] : "Sin información"}</p>
        <p><b>Weight:</b> ${weight[1] !== "null" && weight[1] !== "-" ? weight[1] : "Sin información"}</p>
        <p><b>Eye color:</b> ${eyeColor !== "null" && eyeColor !== "-" ? eyeColor : "Sin información"}</p>
        <p><b>Hair color:</b> ${hairColor !== "null" && hairColor !== "-" ? hairColor : "Sin información"}</p>
        `);

    $('#tab3 .resultado').append(`
        <p><b>intelligence:</b> ${intelligence !== "null" && intelligence !== "-" ? intelligence : "Sin información"}</p>
        <p><b>strength:</b> ${strength !== "null" && strength !== "-" ? strength : "Sin información"}</p>
        <p><b>speed:</b> ${speed !== "null" && speed !== "-" ? speed : "Sin información"}</p>
        <p><b>combat:</b> ${power !== "null" && power !== "-" ? power : "Sin información"}</p>
        <p><b>durability:</b> ${durability !== "null" && durability !== "-" ? durability : "Sin información"}</p>
        <p><b>combat:</b> ${combat !== "null" && combat !== "-" ? combat : "Sin información"}</p>
        `);

    $('#tab4 .resultado').append(`
        <p><b>Occupation:</b> ${occupation !== "null" && occupation !== "-" ? occupation : "Sin información"}</p>
        <p><b>Base:</b> ${base !== "null" && base !== "-" ? base : "Sin información"}</p>
        <p><b>Group affiliation:</b> ${groupAffilation !== "null" && groupAffilation !== "-" ? groupAffilation : "Sin información"}</p>
        <p><b>Relatives:</b> ${relatives !== "null" && relatives !== "-" ? relatives : "Sin información"}</p>      
        `);
}
function desplazamientoYmostrar() {
    $(".section-card").show();
    $("html, body").animate(
        {
            scrollTop: $(".card").offset().top,
        },
        300
    );
}
function cargarGrafico(intelligence, strength, speed, durability, power, combat) {

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "dark2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Powerstats"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: [
                //SE DEJAN EN 0 SI HAY VALORES NULL EVALUANDO CON EXPRESIONES TERNARIAS
                { y: intelligence !== "null" ? intelligence : "0", label: "intelligence" },
                { y: strength !== "null" ? strength : "0", label: "strength" },
                { y: speed !== "null" ? speed : "0", label: "speed" },
                { y: durability !== "null" ? durability : "0", label: "durability" },
                { y: power !== "null" ? power : "0", label: "power" },
                { y: combat !== "null" ? combat : "0", label: "combat" },
            ]
        }]
    });
    chart.render();


}
function validacionGrafico(intelligence, strength, speed, durability, power, combat) {
    let validado = true;
    if (intelligence == "null" && strength == "null" && speed == "null" && durability == "null" && power == "null" && combat == "null") {
        alert("No hay información para mostrar estadísticas");
        validado = false;
    }
    return validado;
}
function validacionInput(idHeroe) {
    let validado = true;

    if (idHeroe.trim() === "") {
        alert("Debes ingresar un valor");
        validado = false;
    } else if (isNaN(idHeroe)) {
        alert("Debes ingesar sólo números");
        validado = false;
    } else if (idHeroe <= 0 || idHeroe >= 732) {
        alert("Sólo hay 731 registros de Super Heroes");
        validado = false;
    }
    return validado;
}

//ARRAY SE RECORREN CON FOR Y FOREACH PORQUE TIENEN UN INDICE NUMERICO
//JSON LAS CLAVES SON CADENAS SIN UN ORDEN DFINIDO
//"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --user-data-dir="C://Chrome dev session" --disable-web-security "localhost:5500"
