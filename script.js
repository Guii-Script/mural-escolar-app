document.addEventListener('DOMContentLoaded', () => {

    const adsContainer = document.getElementById('ads-container');
    const addAdBtn = document.getElementById('add-ad-btn');
    const formModal = document.getElementById('form-modal');
    const detailsModal = document.getElementById('details-modal');
    const closeFormBtn = document.querySelector('.form-close-btn');
    const closeDetailsBtn = document.querySelector('.details-close-btn');
    const adForm = document.getElementById('ad-form');
    const adDetailsContent = document.getElementById('ad-details-content');
    
    // NOVO: Referência para a barra de pesquisa e o filtro de categoria
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    let adsData = [
        { title: 'Aulas de Violão', description: 'Aulas particulares de violão para iniciantes. Aprenda os primeiros acordes e ritmos de forma prática e divertida. Material incluso.', category: 'aulas', contact: '@violao_facil', date: '2025-07-20T10:00:00.000Z' },
        { title: 'Brownies Deliciosos', description: 'Os melhores brownies da cidade! Feitos com chocolate nobre e ingredientes de alta qualidade. Faça sua encomenda para festas e eventos ou para aquele café da tarde especial.', category: 'comida', contact: '(19) 99999-8888', date: '2025-07-19T15:30:00.000Z' },
        { title: 'Manicure e Pedicure', description: 'Serviços de manicure e pedicure com hora marcada. Esmaltes de alta qualidade e materiais esterilizados. Deixe suas unhas lindas!', category: 'beleza', contact: '(11) 98765-4321', date: '2025-07-18T18:00:00.000Z' }
    ];

    const categoryMap = { 'aulas': 'Aulas e Cursos', 'comida': 'Comidas e Doces', 'beleza': 'Beleza e Saúde', 'servicos': 'Serviços Gerais', 'vendas': 'Venda de Produtos' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    function formatAdDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // ATUALIZADO: Esta função agora recebe o array já filtrado
    function renderAds(filteredAds) {
        adsContainer.innerHTML = '';

        if (filteredAds.length === 0) {
            adsContainer.innerHTML = `<p class="no-ads-message">Ops! Nenhum anúncio encontrado...</p>`;
            return;
        }

        filteredAds.forEach((ad, idx) => {
            const originalIndex = adsData.findIndex(originalAd => originalAd === ad);
            const card = createAdCard(ad, originalIndex);
            const delay = idx * 100;
            card.style.transitionDelay = `${delay}ms`;

            adsContainer.appendChild(card);
            observer.observe(card);
        });
    }
    
    // NOVO: Função central que aplica todos os filtros e chama a renderização
    function applyFiltersAndRender() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filteredAds = adsData;

        // 1. Filtra por categoria
        if (selectedCategory !== 'all') {
            filteredAds = filteredAds.filter(ad => ad.category === selectedCategory);
        }

        // 2. Filtra pelo termo de pesquisa (no resultado do filtro anterior)
        if (searchTerm) {
            filteredAds = filteredAds.filter(ad => 
                ad.title.toLowerCase().includes(searchTerm) || 
                ad.description.toLowerCase().includes(searchTerm)
            );
        }

        renderAds(filteredAds);
    }

    function createAdCard(ad, index) {
        const card = document.createElement('div');
        card.className = 'ad-card';
        card.dataset.index = index;
        card.innerHTML = `<span class="category">${categoryMap[ad.category]}</span>
                          <p class="date">Publicado em: ${formatAdDate(ad.date)}</p>
                          <h3>${ad.title}</h3>
                          <p>${ad.description}</p>
                          <div class="contact">Ver Contato</div>`;
        return card;
    }

    function openDetailsModal(index) {
        const ad = adsData[index];
        adDetailsContent.innerHTML = `<span class="category">${categoryMap[ad.category]}</span>
                                      <h2>${ad.title}</h2>
                                      <p class="date">Publicado em: ${formatAdDate(ad.date)}</p>
                                      <p>${ad.description}</p>
                                      <a class="contact" href="#">${ad.contact}</a>`;
        detailsModal.style.display = 'flex';
    }

    addAdBtn.addEventListener('click', () => { formModal.style.display = 'flex'; });

    function closeModal() {
        formModal.style.display = 'none';
        detailsModal.style.display = 'none';
    }

    closeFormBtn.addEventListener('click', closeModal);
    closeDetailsBtn.addEventListener('click', closeModal);

    adsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.ad-card');
        if (card) {
            openDetailsModal(card.dataset.index);
        }
    });

    adForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newAd = {
            title: document.getElementById('ad-title').value,
            description: document.getElementById('ad-description').value,
            category: document.getElementById('ad-category').value,
            contact: document.getElementById('ad-contact').value,
            date: new Date().toISOString()
        };
        adsData.unshift(newAd);
        
        // Limpa os filtros e re-renderiza
        adForm.reset();
        searchBar.value = '';
        categoryFilter.value = 'all';
        applyFiltersAndRender();
        closeModal();
    });

    // ATUALIZADO: Adiciona os event listeners para os filtros
    searchBar.addEventListener('input', applyFiltersAndRender);
    categoryFilter.addEventListener('change', applyFiltersAndRender);

    window.addEventListener('click', (event) => {
        if (event.target === formModal || event.target === detailsModal) {
            closeModal();
        }
    });

    function typeWriter(text, i, fnCallback) {
        if (i < (text.length)) {
            document.title = text.substring(0, i + 1) + ' |';
            setTimeout(() => {
                typeWriter(text, i + 1, fnCallback)
            }, 150);
        } else if (typeof fnCallback == 'function') {
            document.title = text;
            setTimeout(fnCallback, 1000);
        }
    }

    function startTypingAnimation() {
        const titleText = "Mural de Empreendedorismo";
        typeWriter(titleText, 0, null);
    }

    // Renderização inicial
    applyFiltersAndRender();
    startTypingAnimation();
});