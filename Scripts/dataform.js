var xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('confirm').innerHTML = 'Submitted!';
        viewModel.country('');
        viewModel.code('');
        viewModel.weapons('');
        viewModel.info('');
        viewModel.links('');
        viewModel.collection('EU');
     }
}



var viewModel = {
    country: ko.observable(''),
    code: ko.observable(''),
    weapons: ko.observable(''),
    info: ko.observable(''),
    links: ko.observable(''),
    collection: ko.observable('EU'),
    postCountry: () => {
        console.log(prepCountry());
        //xhttp.send(prepCountry());
    },
}

ko.applyBindings(viewModel);

var prepCountry = () => {
    return (
        'country=' + viewModel.country() +
        '&code=' + viewModel.code() +
        '&weapons=' + viewModel.weapons() +
        '&info=' + viewModel.info() +
        '&links=' + viewModel.links() +
        '&collection=' + viewModel.collection()
    )
    
    // return {
    //     country: viewModel.country(),
    //     code: viewModel.code(),
    //     weapons: viewModel.weapons(),
    //     info: viewModel.info(),
    //     links: viewModel.links(),
    //     collection: viewModel.collection(),
    // }
}