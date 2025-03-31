// Função para carregar categorias e popular o select
const loadCategories = async () => {
  try {
    const response = await fetch("/categories");
    const data = await response.json();

    console.log("Resposta da API:", data); // Verifica os dados recebidos

    const categoriesSelect = document.getElementById("categories");
    categoriesSelect.innerHTML = ""; // Limpa opções antigas antes de adicionar novas

    // Adicionando as categorias ao select
    data.categories.forEach((category) => {
      console.log("Categoria recebida:", category); // Log para debug

      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categoriesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
};

// Função para enviar o formulário de notícia
// Variável para armazenar o ID da notícia que está sendo editada
let editingNewsId = null;

// Função para carregar os dados da notícia no formulário para edição
const editNews = (newsId) => {
  // Busca a notícia selecionada
  fetch(`/news/${newsId}`)
    .then((response) => response.json())
    .then((news) => {
      // Preencher o formulário com os dados da notícia selecionada
      document.getElementById("title").value = news.title;
      document.getElementById("description").value = news.description;
      document.getElementById("url").value = news.url;
      document.getElementById("image").value = news.image;

      // Seleciona as categorias da notícia
      const categoriesSelect = document.getElementById("categories");
      const categoriesArray = news.categories ? news.categories.split(",") : [];
      Array.from(categoriesSelect.options).forEach((option) => {
        option.selected = categoriesArray.includes(option.textContent);
      });

      // Armazena o ID da notícia que está sendo editada
      editingNewsId = newsId;

      // Rola para o formulário de edição
      const formElement = document.getElementById("news-form");
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    })
    .catch((error) =>
      console.error("Erro ao carregar notícia para edição:", error)
    );
};

// Modificar a função de envio do formulário para diferenciar criação e edição
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const title = formData.get("title");
  const description = formData.get("description");
  const image = formData.get("image");
  const url = formData.get("url");
  const categories = Array.from(formData.getAll("categories"));

  const newsData = { title, description, image, url, categories };

  try {
    let response;

    if (editingNewsId) {
      // Se estiver editando, envia uma requisição PUT para atualizar a notícia
      response = await fetch(`/news/${editingNewsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });

      editingNewsId = null; // Reseta o estado de edição
    } else {
      // Se não estiver editando, cria uma nova notícia
      response = await fetch("/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });
    }

    const data = await response.json();
    document.getElementById("message").textContent =
      data.message || "Notícia salva com sucesso!";
    form.reset();
    loadNews(); // Recarrega as notícias na tela
  } catch (error) {
    console.error("Erro ao salvar notícia:", error);
    document.getElementById("message").textContent = "Erro ao salvar notícia!";
  }
};

// Função para excluir uma notícia
const deleteNews = async (newsId) => {
  if (!confirm("Tem certeza que deseja excluir esta notícia?")) {
    return;
  }

  try {
    const response = await fetch(`/news/${newsId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    alert(data.message || "Notícia excluída com sucesso!");

    // Recarregar a lista de notícias após a exclusão
    loadNews();
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    alert("Erro ao excluir notícia!");
  }
};

// Função para carregar as notícias e exibir na página
const loadNews = async () => {
  try {
    const response = await fetch("/news"); // Rota para obter as notícias
    const data = await response.json();

    console.log("Dados das notícias recebidos:", data); // Debugging

    const newsList = document.getElementById("news-list");
    newsList.innerHTML = ""; // Limpa a lista antes de adicionar novas notícias

    // Verifica se há notícias retornadas
    if (data.news.length === 0) {
      newsList.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      return;
    }

    // Agrupar as notícias por categoria
    const categorizedNews = {};

    data.news.forEach((news) => {
      // Se houver categorias
      const categories = news.categories ? news.categories.split(",") : ["Sem categoria"];
      categories.forEach((category) => {
        if (!categorizedNews[category]) {
          categorizedNews[category] = [];
        }
        categorizedNews[category].push(news);
      });
    });

    // Adicionando as notícias agrupadas por categoria
    for (const category in categorizedNews) {
      const categoryBlock = document.createElement("div");
      categoryBlock.classList.add("category-block");
      categoryBlock.innerHTML = `<h3>${category}</h3>`;

      const newsGrid = document.createElement("div");
      newsGrid.classList.add("news-grid");

      categorizedNews[category].forEach((news) => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        newsItem.innerHTML = `
          <h4>${news.title}</h4>
          <p>${news.description}</p>
          <img src="${news.image}" alt="Imagem da notícia" width="200">
          <span><strong>Categorias:</strong> ${news.categories || "Sem categoria"}</span>
          <button class="edit-button" onclick="editNews(${news.id})">Editar</button>
          <button class="delete-button" onclick="deleteNews(${news.id})">Excluir</button>
        `;

        newsGrid.appendChild(newsItem);
      });

      categoryBlock.appendChild(newsGrid);
      newsList.appendChild(categoryBlock);
    }
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
  }
};

// Função para carregar as categorias na barra de pesquisa
const loadSearchCategories = async () => {
  try {
    const response = await fetch("/categories");
    const data = await response.json();

    const categoryFilter = document.getElementById("search-category");
    categoryFilter.innerHTML =
      '<option value="">Filtrar por categoria</option>';

    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
};

// Função para filtrar notícias
const filterNews = () => {
  const searchTitle = document
    .getElementById("search-title")
    .value.toLowerCase();
  const searchCategory = document
    .getElementById("search-category")
    .value.toLowerCase();
  const newsItems = document.querySelectorAll(".news-item");

  newsItems.forEach((item) => {
    const title = item.querySelector("h3").textContent.toLowerCase();
    const categories = item
      .querySelector("p:nth-of-type(2)")
      .textContent.toLowerCase();

    if (
      title.includes(searchTitle) &&
      (searchCategory === "" || categories.includes(searchCategory.trim()))
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

// Atualizar para carregar categorias na pesquisa também
window.onload = () => {
  loadCategories();
  loadSearchCategories();
  loadNews();

  const form = document.getElementById("news-form");
  form.addEventListener("submit", handleFormSubmit);
};
