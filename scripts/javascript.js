

// let APIKEY = f995e37aba4da33d485f87e41759bcc6

let statut = "disc";

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

function updatePanier(){
    
    tableFilms = document.getElementById('tableFilms');
    while(tableFilms.hasChildNodes()){
        tableFilms.removeChild(tableFilms.firstChild);
    }
    let i = 1;
    panierDeFilms.forEach(element => {
        
        url = "https://api.themoviedb.org/3/movie/" + element + "?api_key=f995e37aba4da33d485f87e41759bcc6&language=fr-CA";
        action = function(){
            let movieData = JSON.parse(this.response);
            let row = document.createElement('tr');
            let no = document.createElement('th');
            no.setAttribute('scope', 'row');
            no.innerHTML = "" + i;
            row.appendChild(no);
            let titre = document.createElement('td');
            titre.innerHTML = movieData["title"];
            row.appendChild(titre);
            let genre = document.createElement('td');
            genre.innerHTML = movieData["genres"][0]["name"];
            row.appendChild(genre);
            let date = document.createElement('td');
            date.innerHTML = movieData["release_date"];
            row.appendChild(date);
            tableFilms.appendChild(row);
            i++;
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
    clearMovies();
    processURL(url2, instructions2);
}

function showAllMovies(){
    clearMovies();
    processURL(url2, instructions2);
}

function disconnect(){
    statut = "disc";
    cacher('myMovies');
    montrer('subscribe');
    cacher('panier');
    montrer('connect');
    cacher('disconnect');
    clearMovies();
    processURL(url2, instructions2);
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
    processURL(element[0], element[1]);
});












