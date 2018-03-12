var xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('confirm').innerHTML = 'Submitted!';
        viewModel.country('');
        viewModel.code('');
        viewModel.FHstatus('');
        viewModel.gpi('');
        viewModel.info('');
        viewModel.links('');
        viewModel.collection('EU');
     }
}

var viewModel = {
    country: ko.observable(''),
    code: ko.observable(''),
    FHstatus: ko.observable(''),
    gpi: ko.observable(''),
    info: ko.observable(''),
    links: ko.observable(''),
    collection: ko.observable('EU'),
    postCountry: () => {
        //xhttp.send()
        console.log(prepCountry());
    },
}

ko.applyBindings(viewModel);

var prepCountry = () => {

    if (viewModel.country() != "" && viewModel.code() != "" && viewModel.FHstatus() != "" && viewModel.gpi() != "" && viewModel.info() != "" && viewModel.links() != "") {
        return (
            'country=' + viewModel.country() +
            '&code=' + viewModel.code() +
            '&FHstatus=' + viewModel.FHstatus() +
            '&gpi=' + viewModel.gpi() +
            '&info=' + viewModel.info() +
            '&links=' + viewModel.links() +
            '&collection=' + viewModel.collection() +

            console.log('success')
        )
    }
    else {
        console.log('error');
        document.getElementById('demo').innerHTML = 'Fill in textbox';
    }
        
    // return {
    //     country: viewModel.country(),
    //     code: viewModel.code(),
    //     FHstatus: viewModel.FHstatus(),
    //     info: viewModel.info(),
    //     links: viewModel.links(),
    //     collection: viewModel.collection(),
    // }
}