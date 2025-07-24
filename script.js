document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção de Elementos ---
    const containerAnuncios = document.getElementById('container-anuncios');
    const btnAdicionarAnuncio = document.getElementById('btn-adicionar-anuncio');
    const modalFormulario = document.getElementById('modal-formulario');
    const modalDetalhes = document.getElementById('modal-detalhes');
    const btnFecharFormulario = document.querySelector('.btn-fechar-formulario');
    const btnFecharDetalhes = document.querySelector('.btn-fechar-detalhes');
    const formularioAnuncio = document.getElementById('formulario-anuncio');
    const conteudoDetalhesAnuncio = document.getElementById('conteudo-detalhes-anuncio');
    const barraPesquisa = document.getElementById('barra-pesquisa');
    const filtroCategoria = document.getElementById('filtro-categoria');

    // --- Dados da Aplicação ---
    let dadosAnuncios = [
        // --- ALTERADO ---: Adicionado ID e contador de LIKES
        { id: 'anuncio-1', title: 'Aulas de Violão', description: 'Aulas particulares de violão para iniciantes. Aprenda os primeiros acordes e ritmos de forma prática e divertida. Material incluso.', category: 'aulas', contact: '@violao_facil', date: '2025-07-20T10:00:00.000Z', likes: 15 },
        { id: 'anuncio-2', title: 'Brownies Deliciosos', description: 'Os melhores brownies da cidade! Feitos com chocolate nobre e ingredientes de alta qualidade. Faça sua encomenda para festas e eventos ou para aquele café da tarde especial.', category: 'comida', contact: '(19) 99999-8888', date: '2025-07-19T15:30:00.000Z', likes: 32 },
        { id: 'anuncio-3', title: 'Manicure e Pedicure', description: 'Serviços de manicure e pedicure com hora marcada. Esmaltes de alta qualidade e materiais esterilizados. Deixe suas unhas lindas!', category: 'beleza', contact: '(11) 98765-4321', date: '2025-07-18T18:00:00.000Z', likes: 24 }
    ];
    const mapaCategorias = { 'aulas': 'Aulas e Cursos', 'comida': 'Comidas e Doces', 'beleza': 'Beleza e Saúde', 'servicos': 'Serviços Gerais', 'vendas': 'Venda de Produtos' };
    
    // --- NOVO ---: Lógica para persistir likes no localStorage
    let likedItems = JSON.parse(localStorage.getItem('mural_liked_items')) || [];

    function salvarLikes() {
        localStorage.setItem('mural_liked_items', JSON.stringify(likedItems));
    }


    // --- Lógica de Animação de Scroll ---
    const observadorScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                observadorScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // --- Funções ---
    function formatarDataAnuncio(stringData) {
        const data = new Date(stringData);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function criarCardAnuncio(anuncio) { // Alterado para receber o objeto todo
        const card = document.createElement('div');
        card.className = 'card-anuncio';
        card.dataset.id = anuncio.id; // Usar ID em vez de index
        
        const isLiked = likedItems.includes(anuncio.id);
        
        // --- ALTERADO ---: Adicionado o footer do card com like e contato
        card.innerHTML = `
            <div class="card-conteudo-clicavel">
                <span class="categoria">${mapaCategorias[anuncio.category]}</span>
                <p class="data-publicacao">Publicado em: ${formatarDataAnuncio(anuncio.date)}</p>
                <h3>${anuncio.title}</h3>
                <p>${anuncio.description}</p>
            </div>
            <div class="card-footer">
                <div class="like-container">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${anuncio.id}">
                        <i class="material-icons">${isLiked ? 'favorite' : 'favorite_border'}</i>
                    </button>
                    <span class="like-count">${anuncio.likes}</span>
                </div>
                <div class="contato">Ver Contato</div>
            </div>`;
        return card;
    }

    function renderizarAnuncios(anunciosFiltrados) {
        containerAnuncios.innerHTML = '';
        if (anunciosFiltrados.length === 0) {
            containerAnuncios.innerHTML = `<p class="mensagem-sem-anuncios">Ops! Nenhum anúncio encontrado...</p>`;
            return;
        }
        anunciosFiltrados.forEach((anuncio, idx) => {
            const card = criarCardAnuncio(anuncio);
            card.style.transitionDelay = `${idx * 100}ms`;
            containerAnuncios.appendChild(card);
            observadorScroll.observe(card);
        });
    }
    
    function aplicarFiltrosERenderizar() {
        const termoPesquisa = barraPesquisa.value.toLowerCase();
        const categoriaSelecionada = filtroCategoria.value;
        let anunciosFiltrados = dadosAnuncios;

        if (categoriaSelecionada !== 'all') {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio => anuncio.category === categoriaSelecionada);
        }

        if (termoPesquisa) {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
                anuncio.title.toLowerCase().includes(termoPesquisa) || 
                anuncio.description.toLowerCase().includes(termoPesquisa)
            );
        }
        renderizarAnuncios(anunciosFiltrados.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordena por mais recente
    }

    function abrirModalDetalhes(anuncioId) { // Alterado para receber ID
        const anuncio = dadosAnuncios.find(a => a.id === anuncioId);
        if(!anuncio) return;

        const isLiked = likedItems.includes(anuncio.id);

        // --- ALTERADO ---: Adicionado o sistema de likes também no modal
        conteudoDetalhesAnuncio.innerHTML = `
            <div class="like-container" data-id="${anuncio.id}">
                <button class="like-btn ${isLiked ? 'liked' : ''}">
                    <i class="material-icons">${isLiked ? 'favorite' : 'favorite_border'}</i>
                </button>
                <span class="like-count">${anuncio.likes}</span>
            </div>
            <span class="categoria">${mapaCategorias[anuncio.category]}</span>
            <h2>${anuncio.title}</h2>
            <p class="data-publicacao">Publicado em: ${formatarDataAnuncio(anuncio.date)}</p>
            <p>${anuncio.description}</p>
            <a class="contato" href="#">${anuncio.contact}</a>`;
        
        // Adiciona o event listener para o novo botão de like dentro do modal
        const likeBtnModal = conteudoDetalhesAnuncio.querySelector('.like-btn');
        likeBtnModal.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLikeClick(anuncio.id);
        });

        modalDetalhes.style.display = 'flex';
    }

    function fecharModais() {
        modalFormulario.style.display = 'none';
        modalDetalhes.style.display = 'none';
    }
    
    // --- NOVO ---: Função para cuidar da lógica do clique no like
    function handleLikeClick(anuncioId) {
        const anuncio = dadosAnuncios.find(a => a.id === anuncioId);
        if(!anuncio) return;

        const likeBtn = document.querySelector(`.like-btn[data-id="${anuncio.id}"]`);
        const isLiked = likedItems.includes(anuncio.id);

        if (isLiked) {
            // Descurtir
            anuncio.likes--;
            likedItems = likedItems.filter(id => id !== anuncioId);
        } else {
            // Curtir
            anuncio.likes++;
            likedItems.push(anuncioId);
        }

        salvarLikes();
        
        // Atualiza a UI sem precisar recarregar tudo (mais performático)
        const allLikeCounters = document.querySelectorAll(`.card-anuncio[data-id="${anuncio.id}"] .like-count, #conteudo-detalhes-anuncio .like-container[data-id="${anuncio.id}"] .like-count`);
        allLikeCounters.forEach(counter => counter.textContent = anuncio.likes);

        const allLikeBtns = document.querySelectorAll(`.like-btn[data-id="${anuncio.id}"]`);
        allLikeBtns.forEach(btn => {
             btn.classList.toggle('liked', !isLiked);
             btn.querySelector('.material-icons').textContent = !isLiked ? 'favorite' : 'favorite_border';
        });

        // Se o modal estiver aberto, atualiza ele também
        if(modalDetalhes.style.display === 'flex') {
            abrirModalDetalhes(anuncioId);
        }
    }


    function efeitoMaquinaDeEscrever(texto, i, callback) {
        if (i < (texto.length)) {
            document.title = texto.substring(0, i + 1) + ' |';
            setTimeout(() => {
                efeitoMaquinaDeEscrever(texto, i + 1, callback)
            }, 150);
        } else if (typeof callback == 'function') {
            document.title = texto;
            setTimeout(callback, 1000);
        }
    }

    function iniciarAnimacaoTitulo() {
        const textoTitulo = "Mural de Empreendedorismo";
        efeitoMaquinaDeEscrever(textoTitulo, 0, null);
    }

    // --- Eventos ---
    btnAdicionarAnuncio.addEventListener('click', () => { modalFormulario.style.display = 'flex'; });
    
    btnFecharFormulario.addEventListener('click', fecharModais);
    btnFecharDetalhes.addEventListener('click', fecharModais);

    containerAnuncios.addEventListener('click', (event) => {
        // --- ALTERADO ---: Adicionada lógica para diferenciar clique no card e no like
        const likeBtn = event.target.closest('.like-btn');
        if (likeBtn) {
            event.stopPropagation(); // Impede que o modal abra ao clicar no like
            handleLikeClick(likeBtn.dataset.id);
            return;
        }

        const cardClicavel = event.target.closest('.card-conteudo-clicavel, .contato');
        if (cardClicavel) {
            const card = cardClicavel.closest('.card-anuncio');
            abrirModalDetalhes(card.dataset.id);
        }
    });

    formularioAnuncio.addEventListener('submit', (event) => {
        event.preventDefault();
        const novoAnuncio = {
            // --- ALTERADO ---: Adicionado ID único e likes inicial
            id: 'anuncio-' + new Date().getTime(),
            title: document.getElementById('anuncio-titulo').value,
            description: document.getElementById('anuncio-descricao').value,
            category: document.getElementById('anuncio-categoria').value,
            contact: document.getElementById('anuncio-contato').value,
            date: new Date().toISOString(),
            likes: 0
        };
        dadosAnuncios.unshift(novoAnuncio);
        
        formularioAnuncio.reset();
        barraPesquisa.value = '';
        filtroCategoria.value = 'all';
        aplicarFiltrosERenderizar();
        fecharModais();
    });

    barraPesquisa.addEventListener('input', aplicarFiltrosERenderizar);
    filtroCategoria.addEventListener('change', aplicarFiltrosERenderizar);

    window.addEventListener('click', (event) => {
        if (event.target === modalFormulario || event.target === modalDetalhes) {
            fecharModais();
        }
    });

    // --- Execução Inicial ---
    aplicarFiltrosERenderizar();
    iniciarAnimacaoTitulo();
});