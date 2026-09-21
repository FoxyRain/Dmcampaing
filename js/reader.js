const urlParams = new URLSearchParams(window.location.search);
const campaignId = urlParams.get('id');
let campaign = null;

function loadCampaign() {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    campaign = campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('bookTitle').textContent = campaign.title;
    renderTOC();
    renderEntities();
}

function renderTOC() {
    const list = document.getElementById('tocList');
    list.innerHTML = '';
    if (!campaign.chapters) return;
    
    campaign.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        li.onclick = () => showChapter(index);
        list.appendChild(li);
    });
}

function renderEntities() {
    const npcList = document.getElementById('npcList');
    const locList = document.getElementById('locList');
    npcList.innerHTML = '';
    locList.innerHTML = '';
    
    if (campaign.npcs) {
        campaign.npcs.forEach(npc => {
            const li = document.createElement('li');
            li.textContent = npc.name;
            li.onclick = () => showEntity(npc.name, npc.description);
            npcList.appendChild(li);
        });
    }
    if (campaign.locations) {
        campaign.locations.forEach(loc => {
            const li = document.createElement('li');
            li.textContent = loc.name;
            li.onclick = () => showEntity(loc.name, loc.description);
            locList.appendChild(li);
        });
    }
}

function showChapter(index) {
    const chapter = campaign.chapters[index];
    document.getElementById('contentArea').innerHTML = `<h1>${chapter.title}</h1><div>${chapter.content}</div>`;
    
    // Подсветка активной главы в меню
    document.querySelectorAll('.toc-list li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.toc-list li')[index].classList.add('active');
    
    // Прокрутка наверх
    document.querySelector('.reader-main').scrollTop = 0;
}

function showEntity(name, desc) {
    document.getElementById('contentArea').innerHTML = `<h1>${name}</h1><p>${desc || 'Описание отсутствует.'}</p>`;
}

document.getElementById('backBtn').onclick = () => {
    window.location.href = `editor.html?id=${campaignId}`;
};

// Запуск
loadCampaign();
