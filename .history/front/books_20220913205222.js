const ENDPOINT = "http://localhost:3000";

const getCategories = () =>{
    return axios.get(`${ENDPOINT}/categories`);
}

const getPublishes = () =>{
    return axios.get(`${ENDPOINT}/publishers`);
}

const getFormat = () =>{
    return axios.get(`${ENDPOINT}/formats`);
}

const loadTable = () => {

    axios.get(`${ENDPOINT}/books`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>';
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.pages + '</td>';
                    trHTML += '<td>' + '$' + element.value + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.Publishing.name + '</td>';
                    trHTML += '<td>' + element.Format.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBooksEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="booksDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const findResults = () =>{
    const text = document.querySelector('#search');
    const title = text.value.toLowerCase().replace(" " || "-", "%20");
    console.log(title+'%');
        axios.get(`${ENDPOINT}/books?title=${title}`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    var trHTML = '';
                    data.forEach(element => {
                        trHTML += '<tr>';
                        trHTML += '<td>' + element.id + '</td>';
                        trHTML += '<td>' + element.title + '</td>';
                        trHTML += '<td>' + element.author + '</td>';
                        trHTML += '<td>' + element.publication_year + '</td>';
                        trHTML += '<td>' + element.pages + '</td>';
                        trHTML += '<td>' + '$' + element.value + '</td>';
                        trHTML += '<td>' + element.Category.description + '</td>';
                        trHTML += '<td>' + element.Publishing.name + '</td>';
                        trHTML += '<td>' + element.Format.description + '</td>';
                        trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBooksEditBox(' + element.id + ')">Edit</button>';
                        trHTML += '<button type="button" class="btn btn-outline-danger" onclick="booksDelete(' + element.id + ')">Del</button></td>';
                        trHTML += "</tr>";
                    });
                    document.getElementById("mytable").innerHTML = trHTML;
                }
            })
    };
    loadTable();

const orderTitle = () =>{
    const param = document.querySelector('select');
        axios.get(`${ENDPOINT}/books?sort=${param}`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    var trHTML = '';
                    data.forEach(element => {
                        trHTML += '<tr>';
                        trHTML += '<td>' + element.id + '</td>';
                        trHTML += '<td>' + element.title + '</td>';
                        trHTML += '<td>' + element.author + '</td>';
                        trHTML += '<td>' + element.publication_year + '</td>';
                        trHTML += '<td>' + element.pages + '</td>';
                        trHTML += '<td>' + '$' + element.value + '</td>';
                        trHTML += '<td>' + element.Category.description + '</td>';
                        trHTML += '<td>' + element.Publishing.name + '</td>';
                        trHTML += '<td>' + element.Format.description + '</td>';
                        trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBooksEditBox(' + element.id + ')">Edit</button>';
                        trHTML += '<button type="button" class="btn btn-outline-danger" onclick="booksDelete(' + element.id + ')">Del</button></td>';
                        trHTML += "</tr>";
                    });
                    document.getElementById("mytable").innerHTML = trHTML;
                }
            })
    };
    loadTable();

const booksCreate = () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("value").value;
    const categories_id = document.getElementById("categories_id").value;
    const publishers_id = document.getElementById("publishers_id").value;
    const format_id = document.getElementById("format_Id").value;

    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        value: value,
        CategoryId: categories_id,
        PublishingId: publishers_id,
        FormatId: format_id
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create book: ${error.response.data.error} `)
                .then(() => {
                    showBooksCreateBox();
                })
        });
}

const getBooks = (id) => {
    return axios.get(`${ENDPOINT}/books/` + id);
}

const booksEdit = () => {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("value").value;
    const categories_id = document.getElementById("categories_id").value;
    const publishers_id = document.getElementById("publishers_id").value;
    const format_id = document.getElementById("format_Id").value;

    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        value: value,
        CategoryId: categories_id,
        PublishingId: publishers_id,
        FormatId: format_id
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update book: ${error.response.data.error} `)
                .then(() => {
                    showBooksEditBox(id);
                })
        });
}

const booksDelete = async (id) => {
    const book = await getBooks(id);
    const data = book.data;
    axios.delete(`${ENDPOINT}/books/` + id)
        .then((response) => {
            Swal.fire(`Book ${data.title} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete book: ${error.response.data.error} `);
            loadTable();
        });
};

const createCategoryCombo = async (id) =>{
    const category = await getCategories();
    const data = category.data;
    let select = '<select class="swal2-input" id="categories_id">';
    
    select += `<option value = "0" selected disabled>Select a Category</option>`
    for(let i = 0; i < data.length; i++){
        const element =  data[i];
        if( id === element.id){
            select += `<option value="${element.id}" selected>${element.description}</option>`
        }else{
            select += `<option value ="${element.id}">${element.description}</option>`
        }
    }
    select += '</select>';
    return select;
}

const createPublishersCombo = async (id) =>{
    const publishing = await getPublishes();
    const data = publishing.data;
    let select = '<select class="swal2-input" id="publishers_id">';
    
    select += `<option value = "0" selected disabled>Select a Publishing</option>`
    for(let i = 0; i < data.length; i++){
        const element =  data[i];
        if( id === element.id){
            select += `<option value="${element.id}" selected>${element.name}</option>`
        }else{
            select += `<option value ="${element.id}">${element.name}</option>`
        }
    }
    select += '</select>';
    return select;
}

const createFormatCombo = async (id) =>{
    const format = await getFormat();
    const data = format.data;
    let select = '<select class="swal2-input" id="format_Id">';
    
    for(let i = 0; i < data.length; i++){
        const element =  data[i];
        if (id = ""){
            select += `<option value = "0" selected disabled>Select a Format</option>`
        }
        if( id === element.id){
            select += `<option value="${element.id}" selected>${element.description}</option>`
        }else{
            select += `<option value ="${element.id}">${element.description}</option>`
        }
    }
    select += '</select>';
    return select;
}

const createFindCategoryCombo = async (id) =>{
    const format = await getFormat();
    const data = format.data;
    let select = '<select class="swal2-input" id="format_Id">';
    
    for(let i = 0; i < data.length; i++){
        const element =  data[i];
        if (id = ""){
            select += `<option value = "0" selected disabled>Select a Format</option>`
        }
        if( id === element.id){
            select += `<option value="${element.id}" selected>${element.description}</option>`
        }else{
            select += `<option value ="${element.id}">${element.description}</option>`
        }
    }
    select += '</select>';
    const html = document.querySelector('.testar');
    html.innerHTML = select;
}


const showBooksCreateBox = async () => {
    const category = await createCategoryCombo();
    const publishing = await createPublishersCombo();
    const format = await createFormatCombo();
    Swal.fire({
        title: 'Create book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Name">' +
            '<input id="author" class="swal2-input" placeholder="author">'+
            '<input id="publication_year" class="swal2-input" placeholder="publication_year">'+
            '<input id="pages" class="swal2-input" placeholder="pages">'+
            '<input id="value" class="swal2-input" placeholder="value">'+
            category+
            publishing+
            format,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            booksCreate();
        }
    });
}

const showBooksEditBox = async (id) => {
    const category = await createCategoryCombo();
    const publishing = await createPublishersCombo();
    const format = await createFormatCombo(id);
    const book = await getBooks(id);
    const data = book.data;
    Swal.fire({
        title: 'Edit book',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="title" class="swal2-input" placeholder="Name" value="' + data.title + '">' +
            '<input id="author" class="swal2-input" placeholder="author" value="' + data.author + '">'+
            '<input id="publication_year" class="swal2-input" placeholder="publication_year" value="' + data.publication_year +'">'+
            '<input id="pages" class="swal2-input" placeholder="pages" value="' + data.pages +'">'+
            '<input id="value" class="swal2-input" placeholder="value" value="' + data.value +'">'+
            category+
            publishing+
            format,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            booksEdit();
        }
    });

}
