const botaoSalvar = document.getElementById('salvar');

const getDadosForm = function () {
    let contatoJSON = {};
    let status = true;

    let nomeContato = document.getElementById('nome');
    let telefoneContato = document.getElementById('telefone');
    let emailContato = document.getElementById('email');
    let imagemContato = document.getElementById('imagem');

    if (
        nomeContato.value === '' ||
        telefoneContato.value === '' ||
        emailContato.value === '' ||
        imagemContato.value === ''
    ) {
        alert('Todos os campos devem ser preenchidos.');
        status = false;
    } else {
        contatoJSON.nome = nomeContato.value;
        contatoJSON.telefone = telefoneContato.value;
        contatoJSON.email = emailContato.value;
        contatoJSON.image = imagemContato.value;
    }

    return contatoJSON
};

async function postContato() {
      try {
        const response = await fetch(`https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/novo/contato/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');

        const dados = await response.json();

        document.getElementById('nome').textContent = `Nome: ${dados.nome}`;
        document.getElementById('telefone').textContent = `Telefone: ${dados.telefone}`;
        document.getElementById('email').textContent = `Email: ${dados.email}`;
        document.getElementById('image').src = dados.image;
      } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
      }
    }

    document.getElementById('salvar').addEventListener('click', postContato);

const putContato = async function (contatos) {
    let id = sessionStorage.getItem('idContato');
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/atualizar/contato/${id}`;

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contatos),
    });

    

    if (response.status === 200) {
        alert('Contato atualizado com sucesso.');
        getContatos();
    } else {
        alert('Não foi possível atualizar o contato. Verifique os dados enviados.');
    }
};

const deleteContato = async function (id) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/excluir/contato/${id}`;

    let response = await fetch(url, {
        method: 'DELETE',
    });

    if (response.status === 200) {
        alert('Contato excluído com sucesso!');
        getContatos();
    } else {
        alert('Não foi possível excluir o contato.');
    }
};

const getContatos = async function () {
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/listar/contatos';

    let response = await fetch(url);
    let dados = await response.json();

    if (response.status === 200) {
        setCardItens(dados.contatos);
    } else {
        console.error('Erro ao carregar contatos:', dados);
    }
};

const setCardItens = function (contatos) {
    let divListDados = document.getElementById('listDados');
    divListDados.innerHTML = '';

    contatos.forEach(function (contato) {
        let divDados = document.createElement('div');
        let divNome = document.createElement('div');
        let divTelefone = document.createElement('div');
        let divEmail = document.createElement('div');
        let divImagem = document.createElement('div');
        let divOpcoes = document.createElement('div');
        let imgEditar = document.createElement('img');
        let imgExcluir = document.createElement('img');

        divNome.textContent = contato.nome;
        divTelefone.textContent = contato.telefone;
        divEmail.textContent = contato.email;

        let img = document.createElement('img');
        img.src = contato.image;
        img.alt = contato.nome;
        img.style.maxWidth = '50px';
        divImagem.appendChild(img);

        divDados.className = 'linha dados';
        imgEditar.src = 'icones/editar.png';
        imgExcluir.src = 'icones/excluir.png';

        imgEditar.setAttribute('idContato', contato.id);
        imgExcluir.setAttribute('idContato', contato.id);

        divDados.appendChild(divNome);
        divDados.appendChild(divTelefone);
        divDados.appendChild(divEmail);
        divDados.appendChild(divImagem);
        divDados.appendChild(divOpcoes);
        divOpcoes.appendChild(imgEditar);
        divOpcoes.appendChild(imgExcluir);

        divListDados.appendChild(divDados);

        imgExcluir.addEventListener('click', function () {
            let id = imgExcluir.getAttribute('idContato');
            if (confirm('Deseja realmente excluir este contato?')) {
                deleteContato(id);
            }
        });

        imgEditar.addEventListener('click', function () {
            let id = imgEditar.getAttribute('idContato');
            console.log('ID do contato para editar:', id);
            getBuscarContato(id);
        });
        
    });
};

const getBuscarContato = async function (id) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/buscar/contato/${id}`;
    let response = await fetch(url);
    let dados = await response.json();

    if (response.status === 200) {
        document.getElementById('nome').value = dados.nome;
        document.getElementById('telefone').value = dados.telefone;
        document.getElementById('imagem').value = dados.image;
        document.getElementById('email').value = dados.email;

        document.getElementById('salvar').innerText = 'Atualizar';
        sessionStorage.setItem('idContato', id);

        console.log('Resposta da API:', dados);
    }
};


botaoSalvar.addEventListener('click', function () {
    let dados = getDadosForm();

    if (dados) {
        if (botaoSalvar.innerText === 'Salvar') {
            postContato(dados);
        } else if (botaoSalvar.innerText === 'Atualizar') {
            putContato(dados);
        }
    }
});

window.addEventListener('load', function () {
    getContatos();
});
