// Função para carregar os usuários do LocalStorage
function carregarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const tabela = document.getElementById('listaUsuarios');
    tabela.innerHTML = ''; // Limpa a tabela antes de renderizar
    usuarios.forEach((usuario, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.quantidade}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editarUsuario(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                <button class="delete-btn" onclick="excluirUsuario(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para salvar um novo usuário
function salvarUsuario(nome, quantidade, descricao) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push({ nome, quantidade, descricao });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    carregarUsuarios();
}

// Função para editar um usuário
function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios[index];
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('quantidade').value = usuario.quantidade;

    // Atualiza o botão de cadastro para salvar a edição
    const form = document.getElementById('formCadastro');
    form.removeEventListener('submit', adicionarUsuario);
    form.addEventListener('submit', function salvarEdicao(e) {
        e.preventDefault();
        usuario.nome = document.getElementById('nome').value.trim();
        usuario.quantidade = document.getElementById('quantidade').value.trim();
        usuario.descricao = document.getElementById('descricao').value.trim();
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        carregarUsuarios();
        form.reset();
        form.removeEventListener('submit', salvarEdicao);
        form.addEventListener('submit', adicionarUsuario); // Volta ao comportamento padrão
    });
}

// Função para excluir um usuário
function excluirUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.splice(index, 1); // Remove o usuário pelo índice
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    carregarUsuarios();
}

// Lida com o envio do formulário para adicionar usuário
function adicionarUsuario(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    const nome = document.getElementById('nome').value.trim();
    const quantidade = document.getElementById('quantidade').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if (nome && quantidade && descricao) {
        salvarUsuario(nome, quantidade, descricao);
        document.getElementById('formCadastro').reset(); // Limpa o formulário
    }
}

// Configurações iniciais
document.getElementById('formCadastro').addEventListener('submit', adicionarUsuario);
carregarUsuarios();
