// Получаем ID кампании из URL
const urlParams = new URLSearchParams(window.location.search);
const campaignId = urlParams.get('id');

// Загружаем кампанию
let campaign = null;
let currentSceneIndex = -1;

function loadCampaign() {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    campaign = campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
        alert('Кампания не найдена!');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('campaignTitle').textContent = campaign.title;
    
    // Инициализируем структуры если их нет
    if (!campaign.chapters) campaign.chapters = [];
    if (!campaign.npcs) campaign.npcs = [];
    if (!campaign.locations) campaign.locations = [];
    
    renderChapters();
    renderNpcs();
    renderLocations();
}

// Инициализация Quill редактора
const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Начните писать сцену...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    }
});

// Отрисовка глав
function renderChapters() {
    const list = document.getElementById('chapterList');
    list.innerHTML = '';
    
    campaign.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        if (index === currentSceneIndex) li.classList.add('active');
        li.onclick = () => selectScene(index);
        list.appendChild(li);
    });
}

// Отрисовка NPC
function renderNpcs() {
    const list = document.getElementById('npcList');
    list.innerHTML = '';
    
    campaign.npcs.forEach(npc => {
        const li = document.createElement('li');
        li.textContent = npc.name;
        li.onclick = () => alert(`${npc.name}\n\n${npc.description}`);
        list.appendChild(li);
    });
}

// Отрисовка локаций
function renderLocations() {
    const list = document.getElementById('locationList');
    list.innerHTML = '';
    
    campaign.locations.forEach(loc => {
        const li = document.createElement('li');
        li.textContent = loc.name;
        li.onclick = () => alert(`${loc.name}\n\n${loc.description}`);
        list.appendChild(li);
    });
}

// Выбор сцены
function selectScene(index) {
    // Сохраняем текущую сцену перед переключением
    if (currentSceneIndex >= 0 && campaign.chapters[currentSceneIndex]) {
        campaign.chapters[currentSceneIndex].content = quill.root.innerHTML;
        campaign.chapters[currentSceneIndex].title = document.getElementById('sceneTitle').value;
    }
    
    currentSceneIndex = index;
    const scene = campaign.chapters[index];
    
    document.getElementById('sceneTitle').value = scene.title || '';
    quill.root.innerHTML = scene.content || '';
    
    renderChapters();
}

// Сохранение кампании
function saveCampaign() {
    if (currentSceneIndex >= 0 && campaign.chapters[currentSceneIndex]) {
        campaign.chapters[currentSceneIndex].content = quill.root.innerHTML;
        campaign.chapters[currentSceneIndex].title = document.getElementById('sceneTitle').value;
    }
    
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const index = campaigns.findIndex(c => c.id === campaignId);
    campaigns[index] = campaign;
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
}

// Добавление главы
document.getElementById('addChapterBtn').onclick = () => {
    const title = prompt('Название главы:');
    if (!title) return;
    
    campaign.chapters.push({
        id: 'ch_' + Date.now(),
        title: title,
        content: ''
    });
    
    saveCampaign();
    renderChapters();
};

// Добавление NPC
document.getElementById('addNpcBtn').onclick = () => {
    const name = prompt('Имя NPC:');
    if (!name) return;
    
    const description = prompt('Описание NPC:') || '';
    
    campaign.npcs.push({
        id: 'npc_' + Date.now(),
        name: name,
        description: description
    });
    
    saveCampaign();
    renderNpcs();
};

// Добавление локации
document.getElementById('addLocationBtn').onclick = () => {
    const name = prompt('Название локации:');
    if (!name) return;
    
    const description = prompt('Описание локации:') || '';
    
    campaign.locations.push({
        id: 'loc_' + Date.now(),
        name: name,
        description: description
    });
    
    saveCampaign();
    renderLocations();
};

// Кнопка сохранения
document.getElementById('saveBtn').onclick = () => {
    saveCampaign();
    alert('✅ Сохранено!');
};

// Кнопка назад
document.getElementById('backBtn').onclick = () => {
    saveCampaign();
    window.location.href = 'index.html';
};

// Загружаем кампанию при старте
loadCampaign();
// Кнопка чтения
   document.getElementById('readBtn').onclick = () => {
       saveCampaign(); // Сначала сохраняем, чтобы не потерять текст
       window.location.href = `reader.html?id=${campaignId}`;
   };
