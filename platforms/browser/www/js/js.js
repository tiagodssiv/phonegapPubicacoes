
$( document ).ready(function() {
	
	var destinationType; 
	
    $("#cabecalho").hide();
    $("#user").hide();
    $("#pub").hide();
    $("#foto").hide();
    $("#exibeFoto").attr('src','');
    $("#novocadastro").hide();
    $("#btnCadastrar").attr('disabled','disabled');
    
     $("#cad_email").change(function() {
        
        
        if($("#cad_email").val()=="" || $("#cad_email").val().indexOf('@')==-1 || $("#cad_email").val().indexOf('.')==-1)
	{
		navigator.notification.alert('Por favor digite um e-mail válido!!','','Mensagem');
        $("#cad_email").focus();
		
	} else{
                   
        
        $.ajax({
            url:'http://sistemerc.freetzi.com/verifica_email.php',
            dataType:'json',
            type:'POST',
            data:{email:$("#cad_email").val()},
            success: function(r){
                
                if (r.Resp==1) {
                    $("#mensagem").html("E-mail/usuário já cadastrado!!!");
                    $("#btnCadastrar").attr('disabled','disabled');
                }
                
                else if(r.Resp==0) {
                    $("#mensagem").html("E-mail/usuário disponível!!");
                    $("#btnCadastrar").removeAttr('disabled');
                }
                
            },
            
            error:function(){
                navigator.notification.alert('Erro de conexão com o banco de dados!!','','Mensagem');
                $("#btnCadastrar").attr('disabled','disabled');
            }
        })
    }
    });
    
    
});


 

//   inicio


	
			var pictureSource; 
		var teste ='';
		
		// picture source
var destinationType; // sets the format of returned value
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
$("#exibeFoto").attr('src',teste);
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
function clearCache() {
    navigator.camera.cleanup();
}
var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;
        alert('Done!');
    }
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }
	
	
	
	
	
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
	   options.fileUR = fileURI;
    options.mimeType = "image/jpeg";
    options.params = {
		/*
		params.value1 = $("#cad_nome").val();
         params.value2 = $("#cad_email").val();
         params.value3 = $("#cad_senha").val();*/
	};	// if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://sistemerc.freetzi.com/inserirUser.php"), win, fail, options);

	// $("#exibeFoto").attr('src',FILE_URI);
	 	// $("#exibeFoto").attr('src','file:///storage/emulated/0/Android/data/com.phonegap.helloworld/cache/'+fileName);
		// 	 $("#exibeFoto").attr('src',pictureSource);
	 /*	 $("#exibeFoto").attr('src', pictureSource );
		  $("#exibeFoto").attr('src',  options.fileUR );
		 alert ("teste destinationType"+ destinationType);
		 alert ("teste pictureSourcee"+  options.fileUR);*/
}
function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI
    });
	
}
function onFail(message) {
    alert('Failed because: ' + message);
}
		
	
		
		
// fim






function verificaUsuario(){
    
    $.ajax({
        url:/*'http://localhost:8080/teste.php'*/'http://sistemerc.freetzi.com/conexao.php'/*'https://sigbus.000webhostapp.com/read.php'*/,
        dataType:'json',
        type:'POST',
        data:{usuario: $("#usuario").val(),
             senha: $("#senha").val()},
        success:function(r){
			
			
	
			
			
		
            if (r.Resp==0) {
                navigator.notification.alert('Dados não encontrados !','','Mensagem');
            }
            
            else if(r.Resp==1){
				alert(r.Resp+"   nome"+r.nome);
                localStorage.setItem('Cod',r.Id);
                localStorage.setItem('Nome',r.nome);
                localStorage.setItem('Email',r.email);
                localStorage.setItem('Perfil',r.foto);
                
                 inicio();
                
            }
        }
		
		
		,
        error:function(e){
            navigator.notification.alert('Houve um erro de conexão com o banco de dados!!','','Erro');
        }
    })
    
}


function inicio(){
    
    $("#cabecalho").show();
    $("#user").show();
    $("#logon").hide();
    
    var Nome = localStorage.getItem('Nome');
    var Perfil = localStorage.getItem('Perfil');
    
    var foto = "<img class=foto src=http://sistemerc.freetzi.com/postagens/" + Perfil + " width=80%>";
    var nome = "Nome: " + Nome + "<br><br>";
    
    $("#Perfil").html(foto);
    $("#Nome").html(nome);
    
    publicacoes();
}


function publicacoes(){
    
    var cod=localStorage.getItem('Cod');
    var id=0;
    
    $.ajax({
        url:'http://sistemerc.freetzi.com/listar_publicacoes.php',
        dataType:'json',
        success: function(r) {
            console.log(r);
            var total = r.length;
            var i;
            var postagens = "";
            
            for(i=0;i<total;i++){
                console.log(r[i].user);
                postagens+="<div style='width=100%;text-align:center;margin-top:20px'><img class='perfil' src='http://sistemerc.freetzi.com/postagens/" + r[i].foto + "'>";
                postagens+="<br>" + r[i].nome + "</div>";
                postagens+="<div style='width:100%'><img src='http://sistemerc.freetzi.com/postagens/" + r[i].publicacao+ "' width=100%></div>";
                
                if (cod==r[i].user) {
				
                        id=r[i].id;
						
                        postagens+="<div style='width=100%;margin-top:5px'><a href='#' class='ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext' onclick=excluir(" +id + ")>Delete</a></div>"; 
             

				  }
                
                postagens+="<div style='width:100%;text-align:center;margin-top:10px'><span>" + r[i].comentario + "</span></div>";
                
                $("#pub").html(postagens);
                $("#pub").show();
        
                
            }
        
    },
        error:function(e){
        navigator.notification.alert('Houve um erro de conexão com o banco de dados!!','','Erro')
    }
    })
}

function publicar(){
    navigator.notification.confirm(
    'Nova foto ou abrir a galeria?',
    resposta,
    'Publicação',
    ['Galeria','Câmera']
    )
}
            
function resposta(r){
            
    if (r==2){
        fazFoto();
		
	  
//  capturePhoto();
 
 }
	else if(r==1){
		abrirGaleria();
    }
}

//INÍCIO FOTO CÂMERA

var popover = new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
 var options = {
     quality         : 50,
     destinationType : Camera.DestinationType.DATA_URL,
     sourceType      : Camera.PictureSource.SAVEDPHOTOALBUM,
     popoverOptions  : popover
 };

 

 function onSuccess(foto) {
 /*    var image = document.getElementById('exibeFoto');
     image.src =  imageData;*/
	   $("#exibeFoto").attr('src',foto);
	 localStorage.setItem('foto',foto);
    nomeFoto();	
	  $("#pub").hide();
    $("#foto").show();
 }

 function onFail(message) {
     alert('Failed because: ' + message);
 }
 
function fazFoto(){
navigator.camera.getPicture(onSuccess, onFail, options);}
//FIM FOTO CÂMERA

/*
function fazFoto(){
    
var popover = new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
 var options = {
     quality         : 50,
     destinationType : Camera.DestinationType.DATA_URL,
     sourceType      : Camera.PictureSource.SAVEDPHOTOALBUM,
     popoverOptions  : popover
 };
          
			  
              
}

         
   
            
function fotoSucesso(foto) {
    $("#pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    localStorage.setItem('foto',foto);
    nomeFoto();	
            
}
            
function fotoErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a câmera! Tente Novamente!','','Erro'+e);
}
*/
function abrirGaleria(){
            
    var opFoto = {
    quality:50,
    sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType:Camera.DestinationType.FILE_URI,
    mediaType:Camera.MediaType.PICTURE
    }
            
    navigator.camera.getPicture(galeriaSucesso,galeriaErro, opFoto);
}
            
            
function galeriaSucesso(foto){
    $("#exibeFoto").attr('src', foto);
    $("#pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    
    localStorage.setItem('foto',foto);
    nomeFoto();	    
  

}
            
function galeriaErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}


function nomeFoto() {
    var letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var nomeFoto = '';
    for (var i = 0; i < 55; i++) {
        var rnum = Math.floor(Math.random() * letras.length);
        nomeFoto += letras.substring(rnum, rnum + 1);
    }

    localStorage.setItem('nomeFoto',nomeFoto+'.jpg');

	
}


function upload(){
 
 var foto = localStorage.getItem('foto');   
 var nomeFoto = localStorage.getItem('nomeFoto');
 var cod = localStorage.getItem('Cod');
    
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = nomeFoto;
 options.mimeType = "image/jpeg";
    
 var params = new Object();
 params.value1 = $("#comentario").val();
 params.value2 = cod;
 options.params = params;
 options.chunkedMode = false;

var ft = new FileTransfer();
 ft.upload(foto, "http://sistemerc.freetzi.com/publica.php", function(){
     $("#foto").hide();
     publicacoes();
 }, function(){
 
     navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');
            
 }, options);
}


function excluir(id){
	//navigator.notification.alert("atenção","","Teste"+id);
	
    localStorage.setItem('excluir',id);
    
    navigator.notification.confirm(
    'Excluir a Publicação?',
    respostaExc,
    'Exclusão',
    ['Não','Sim']
    )
	
	
	
	
}



    
function respostaExc(r){  
    
    if (r==2) {
    
        var registro = localStorage.getItem('excluir');
        
    $.ajax({
        url:'http://sistemerc.freetzi.com/excluir.php',
        dataType:'json',
        type:'POST',
        data:{id:registro},
        success:function(resposta){
            navigator.notification.alert('Publicação excluída com sucesso!!','','Mensagem');
            localStorage.removeItem('excluir');
            publicacoes();
        },
        error: function(){
            navigator.notification.alert('Houve um erro ao tentar excluir! Tente Novamente!','','Erro');
        }
        
    })
        
    }
}


function cadastro(){
    $("#logon").hide();
    $("#cabecalho").show();
    $("#novocadastro").show();
    
}


function fotoPerfil(){
    
    var opFoto = {
    quality:50,
    sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType:Camera.DestinationType.FILE_URI,
    mediaType:Camera.MediaType.PICTURE
    }
            
    navigator.camera.getPicture(perfilSucesso,perfilErro, opFoto);
}
    

function perfilSucesso(foto){
    localStorage.setItem('foto',foto);
    $("#fotoPerfil").html("<img src='" + foto + "' width=150px height=150px>");
    nomeFoto();	
            
}
            
function perfilErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}


function cadastraUsuario(){
    
    var foto = localStorage.getItem('foto');
    
    
    if($("#cad_nome").val()=="" || $("#cad_email").val()=="" ||  $("#cad_senha").val()=="" || foto==null) {
        
        navigator.notification.alert('Campos nulo','','Erro');
    }else {
        
         var nomeFoto = localStorage.getItem('nomeFoto');
         

         var options = new FileUploadOptions();
         options.fileKey = "file";
         options.fileName = nomeFoto;
         options.mimeType = "image/jpeg";

         var params = new Object();
         params.value1 = $("#cad_nome").val();
         params.value2 = $("#cad_email").val();
         params.value3 = $("#cad_senha").val();
         options.params = params;
         options.chunkedMode = false;

        var ft = new FileTransfer();
         ft.upload(foto, "http://sistemerc.freetzi.com/inserirUser.php", function(){
             
             navigator.notification.alert('Cadastro efetuado com sucesso!!','','Mensagem');
             
             $("#novocadastro").hide();
             $("#logon").show();
             localStorage.removeItem('nomeFoto');
             localStorage.removeItem('foto');
         }, function(){

             navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');

         }, options);
        }
        
}


function sair(){
    
    navigator.notification.confirm(
    'Deseja sair?',
    respostaSair,
    'Sair',
    ['Não','Sim']
    )
    
}


function respostaSair(r){
    
    if (r==2) {
        
        localStorage.clear();
        $("#pub").hide();
        $("#user").hide();
        $("#cabecalho").hide();
        $("#logon").show();
		 $("#exibeFoto").hide();
    }
    
}

