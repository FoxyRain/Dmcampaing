// Загрузка кампаний из localStorage
function loadCampaigns() {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const campaignList = document.getElementById('campaignList');
    
    campaignList.innerHTML = '';
    
    campaigns.forEach((campaign, index) => {
        const li = document.createElement('li');
        li.className = 'campaign-item';
        li.textContent = campaign.title;
        li.onclick = () => openCampaign(index);
        campaignList.appendChild(li);
    });
}

// Создание новой кампании
function createNewCampaign() {
    const title = prompt('Введите название кампании:');
    if (!title) return;
    
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    campaigns.push({
        id: Date.now().toString(),
        title: title,
        createdAt: new Date().toISOString(),
        chapters: []
    });
    
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    loadCampaigns();
}

// Открытие кампании (пока просто заглушка)
function openCampaign(index) {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const campaign = campaigns[index];
    window.location.href = `editor.html?id=${campaign.id}`;
}

// Инициализация
document.getElementById('newCampaignBtn').onclick = createNewCampaign;
loadCampaigns();
