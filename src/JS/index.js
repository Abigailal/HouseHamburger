//Slide section 3 Index.html
let slider = document.querySelector(".slider-contenedor");
let sliderIndividual = document.querySelectorAll(".contenido-slider");
let contador = 1;
let width = sliderIndividual[0].clientWidth;
let intervalo = 4000;

window.addEventListener("resize",function(){ //Cada que haya un cambio de tamaño, la variable width se actualizara.
    width = sliderIndividual[0].clientWidth;
});

setInterval(function(){
    slides();
},intervalo);

function slides(){
    //slider.style.transform = `translate( ${-width*contador} px)`;
    slider.style.transform = "translate(" + (-width*contador)+ "px)";
    slider.style.transition = "transform .3s";
    contador++;

    if (contador == sliderIndividual.length){
        setTimeout(function(){
            slider.style.transform = "translate (0px)";
            slider.style.transition = "transform .8s";
            contador = 0;
        },1500);
    }
};


//ContactUS section 4 Index.html

$(document).ready(function(){

    $("#formulario").validate();

    $( "#formulario" ).submit(function( event ) {
        let username = $("#name").val();
        let fecha = $("#fecha").val();
        let people = $("#people").val();
        let email = $("#email").val();
        let time = $("#time").val();

        if(username=="" || fecha=="" || people=="" || email=="" || time==""){
            alert( "Se requieren todos los datos del formulario." );
        }else{
            $("#modalMesas").modal('show');
            event.preventDefault();//Esto es para cancelar el envio
            event.stopPropagation();
        }
    });
});