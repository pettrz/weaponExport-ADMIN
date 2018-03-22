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
        viewModel.title('');
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
    title: ko.observable(''),
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
            '&title=' + viewModel.title() +
            '&collection=' + viewModel.collection() +

            console.log('success')
        )
    }
    else {
        console.log('error');
        document.getElementById('fillTextbox').innerHTML = 'Fill in textbox';
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

$(document).ready(function() {
    var max_links      = 100; 
    var wrapper         = $("#card-wrapper"); 
    var add_button      = $("#buttonAdd"); 
    
    var x = 1; 
    $(add_button).click(function(e){
        e.preventDefault();
        if(x < max_links){ 
            x++; 
            $(wrapper).append('<div class="card"><div class="card-header" style="text-align: center;">Länk 1</div><ul class="list-group list-group-flush"><li class="list-group-item"><input class="form-control" type="text" placeholder="Titel" data-bind="value: title" /></li><li class="list-group-item"><input class="form-control" type="text" placeholder="Länk" data-bind="value: links" /></li></ul></div>');
        }
    });
});


