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
        { title: 'Aulas de Violão', description: 'Aulas particulares de violão para iniciantes. Aprenda os primeiros acordes e ritmos de forma prática e divertida. Material incluso.', category: 'aulas', contact: '@violao_facil', date: '2025-07-20T10:00:00.000Z' },
        { title: 'Brownies Deliciosos', description: 'Os melhores brownies da cidade! Feitos com chocolate nobre e ingredientes de alta qualidade. Faça sua encomenda para festas e eventos ou para aquele café da tarde especial.', category: 'comida', contact: '(19) 99999-8888', date: '2025-07-19T15:30:00.000Z' },
        { title: 'Manicure e Pedicure', description: 'Serviços de manicure e pedicure com hora marcada. Esmaltes de alta qualidade e materiais esterilizados. Deixe suas unhas lindas!', category: 'beleza', contact: '(11) 98765-4321', date: '2025-07-18T18:00:00.000Z' }
    ];
    const mapaCategorias = { 'aulas': 'Aulas e Cursos', 'comida': 'Comidas e Doces', 'beleza': 'Beleza e Saúde', 'servicos': 'Serviços Gerais', 'vendas': 'Venda de Produtos' };

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

    function criarCardAnuncio(anuncio, index) {
        const card = document.createElement('div');
        card.className = 'card-anuncio';
        card.dataset.index = index;
        card.innerHTML = `<span class="categoria">${mapaCategorias[anuncio.category]}</span>
                          <p class="data-publicacao">Publicado em: ${formatarDataAnuncio(anuncio.date)}</p>
                          <h3>${anuncio.title}</h3>
                          <p>${anuncio.description}</p>
                          <div class="contato">Ver Contato</div>`;
        return card;
    }

    function renderizarAnuncios(anunciosFiltrados) {
        containerAnuncios.innerHTML = '';
        if (anunciosFiltrados.length === 0) {
            containerAnuncios.innerHTML = `<p class="mensagem-sem-anuncios">Ops! Nenhum anúncio encontrado...</p>`;
            return;
        }
        anunciosFiltrados.forEach((anuncio, idx) => {
            const indexOriginal = dadosAnuncios.findIndex(adOriginal => adOriginal === anuncio);
            const card = criarCardAnuncio(anuncio, indexOriginal);
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
        renderizarAnuncios(anunciosFiltrados);
    }

    function abrirModalDetalhes(index) {
        const anuncio = dadosAnuncios[index];
        conteudoDetalhesAnuncio.innerHTML = `<span class="categoria">${mapaCategorias[anuncio.category]}</span>
                                      <h2>${anuncio.title}</h2>
                                      <p class="data-publicacao">Publicado em: ${formatarDataAnuncio(anuncio.date)}</p>
                                      <p>${anuncio.description}</p>
                                      <a class="contato" href="#">${anuncio.contact}</a>`;
        modalDetalhes.style.display = 'flex';
    }

    function fecharModais() {
        modalFormulario.style.display = 'none';
        modalDetalhes.style.display = 'none';
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
    // A LINHA ABAIXO FOI A CORRIGIDA
    btnAdicionarAnuncio.addEventListener('click', () => { modalFormulario.style.display = 'flex'; });
    
    btnFecharFormulario.addEventListener('click', fecharModais);
    btnFecharDetalhes.addEventListener('click', fecharModais);

    containerAnuncios.addEventListener('click', (event) => {
        const card = event.target.closest('.card-anuncio');
        if (card) {
            abrirModalDetalhes(card.dataset.index);
        }
    });

    formularioAnuncio.addEventListener('submit', (event) => {
        event.preventDefault();
        const novoAnuncio = {
            title: document.getElementById('anuncio-titulo').value,
            description: document.getElementById('anuncio-descricao').value,
            category: document.getElementById('anuncio-categoria').value,
            contact: document.getElementById('anuncio-contato').value,
            date: new Date().toISOString()
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