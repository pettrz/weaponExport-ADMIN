var xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('confirm').innerHTML = 'Skickat';
        viewModel.country('');
        viewModel.code('');
        viewModel.FHstatus('');
        viewModel.gpi('');
        viewModel.info('');
        viewModel.links('');
        viewModel.Collection('EU');
     }
}

Collection = function(code, name){
    this.collectionCode = code;
    this.collectionName = name;
}

var viewModel = {
    country: ko.observable(''),
    code: ko.observable(''),
    FHstatus: ko.observable(''),
    gpi: ko.observable(''),
    info: ko.observable(''),
    links: ko.observable(''),
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection : ko.observable(''),
    postCountry: () => {
        //xhttp.send()
        console.log(prepCountry());
    },
}

ko.applyBindings(viewModel);

var prepCountry = () => {

    return {
        country: viewModel.country(),
        code: viewModel.code(),
        FHstatus: viewModel.FHstatus(),
        info: viewModel.info(),
        links: viewModel.links(),
        collection: viewModel.selectedCollection().collectionCode,
    }

    // if (viewModel.country() != "" && viewModel.code() != "" && viewModel.FHstatus() != "" && viewModel.gpi() != "" && viewModel.info() != "" && viewModel.links() != "") {
    //     console.log('success')
    //     return (
    //         'country=' + viewModel.country() +
    //         '&code=' + viewModel.code() +
    //         '&FHstatus=' + viewModel.FHstatus() +
    //         '&gpi=' + viewModel.gpi() +
    //         '&info=' + viewModel.info() +
    //         '&links=' + viewModel.links() +
    //         '&Collection=' + viewModel.Collection()
    //     )
    // }
    // else {
    //     console.log('error');
    //     document.getElementById('fillTextbox').innerHTML = 'Fill in textbox';
    // }
}