function reqs(){
    console.log("funcion reqs presionada")
    var account = document.getElementById('addr').value;
    var amount = document.getElementById('amnt').value;
    var message = document.getElementById('txt').value;
    
    fetch(`http://localhost:8080/send?account=${account}&amount=${amount}&message=${message}`)
    .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log(response); // this is the body of the response
        
        codigo = response.code;
        if (codigo == 1){
            document.getElementById("respuesta").style.backgroundColor = "#c0deb6";
            document.getElementById('cod').innerHTML = 'code: ' + codigo;
            document.getElementById('mess').innerHTML = 'message : ' + response.message;
            document.getElementById('hash').innerHTML = 'transactionHash : ' + response.transactionHash.data;
            
        }else if(codigo == 0 ){
            document.getElementById("respuesta").style.backgroundColor = "#ff8f8f";
            document.getElementById('cod').innerHTML = 'code : ' + codigo;
            document.getElementById('mess').innerHTML = 'message : ' + response.data.error;
            document.getElementById('hash').innerHTML = 'transactionHash : ' + response.data.message;

        }else{
            document.getElementById("respuesta").style.backgroundColor = "#ff8f8f";
            document.getElementById('cod').innerHTML = 'code : ' + codigo;
            document.getElementById('mess').innerHTML = 'message : ' + response.message;
            document.getElementById('hash').innerHTML = 'transactionHash : ' + response.transactionHash.data;
        }

      })
} 

