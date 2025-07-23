document.addEventListener('DOMContentLoaded', () => {

    const adsContainer = document.getElementById('ads-container');
    const addAdBtn = document.getElementById('add-ad-btn');
    const formModal = document.getElementById('form-modal');
    const detailsModal = document.getElementById('details-modal');
    const closeFormBtn = document.querySelector('.form-close-btn');
    const closeDetailsBtn = document.querySelector('.details-close-btn');
    const adForm = document.getElementById('ad-form');
    const adDetailsContent = document.getElementById('ad-details-content');

    let adsData = [
        { title: 'Aulas de Inglês', description: 'Aulas particulares personalizadas para todos os níveis. Foco em conversação e gramática para você finalmente alcançar a fluência. Material didático incluso.', category: 'aulas', contact: '@english_teacher' },
        { title: 'Brownies Deliciosos', description: 'Os melhores brownies da cidade! Feitos com chocolate nobre e ingredientes de alta qualidade. Faça sua encomenda para festas e eventos ou para aquele café da tarde especial.', category: 'comida', contact: '(19) 99999-8888' },
        { title: 'Venda de Livros Usados', description: 'Vendo livros de romance e ficção científica em ótimo estado de conservação. Chame no contato para ver a lista completa e os preços.', category: 'vendas', contact: '(11) 98765-4321' }
    ];

    const categoryMap = { 'aulas': 'Aulas e Cursos', 'comida': 'Comidas e Doces', 'beleza': 'Beleza e Saúde', 'servicos': 'Serviços Gerais', 'vendas': 'Venda de Produtos' };

    // --- NOVO: Lógica da Animação de Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para a animação acontecer só uma vez
            }
        });
    }, {
        threshold: 0.1 // O card aparece quando 10% dele estiver visível
    });

    function createAdCard(ad, index) {
        const card = document.createElement('div');
        card.className = 'ad-card';
        card.dataset.index = index;
        card.innerHTML = `<span class="category">${categoryMap[ad.category]}</span><h3>${ad.title}</h3><p>${ad.description}</p><div class="contact">Ver Contato</div>`;
        return card;
    }

    function renderAds() {
        adsContainer.innerHTML = ''; 
        adsData.forEach((ad, index) => {
            const card = createAdCard(ad, index);
            adsContainer.appendChild(card);
            observer.observe(card); // NOVO: Observa cada card criado
        });
    }

    function openDetailsModal(index) {
        const ad = adsData[index];
        adDetailsContent.innerHTML = `<span class="category">${categoryMap[ad.category]}</span><h2>${ad.title}</h2><p>${ad.description}</p><a class="contact" href="#">${ad.contact}</a>`;
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
        if (card) { openDetailsModal(card.dataset.index); }
    });

    adForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newAd = {
            title: document.getElementById('ad-title').value,
            description: document.getElementById('ad-description').value,
            category: document.getElementById('ad-category').value,
            contact: document.getElementById('ad-contact').value
        };
        adsData.unshift(newAd);
        renderAds();
        adForm.reset();
        closeModal();
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === formModal || event.target === detailsModal) { closeModal(); }
    });

    renderAds();
});