//LAB3
var listeFilms = null;

function chargerDonnees(){
    $.ajax({
        url:"/data/movies.xml",
        type:"GET",
        dataType:"xml",
        success: function(response){
            listeFilms = response;
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(errorThrown);
        }
    });
}

chargerDonnees();



/// LAB2

// let APIKEY = f995e37aba4da33d485f87e41759bcc6

let statut = "disc";
let admin = false;
let films = [];

let panierDeFilms = [];

function showTrailer(){
    element = event.target;
    let idMovie = element.parentElement.getAttribute('movieID');
    let url = "https://api.themoviedb.org/3/movie/" + idMovie + "?api_key=f995e37aba4da33d485f87e41759bcc6&language=en-US&append_to_response=videos";
    let action = function(){
        let movieData = JSON.parse(this.response);
        let title = document.getElementById('trailerTitle');
        title.innerHTML = 'Bande-Annonce - ' + movieData["title"];
        let trailer = document.getElementById('trailer');
        trailer.setAttribute('src', 'https://www.youtube.com/embed/' + movieData["videos"]["results"][0]["key"]);
    }
    processURL(url, action);
}

function commanderPanier(){
    panierDeFilms.forEach(element => {
        films.push(element);
    });
    viderPanier();
}

function viderPanier(){
    tableFilms = document.getElementById('tableFilms');
    while(tableFilms.hasChildNodes()){
        tableFilms.removeChild(tableFilms.firstChild);
    }
    panierDeFilms = [];
}

function deleteMovie(){
    element = event.target;
    row = element.parentElement;
    let idToRemove = row.firstChild.innerHTML;
    let index = panierDeFilms.indexOf(idToRemove);
    if (index > -1){
        panierDeFilms.splice(index, 1);
    }
    updatePanier();

}

function updatePanier(){
    
    tableFilms = document.getElementById('tableFilms');
    while(tableFilms.hasChildNodes()){
        tableFilms.removeChild(tableFilms.firstChild);
    }
    panierDeFilms.forEach(element => {
        
        url = "https://api.themoviedb.org/3/movie/" + element + "?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA";
        action = function(){
            let movieData = JSON.parse(this.response);
            let row = document.createElement('tr');
            let id = document.createElement('th');
            id.setAttribute('scope', 'row');
            id.innerHTML = movieData['id'];
            row.appendChild(id);
            let titre = document.createElement('td');
            titre.innerHTML = movieData["title"];
            row.appendChild(titre);
            let genre = document.createElement('td');
            genre.innerHTML = movieData["genres"][0]["name"];
            row.appendChild(genre);
            let date = document.createElement('td');
            date.innerHTML = movieData["release_date"];
            row.appendChild(date);
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn');
            deleteButton.classList.add('btn-danger');
            deleteButton.setAttribute('type', 'button');
            deleteButton.addEventListener('click', deleteMovie);
            deleteButton.innerHTML = "Supprimer";
            deleteButton.style.margin = "10px"
            row.appendChild(deleteButton);
            tableFilms.appendChild(row);
        }
        processURL(url, action);
    });
    
}

function addMovie(){
    element = event.target;
    movieID = element.parentElement.parentElement.getAttribute('movieID');
    panierDeFilms.push(movieID);
    updatePanier();
    alert('Le film a bien été ajouté à votre panier !');
}

function montrer(id){
    let element = document.getElementById(id);
    element.classList.remove('d-none');
}

function cacher(id){
    let element = document.getElementById(id);
    element.classList.add('d-none');
}

function connectMember(){
    statut = "conn";
    montrer('myMovies');
    cacher('subscribe');
    montrer('panier');
    cacher('connect');
    montrer('disconnect');
    showAllMovies();
    if (admin){
        cacher('myMovies');
        cacher('panier');
        cacher('navbarDropdown');
        montrer('addMovie');
    }
}
///




// LAB3

function updateMovie(){
    if (document.getElementById('modifTitre').value != "" &
    document.getElementById('modifID').value != "" &
    document.getElementById('modifImage').value != "" &
    document.getElementById('modifDate').value != ""){
        cacher('alertModif');
        $('#modalModif').modal('hide');
        //
        let results = listeFilms.getElementsByTagName("results");
        let elementToUpdate = null;
        let idToUpdate = document.getElementById('modifID').value;
        for (let x = 0;x < results.length;x++){
            if (results[x].getElementsByTagName('id')[0].firstChild.nodeValue == idToUpdate){
                 elementToUpdate = results[x];
            }
        }
        elementToUpdate.getElementsByTagName('title')[0].firstChild.nodeValue = document.getElementById('modifTitre').value;
        elementToUpdate.getElementsByTagName('poster_path')[0].firstChild.nodeValue = document.getElementById('modifImage').value;
        elementToUpdate.getElementsByTagName('release_date')[0].firstChild.nodeValue = document.getElementById('modifDate').value;
        if (elementToUpdate.getElementsByTagName('overview')[0].firstChild != null){
            elementToUpdate.getElementsByTagName('overview')[0].firstChild.nodeValue = document.getElementById('modifResume').value;
        }else{
            text = document.createTextNode(document.getElementById('modifResume').value);
            elementToUpdate.getElementsByTagName('overview')[0].appendChild(text);
        }

        showAllMovies();
   
        document.getElementById('modifID').disabled = false;


    }else{
        montrer('alertModif');
    }
}

function addMovieToXML(){
    if (document.getElementById('ajoutTitre').value != "" &
    document.getElementById('ajoutID').value != "" &
    document.getElementById('ajoutImage').value != "" &
    document.getElementById('ajoutDate').value != ""){
        cacher('alertAjout');
        $('#modalAjout').modal('hide');
        //
        newMovie = document.createElement('results');
        
        node = document.createElement('title');
        text = document.createTextNode(document.getElementById('ajoutTitre').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        node = document.createElement('id');
        text = document.createTextNode(document.getElementById('ajoutID').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        node = document.createElement('poster_path');
        text = document.createTextNode(document.getElementById('ajoutImage').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        node = document.createElement('backdrop_path');
        text = document.createTextNode(document.getElementById('ajoutImage').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        node = document.createElement('release_date');
        text = document.createTextNode(document.getElementById('ajoutDate').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        node = document.createElement('overview');
        text = document.createTextNode(document.getElementById('ajoutResume').value);
        node.appendChild(text);
        newMovie.appendChild(node);

        listeFilms.firstChild.appendChild(newMovie);

        showAllMovies();

        




    }else{
        montrer('alertAjout');
    }

}

function removeMovie(){
    let element = event.target;
    let idToDelete = element.parentElement.parentElement.getAttribute('movieID');
    let results = listeFilms.getElementsByTagName("results");
    let elementToDelete = null;
    for (let x = 0;x < results.length;x++){
        if (results[x].getElementsByTagName('id')[0].firstChild.nodeValue == idToDelete){
            elementToDelete = results[x];
            elementToDelete.parentElement.removeChild(elementToDelete);
        }
    }
    showAllMovies();
}

function showAllMovies(){
    clearMovies();
    let results = listeFilms.getElementsByTagName("results");
    Array.from(results).forEach(element => {
        let card = document.createElement('div');
        card.classList.add('card');
        let att = document.createAttribute('movieID');
        att.value = element.getElementsByTagName('id')[0].firstChild.nodeValue;
        card.setAttributeNode(att);
        let img = document.createElement('img');
        img.classList.add('card-img-top');
        img.alt = element.getElementsByTagName('backdrop_path')[0].firstChild.nodeValue;
        if (element.getElementsByTagName('poster_path')[0].firstChild.nodeValue.includes('http')){
            img.src = element.getElementsByTagName('poster_path')[0].firstChild.nodeValue;
        }else{
            img.src = "https://image.tmdb.org/t/p/w500/" + element.getElementsByTagName('poster_path')[0].firstChild.nodeValue.substring(1);
        }
        img.setAttribute('data-toggle', 'modal');
        img.setAttribute('data-target', '#modalTrailer');
        img.addEventListener('click', showTrailer);
        card.appendChild(img);
        let cardbody = document.createElement('div');
        cardbody.classList.add('card-body');
        cardbody.classList.add('d-flex');
        cardbody.classList.add('flex-column');
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = element.getElementsByTagName('title')[0].firstChild.nodeValue;
        cardbody.appendChild(title);
        let desc = document.createElement('p');
        desc.classList.add('card-text');
        let description = "";
        if (element.getElementsByTagName('overview')[0].firstChild != null){
            description = element.getElementsByTagName('overview')[0].firstChild.nodeValue;
        }
        desc.innerHTML = description;
        cardbody.appendChild(desc);
        let date = document.createElement('p');
        date.classList.add('card-text');
        let datetext = document.createElement('small');
        datetext.classList.add('text-muted');
        datetext.innerHTML = "Date de sortie : " + element.getElementsByTagName('release_date')[0].firstChild.nodeValue;
        date.appendChild(datetext);
        cardbody.appendChild(date);
        if (statut == "conn" & !admin){
            let button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-success');
            button.classList.add('mt-auto');
            button.type = "button";
            button.innerHTML = "Ajouter au panier";
            button.addEventListener('click', addMovie);
            cardbody.appendChild(button);
        }
        if(admin){
            let button2 = document.createElement('button');
            button2.classList.add('btn');
            button2.classList.add('btn-info');
            button2.classList.add('mb-1');
            button2.classList.add('mt-auto');
            button2.type = "button";
            button2.innerHTML = "Modifier le film";
            button2.addEventListener('click', montrerModif);
            cardbody.appendChild(button2);
            //
            let button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-danger');
            button.type = "button";
            button.innerHTML = "Supprimer le film";
            button.addEventListener('click', removeMovie);
            cardbody.appendChild(button);
            
        }
        card.appendChild(cardbody);
        let container = document.getElementById('deck');
        container.appendChild(card);
        
    });
}

function montrerModif(){
    let element = event.target;
    let idToDelete = element.parentElement.parentElement.getAttribute('movieID');
    let results = listeFilms.getElementsByTagName("results");
    let elementToUpdate = null;
    for (let x = 0;x < results.length;x++){
        if (results[x].getElementsByTagName('id')[0].firstChild.nodeValue == idToDelete){
            elementToUpdate = results[x];
        }
    }
    document.getElementById('modifTitre').value = elementToUpdate.getElementsByTagName('title')[0].firstChild.nodeValue;
    document.getElementById('modifID').value = elementToUpdate.getElementsByTagName('id')[0].firstChild.nodeValue;
    document.getElementById('modifID').disabled = true;
    document.getElementById('modifImage').value = elementToUpdate.getElementsByTagName('poster_path')[0].firstChild.nodeValue;
    document.getElementById('modifDate').value = elementToUpdate.getElementsByTagName('release_date')[0].firstChild.nodeValue;
    if (elementToUpdate.getElementsByTagName('overview')[0].firstChild != null){
        document.getElementById('modifResume').value = elementToUpdate.getElementsByTagName('overview')[0].firstChild.nodeValue;
    }
    $('#modalModif').modal('toggle');
}




////////////////////////////////////////
function disconnect(){
    statut = "disc";
    cacher('myMovies');
    montrer('subscribe');
    cacher('panier');
    montrer('connect');
    cacher('disconnect');
    if (admin){
        admin = false;
        cacher('addMovie');
    }
    showAllMovies();
}

function vider(id){
    let element = document.getElementById(id);
    element.value = "";
}

function connexion(nom, mdp){
    
    let valide = false;
    let liste = JSON.parse(localStorage.getItem('listeMembres'));
    liste.forEach(element => {
        if ((element['nom'] == nom) & (element['mdp'] == mdp)){
            valide = true;
            if (nom == 'admin' & mdp == 'admin'){
                admin = true;
            }
        }
    });
    
    if (valide == true){
        connectMember();
        $('#exampleModalCenter2').modal('hide');
        cacher('alert');
        vider('username');
        vider('password');
    }else{
        montrer('alert');
    }
}

let listeMembres = JSON.stringify([{nom:'admin', mdp:'admin'}])
localStorage.setItem('listeMembres', listeMembres);

function addMembre(nom, mdp) {
    
    if (nom == "" || mdp == ""){
        montrer('alertSub');
    }else{
        let liste = JSON.parse(localStorage.getItem('listeMembres'));
        let nouveauMembre = {nom:nom, mdp:mdp};
        liste.push(nouveauMembre);
        liste.forEach(element => {
            alert(element['nom']);
        });
        
        
        
        localStorage.setItem('listeMembres', JSON.stringify(liste));
        $('#exampleModalCenter1').modal('hide');
        cacher('alertSub');
    }
    
    
    
}

function getMembres(){
    let data = localStorage.getItem('listeMembres');
    return JSON.parse(data);
}





function clearMovies(){
    let deck = document.getElementById('deck');
    while(deck.hasChildNodes()){
        deck.removeChild(deck.firstChild);
    }
}

function supprimer(){
    element = event.target;
    let cardToDelete = element.parentElement.parentElement;
    let deck = document.getElementById('deck');
    let idToRemove = cardToDelete.getAttribute('movieID');
    let index = films.indexOf(idToRemove);
    if (index > -1){
        films.splice(index, 1);
    }
    deck.removeChild(cardToDelete);
}

function resetMovies(){
    
    clearMovies();
    films.forEach(element => {
        let url = "https://api.themoviedb.org/3/movie/" + element + "?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA";
        let action = function(){
            let movieData = JSON.parse(this.response);
            let card = document.createElement('div');
            card.classList.add('card');
            let att = document.createAttribute('movieID');
            att.value = movieData['id'];
            card.setAttributeNode(att);
            let img = document.createElement('img');
            img.classList.add('card-img-top');
            img.alt = movieData["backdrop_path"];
            img.src = "https://image.tmdb.org/t/p/w500/" + movieData["poster_path"].substring(1);
            
            img.setAttribute('data-toggle', 'modal');
            img.setAttribute('data-target', '#modalTrailer');
            img.addEventListener('click', showTrailer);
            card.appendChild(img);
            let cardbody = document.createElement('div');
            cardbody.classList.add('card-body');
            cardbody.classList.add('d-flex');
            cardbody.classList.add('flex-column');
            let title = document.createElement('h5');
            title.classList.add('card-title');
            title.innerHTML = movieData["title"];
            cardbody.appendChild(title);
            let desc = document.createElement('p');
            desc.classList.add('card-text');
            desc.innerHTML = movieData["overview"];
            cardbody.appendChild(desc);
            let date = document.createElement('p');
            date.classList.add('card-text');
            let datetext = document.createElement('small');
            datetext.classList.add('text-muted');
            datetext.innerHTML = "Date de sortie : " + movieData["release_date"];
            date.appendChild(datetext);
            cardbody.appendChild(date);
            if (statut == "conn"){
                let button = document.createElement('button');
                button.classList.add('btn');
                button.classList.add('btn-danger');
                button.classList.add('mt-auto');
                button.type = "button";
                button.innerHTML = "Supprimer";
                button.addEventListener('click', supprimer);
                cardbody.appendChild(button);
            }
            card.appendChild(cardbody);
            let container = document.getElementById('deck');
            container.appendChild(card);
        }
        processURL(url, action);
    });
    
}

function updateMovies(){
    
    clearMovies();
    let element = event.target;
    processURL('https://api.themoviedb.org/3/discover/movie?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=' + element.getAttribute('idgenre'), instructions2);
    
}

function processURL(url, instructions){
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = instructions;
    request.send();
}

let url1 = "https://api.themoviedb.org/3/genre/movie/list?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA";
instructions1 = function(){
    let data = JSON.parse(this.response);
    
    let genres = data["genres"];
    genres.forEach(element => {
        
        let a = document.createElement('a');
        a.href = "#";
        a.innerHTML = element["name"];
        a.setAttribute('class', "dropdown-item");
        a.addEventListener('click', updateMovies);
        let att = document.createAttribute('idgenre');
        att.value = element["id"];
        a.setAttributeNode(att);
        
        document.getElementById('dropdown').appendChild(a);
    });
    
}

let request1 = [url1, instructions1];




let url2 = "https://api.themoviedb.org/3/discover/movie?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
instructions2 = function(){
    let moviesData = JSON.parse(this.response);
    let results = moviesData["results"];
    results.forEach(element => {
        let card = document.createElement('div');
        card.classList.add('card');
        let att = document.createAttribute('movieID');
        att.value = element['id'];
        card.setAttributeNode(att);
        let img = document.createElement('img');
        img.classList.add('card-img-top');
        img.alt = element["backdrop_path"];
        img.src = "https://image.tmdb.org/t/p/w500/" + element["poster_path"].substring(1);
        img.setAttribute('data-toggle', 'modal');
        img.setAttribute('data-target', '#modalTrailer');
        img.addEventListener('click', showTrailer);
        card.appendChild(img);
        let cardbody = document.createElement('div');
        cardbody.classList.add('card-body');
        cardbody.classList.add('d-flex');
        cardbody.classList.add('flex-column');
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = element["title"];
        cardbody.appendChild(title);
        let desc = document.createElement('p');
        desc.classList.add('card-text');
        desc.innerHTML = element["overview"];
        cardbody.appendChild(desc);
        let date = document.createElement('p');
        date.classList.add('card-text');
        let datetext = document.createElement('small');
        datetext.classList.add('text-muted');
        datetext.innerHTML = "Date de sortie : " + element["release_date"];
        date.appendChild(datetext);
        cardbody.appendChild(date);
        if (statut == "conn"){
            let button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-success');
            button.classList.add('mt-auto');
            button.type = "button";
            button.innerHTML = "Ajouter au panier";
            button.addEventListener('click', addMovie);
            cardbody.appendChild(button);
        }
        card.appendChild(cardbody);
        let container = document.getElementById('deck');
        container.appendChild(card);
        
    });
    
}

let request2 = [url2, instructions2]

let requests = [request1, request2];


requests.forEach(element => {
processURL(element[0], element[1]);});














