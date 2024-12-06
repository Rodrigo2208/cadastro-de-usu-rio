// Seleciona os elementos do DOM
const form = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productQuantityInput = document.getElementById('product-quantity');
const productDescriptionInput = document.getElementById('product-description');
const productTableBody = document.querySelector('#product-table tbody');

let editMode = false;
let currentEditRow = null;

// Recupera produtos do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', loadProductsFromStorage);

// Adiciona o evento de submissão do formulário
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obtém os valores do formulário
  const productName = productNameInput.value.trim();
  const productQuantity = parseInt(productQuantityInput.value.trim(), 10);
  const productDescription = productDescriptionInput.value.trim();

  if (!productName || isNaN(productQuantity) || productQuantity <= 0 || !productDescription) {
    alert('Por favor, preencha todos os campos corretamente!');
    return;
  }

  if (editMode) {
    // Atualiza a linha que está sendo editada
    currentEditRow.querySelector('.name').textContent = productName;
    currentEditRow.querySelector('.quantity').textContent = productQuantity;
    currentEditRow.querySelector('.description').textContent = productDescription;

    // Atualiza o produto no localStorage
    updateProductInStorage(currentEditRow.dataset.id, {
      name: productName,
      quantity: productQuantity,
      description: productDescription,
    });

    // Sai do modo de edição
    editMode = false;
    currentEditRow = null;
    form.reset();
    return;
  }

  // Cria um novo produto
  const newProduct = {
    id: Date.now().toString(),
    name: productName,
    quantity: productQuantity,
    description: productDescription,
  };

  // Adiciona o produto ao localStorage
  addProductToStorage(newProduct);

  // Adiciona o produto à tabela
  addProductToTable(newProduct);

  // Limpa os campos do formulário
  form.reset();
});

// Função para carregar produtos do localStorage
function loadProductsFromStorage() {
  const products = getProductsFromStorage();
  products.forEach(addProductToTable);
}

// Função para adicionar um produto à tabela
function addProductToTable(product) {
  const row = document.createElement('tr');
  row.dataset.id = product.id; // Armazena o ID do produto na linha
  row.innerHTML = `
    <td class="name">${product.name}</td>
    <td class="quantity">${product.quantity}</td>
    <td class="description">${product.description}</td>
    <td>
      <button class="edit-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
      <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    </td>
  `;

  // Adiciona eventos aos botões de edição e exclusão
  const editButton = row.querySelector('.edit-btn');
  const deleteButton = row.querySelector('.delete-btn');

  editButton.addEventListener('click', () => handleEdit(row));
  deleteButton.addEventListener('click', () => handleDelete(row));

  // Adiciona a linha à tabela
  productTableBody.appendChild(row);
}

// Função para editar um item
function handleEdit(row) {
  const id = row.dataset.id;
  const name = row.querySelector('.name').textContent;
  const quantity = parseInt(row.querySelector('.quantity').textContent, 10);
  const description = row.querySelector('.description').textContent;

  // Preenche o formulário com os valores do item
  productNameInput.value = name;
  productQuantityInput.value = quantity;
  productDescriptionInput.value = description;

  // Define a linha atual como sendo editada
  editMode = true;
  currentEditRow = row;
}

// Função para excluir um item
  function handleDelete(row) {

  // SweetAlert2 para confirmação de exclusão
  Swal.fire({
    title: 'Você tem certeza?',
    text: 'Este produto será removido da lista.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove o produto do localStorage e da tabela
      removeProductFromStorage(id);
      productTableBody.removeChild(row);

      // Exibe um alerta de sucesso
      Swal.fire(
        'Excluído!',
        'O produto foi removido com sucesso.',
        'success'
      );
    }
  });
}


// Funções de LocalStorage
function getProductsFromStorage() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function addProductToStorage(product) {
  const products = getProductsFromStorage();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}

function updateProductInStorage(id, updatedProduct) {
  const products = getProductsFromStorage();
  const index = products.findIndex((product) => product.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    localStorage.setItem('products', JSON.stringify(products));
  }
}

function removeProductFromStorage(id) {
  const products = getProductsFromStorage();
  const updatedProducts = products.filter((product) => product.id !== id);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
}
