// Инициализация Quill редактора
const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Начните писать сцену...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    }
});

// Получаем ID кампании из URL
const urlParams = new URLSearchParams(window.location.search);
const campaignId = urlParams.get('id');

// Загружаем кампанию
let currentCampaign = null;
let currentScene = null;

function loadCampaign() {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    currentCampaign = campaigns.find(c => c.id === campaignId);
    
    if (!currentCampaign) {
        alert('Кампания не найдена');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('campaignTitle').textContent = currentCampaign.title;
    renderChapters();
    renderEntities();
}

// Отрисовка глав
function renderChapters() {
    const chapterList = document.getElementById('chapterList');
    chapterList.innerHTML = '';
    
    if (!currentCampaign.chapters) {
        currentCampaign.chapters = [];
    }
    
    currentCampaign.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        li.onclick = () => selectChapter(index);
        chapterList.appendChild(li);
    });
}

// Отрисовка сущностей
function renderEntities() {
    const entityList = document.getElementById('entityList');
    entityList.innerHTML = '';
    
    if (!currentCampaign.entities) {
        currentCampaign.entities = { npcs: [], locations: [], items: [] };
    }
    
    // NPC
    currentCampaign.entities.npcs.forEach(npc => {
        const li = document.createElement('li');
        li.textContent = '👤 ' + npc.name;
        li.onclick = () => selectEntity('npc', npc.id);
        entityList.appendChild(li);
    });
    
    // Локации
    currentCampaign.entities.locations.forEach(loc => {
        const li = document.createElement('li');
        li.textContent = '🗺️ ' + loc.name;
        li.onclick = () => selectEntity('location', loc.id);
        entityList.appendChild(li);
    });
}

// Выбор главы
function selectChapter(index) {
    const chapter = currentCampaign.chapters[index];
    if (chapter.scenes && chapter.scenes.length > 0) {
        selectScene(chapter.scenes[0]);
    }
}

// Выбор сцены
function selectScene(scene) {
    currentScene = scene;
    document.getElementById('sceneTitle').value = scene.title;
    quill.root.innerHTML = scene.content || '';
}

// Выбор сущности
function selectEntity(type, id) {
    const entity = currentCampaign.entities[type + 's'].find(e => e.id === id);
    alert(`${entity.name}\n\n${entity.description}`);
}

// Добавление главы
document.getElementById('addChapterBtn').onclick = () => {
    const title = prompt('Название главы:');
    if (!title) return;
    
    currentCampaign.chapters.push({
        id: 'chapter_' + Date.now(),
        title: title,
        scenes: []
    });
    
    saveCampaign();
    renderChapters();
};

// Добавление NPC
document.getElementById('addNpcBtn').onclick = () => {
    const name = prompt('Имя NPC:');
    if (!name) return;
    
    const description = prompt('Описание NPC:') || '';
    
    currentCampaign.entities.npcs.push({
        id: 'npc_' + Date.now(),
        name: name,
        description: description
    });
    
    saveCampaign();
    renderEntities();
};

// Добавление локации
document.getElementById('addLocationBtn').onclick = () => {
    const name = prompt('Название локации:');
    if (!name) return;
    
    const description = prompt('Описание локации:') || '';
    
    currentCampaign.entities.locations.push({
        id: 'loc_' + Date.now(),
        name: name,
        description: description
    });
    
    saveCampaign();
    renderEntities();
};

// Сохранение кампании
function saveCampaign() {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const index = campaigns.findIndex(c => c.id === campaignId);
    
    if (currentScene) {
        currentScene.title = document.getElementById('sceneTitle').value;
        currentScene.content = quill.root.innerHTML;
    }
    
    campaigns[index] = currentCampaign;
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
}

// Кнопка сохранения
document.getElementById('saveBtn').onclick = () => {
    saveCampaign();
    alert('Сохранено!');
};

// Кнопка назад
document.getElementById('backBtn').onclick = () => {
    saveCampaign();
    window.location.href = 'index.html';
};

// Вставка NPC в текст
document.getElementById('insertNpcBtn').onclick = () => {
    if (!currentCampaign.entities.npcs.length) {
        alert('Сначала создайте NPC');
        return;
    }
    
    const npcNames = currentCampaign.entities.npcs.map(n => n.name);
    const selected = prompt('Выберите NPC:\n' + npcNames.join('\n'));
    
    if (selected) {
        const range = quill.getSelection();
        if (range) {
            quill.insertText(range.index, `[NPC: ${selected}]`);
        }
    }
};

// Вставка локации в текст
document.getElementById('insertLocationBtn').onclick = () => {
    if (!currentCampaign.entities.locations.length) {
        alert('Сначала создайте локацию');
        return;
    }
    
    const locNames = currentCampaign.entities.locations.map(l => l.name);
    const selected = prompt('Выберите локацию:\n' + locNames.join('\n'));
    
    if (selected) {
        const range = quill.getSelection();
        if (range) {
            quill.insertText(range.index, `[Локация: ${selected}]`);
        }
    }
};

// Предпросмотр
document.getElementById('previewBtn').onclick = () => {
    saveCampaign();
    window.open(`reader.html?id=${campaignId}`, '_blank');
};

// Загрузка при старте
loadCampaign();
