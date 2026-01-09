// Data is now imported from data.js
// products, priceComparisons, lessons, growthData are available globally

// Elements
// Elements
const productList = document.getElementById('productList');
const priceCompareList = document.getElementById('priceCompareList');
const lessonList = document.getElementById('lessonList');
const modal = document.getElementById('productModal');
const waitlistModal = document.getElementById('waitlistModal');
const cardMakerModal = document.getElementById('cardMakerModal');
const chatScreen = document.getElementById('chatScreen');
const aiResultModal = document.getElementById('aiResultModal');
const growthChart = document.getElementById('growthChart');

// Init
document.addEventListener('DOMContentLoaded', () => {
    switchTab('home', document.querySelector('.nav-item')); // Default tab

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
});

// Functions
function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName + '-view').classList.add('active');

    // If navigation click, highlight button. If null (init), find by tabName
    if (btn) btn.classList.add('active');

    if (tabName === 'market') {
        renderPriceCompare(priceComparisons);
        renderProducts(products);
        renderLessons(lessons);
    }
    if (tabName === 'community') {
        renderQuestions(questions);
    }
    if (tabName === 'my') renderGraph(growthData);
}


function renderQuestions(data) {
    const qaList = document.getElementById('qaList');
    if (!qaList || !data) return;
    qaList.innerHTML = '';
    data.forEach(q => {
        const div = document.createElement('div');
        div.className = 'qa-item';
        div.innerHTML = `
            <div>
                <div class="qa-title"><span class="qa-icon">Q.</span>${q.title}</div>
                <div class="qa-meta">
                    <span>${q.tag}</span> • <span>${q.time}</span> • <span>조회 ${q.views}</span>
                </div>
            </div>
            <div style="font-size:12px; font-weight:bold; color:var(--text-sub);">
                💬 ${q.comments}
            </div>
        `;
        qaList.appendChild(div);
    });
}

function renderPriceCompare(data) {
    if (!priceCompareList) return;
    if (!data) return; // Robust check
    priceCompareList.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'price-item';
        div.onclick = () => window.open(item.link, '_blank');
        div.innerHTML = `
            <div class="sale-badge">-${item.sale}</div>
            <img src="${item.img}" class="price-img">
            <div class="price-info">
                <div class="price-mall">${item.mall}</div>
                <div class="price-name">${item.name}</div>
                <div class="price-val">${item.price}원</div>
            </div>
        `;
        priceCompareList.appendChild(div);
    });
}

function renderLessons(data) {
    if (!lessonList) return;
    if (!data) return;
    lessonList.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.innerHTML = `
            <img src="${item.img}" class="lesson-img">
            <div class="lesson-info">
                <div class="lesson-title">${item.name}</div>
                <div class="lesson-coach">${item.coach} · ${item.loc}</div>
                <div style="display:flex; gap:4px; margin: 4px 0;">
                    ${item.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span style="font-weight:bold; color:var(--primary-color);">⭐ ${item.rating}</span>
                    <span style="font-weight:bold;">${item.price}원<span style="font-size:11px; font-weight:normal;">/회</span></span>
                </div>
            </div>
            <button class="lesson-btn" onclick="openWaitlist('레슨 예약')">예약</button>
        `;
        lessonList.appendChild(card);
    });
}

function renderProducts(data) {
    if (!productList) return;
    if (!data) return;
    if (data.length === 0) { productList.innerHTML = '<div class="loading">검색 결과가 없습니다. 😅</div>'; return; }
    productList.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(item);
        let badgeHtml = `<div class="badge">${item.grade}</div>`;
        if (item.hand === '좌투') badgeHtml += `<div class="hand-badge">Left</div>`;

        // Seller Trust Logic
        let sellerHtml = '';
        if (item.seller) {
            const badgeIcon = item.seller.badge ? '✅' : '';
            sellerHtml = `<div style="font-size:11px; color:#666; margin-top:4px; display:flex; align-items:center;">
                판매자: ${item.seller.name} ${item.seller.badge ? '<span class="trust-badge">SAFE</span>' : ''}
            </div>`;
        }

        card.innerHTML = `
            <div class="img-container">
                ${badgeHtml}
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="photo-count">1/5</div>
            </div>
            <div class="card-info">
                <div class="brand">${item.brand || item.position}</div>
                <div class="name">${item.name}</div>
                <div class="price">${item.price}원</div>
                ${sellerHtml}
            </div>
        `;
        productList.appendChild(card);
    });
}

function filterData(key, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('searchInput').value = '';

    let filtered;
    if (key === 'all') filtered = products;
    else if (key === '좌투' || key === '우투') filtered = products.filter(p => p.hand === key);
    else filtered = products.filter(p => p.position === key);
    renderProducts(filtered);
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    renderProducts(filtered);
}

// Modals
function openModal(item) {
    document.getElementById('modalImg').src = item.img;
    document.getElementById('modalTitle').innerText = item.name;
    document.getElementById('modalPrice').innerText = item.price + '원';
    document.getElementById('modalDesc').innerText = item.desc;
    modal.style.display = 'flex';
}

function closeModal(event) {
    // Generic close for all modals if background clicked
    if (event.target.classList.contains('modal') ||
        event.target.classList.contains('waitlist-modal') ||
        event.target.classList.contains('card-maker-modal') ||
        event.target.classList.contains('ai-result-modal') ||
        event.target.classList.contains('sheet-overlay') ||
        event.target.classList.contains('close-btn')) {

        if (event.target.classList.contains('sheet-overlay')) {
            closeAiActionSheet();
            return;
        }
        event.target.closest('div[style*="display"]').style.display = 'none';

        // Specific cleanup
        if (event.target.closest('#cardMakerModal')) resetCardMaker();
    }
}

// Explicit close functions
function closeProductModal() { modal.style.display = 'none'; }
function closeWaitlist() { waitlistModal.style.display = 'none'; }
function closeAiResult() { aiResultModal.style.display = 'none'; }
function closeChat() { chatScreen.style.display = 'none'; }

function openWaitlist(type) {
    console.log("Waitlist:", type);
    waitlistModal.style.display = 'flex';
}

function submitWaitlist() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfGZ-BnCz61sIT8YfU-OAJxQZR3w-tLO3nWmMlM3_F0G8IbTA/viewform?usp=dialog", "_blank");
    waitlistModal.style.display = 'none';
    alert("사전예약 페이지로 이동합니다!");
}

// Chat
function openChat() {
    modal.style.display = 'none';
    chatScreen.style.display = 'flex';
    document.getElementById('chatInput').focus();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.getElementById('chatBody');
    chatBody.innerHTML += `<div class="chat-msg msg-sent">${msg}</div>`;
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        chatBody.innerHTML += `<div class="chat-msg msg-recv">확인했습니다! 잠시만요 😊</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

// Card Maker
let uploadedPhotoData = null;
function openCardMaker() { cardMakerModal.style.display = 'flex'; }

function resetCardMaker() {
    document.getElementById('fifaCardPreview').style.display = 'none';
    document.getElementById('mercName').value = '';
    document.getElementById('mercPos').value = '';
    document.getElementById('mercLoc').value = '';
    document.getElementById('mercSkill').value = '';
    uploadedPhotoData = null;
    document.getElementById('photoPreview').innerHTML = `<span style="font-size: 24px;">📷</span><div style="font-size: 11px; color:#999; margin-top:5px;">사진 추가</div>`;
}

function previewPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedPhotoData = e.target.result;
            document.getElementById('photoPreview').innerHTML = `<img src="${uploadedPhotoData}" alt="프로필" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function generateFifaCard() {
    const name = document.getElementById('mercName').value;
    const pos = document.getElementById('mercPos').value;
    // Randomize stats if empty for fun
    const power = document.getElementById('mercPower').value || Math.floor(Math.random() * 20) + 70;
    const speed = document.getElementById('mercSpeed').value || Math.floor(Math.random() * 20) + 70;
    const control = document.getElementById('mercControl').value || Math.floor(Math.random() * 20) + 70;
    const defense = document.getElementById('mercDefense').value || Math.floor(Math.random() * 20) + 70;

    if (!name || !pos) { alert("닉네임과 포지션은 필수입니다!"); return; }

    const avg = Math.round((parseInt(power) + parseInt(speed) + parseInt(control) + parseInt(defense)) / 4);
    const posMap = { '투수': 'P', '포수': 'C', '내야수': 'IF', '외야수': 'OF' };

    document.getElementById('previewPlayerName').innerText = name.toUpperCase();
    document.getElementById('previewPosition').innerText = posMap[pos] || pos;
    document.getElementById('previewRating').innerText = avg;

    // Stats mapping
    const statHtml = `
        <div class="fifa-stat"><span style="width:30px;">PWR</span> ${power}</div>
        <div class="fifa-stat"><span style="width:30px;">SPD</span> ${speed}</div>
        <div class="fifa-stat"><span style="width:30px;">CTL</span> ${control}</div>
        <div class="fifa-stat"><span style="width:30px;">DEF</span> ${defense}</div>
    `;

    // Mercenary Rating UI (Mockup)
    const ratingHtml = `
        <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.1); border-radius:8px;">
            <div style="font-size:10px; color:#fff; text-align:center;">용병 매너 평가</div>
            <div style="display:flex; justify-content:center; gap:5px; margin-top:5px;">
                <span>😊</span><span>👍</span><span>👏</span>
            </div>
        </div>
    `;

    document.getElementById('previewStats').innerHTML = statHtml + ratingHtml;

    const profileEl = document.getElementById('fifaProfile');
    if (uploadedPhotoData) {
        profileEl.innerHTML = `<img src="${uploadedPhotoData}">`;
    } else {
        profileEl.innerHTML = '⚾';
    }

    document.getElementById('fifaCardPreview').style.display = 'block';
}

// Chart
function renderGraph(data) {
    if (!growthChart) return;
    growthChart.innerHTML = '';
    // Tiny delay for animation
    setTimeout(() => {
        data.forEach(item => {
            const barGroup = document.createElement('div');
            barGroup.className = 'bar-group';
            const isGrowth = item.latest ? 'growth' : '';
            barGroup.innerHTML = `
                <div class="bar ${isGrowth}" style="height: 0%;">
                    <div class="bar-value">${item.value}</div>
                </div>
                <div class="bar-label">${item.label}</div>
            `;
            growthChart.appendChild(barGroup);
            setTimeout(() => { barGroup.querySelector('.bar').style.height = item.percent + '%'; }, 50);
        });
    }, 100);
}

function addRecord() {
    const input = document.getElementById('speedInput');
    const speed = parseInt(input.value);
    if (!speed || speed < 70 || speed > 170) { alert("70~170 사이 숫자를 입력해주세요."); return; }

    growthData.forEach(d => d.latest = false);

    const percent = Math.min(Math.max((speed - 70) / 100 * 100, 10), 100); // Scale roughly
    growthData.push({ label: '오늘', value: speed, percent: percent, latest: true });

    if (growthData.length > 5) growthData.shift();

    if (speed > currentMaxSpeed) {
        currentMaxSpeed = speed;
        document.getElementById('maxSpeedDisplay').innerText = speed;
        alert("🔥 최고구속 갱신! 축하합니다!");
    } else {
        alert("✅ 기록이 추가되었습니다.");
    }

    renderGraph(growthData);
    input.value = '';
}

// Community Features
function addCheer(btn) {
    // Simple animation and number increment
    const text = btn.innerText;
    const parts = text.split('(');
    const label = parts[0];
    let count = parseInt(parts[1].replace(')', '').replace(/,/g, ''));

    count++;
    btn.innerText = `${label}(${count.toLocaleString()})`;

    btn.style.transform = "scale(1.1)";
    btn.style.borderColor = "#00C853";
    btn.style.color = "#00C853";
    setTimeout(() => {
        btn.style.transform = "scale(1)";
        btn.style.borderColor = "#eee";
        btn.style.color = "#333";
    }, 200);
}

// AI Action Sheet & Process
function openAiActionSheet() {
    document.getElementById('sheetOverlay').classList.add('active');
    document.getElementById('aiActionSheet').classList.add('active');
}

function closeAiActionSheet() {
    document.getElementById('sheetOverlay').classList.remove('active');
    document.getElementById('aiActionSheet').classList.remove('active');
}

function triggerAiProcess(type) {
    if (type === 'camera') {
        document.getElementById('cameraInput').click();
    } else {
        document.getElementById('videoInput').click();
    }
}

// 백엔드 없이 직접 분석 페이지로 이동
async function handleFileSelect(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    closeAiActionSheet();

    // 파일 유효성 검사
    if (!file.type.startsWith('video/')) {
        alert('❌ 비디오 파일만 업로드 가능합니다.\n지원 형식: MP4, MOV, WebM');
        return;
    }

    // 파일 크기 체크 (100MB 제한)
    if (file.size > 100 * 1024 * 1024) {
        alert('⚠️ 파일이 너무 큽니다.\n100MB 이하의 영상을 사용해주세요.');
        return;
    }

    // 로딩 UI 표시
    showLoader('영상 준비 중...');

    try {
        // Blob URL 생성 및 저장
        const blobUrl = URL.createObjectURL(file);

        // sessionStorage에 영상 정보 저장 (새 탭에서도 접근 가능)
        sessionStorage.setItem('pitchcraft_video_url', blobUrl);
        sessionStorage.setItem('pitchcraft_video_name', file.name);
        sessionStorage.setItem('pitchcraft_video_size', file.size.toString());

        console.log('📹 Video prepared:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB');

        updateLoader(50, '분석 페이지로 이동 중...');

        // 잠시 대기 후 분석 페이지로 이동
        setTimeout(() => {
            hideLoader();
            // 분석 페이지로 직접 이동
            window.location.href = 'kinematic_analysis.html';
        }, 500);

    } catch (error) {
        console.error('파일 처리 에러:', error);
        hideLoader();
        alert('❌ 파일 처리 중 오류가 발생했습니다.\n다른 영상으로 시도해주세요.');
    }
}

// 로더 UI 헬퍼
function showLoader(text) {
    const loader = document.getElementById('ai-loader');
    const fill = document.getElementById('loader-fill');
    const loaderText = document.getElementById('loader-text');
    loader.style.display = 'flex';
    fill.style.width = '0%';
    loaderText.innerText = text || 'AI 분석 중...';
}

function updateLoader(percent, text) {
    const fill = document.getElementById('loader-fill');
    const loaderText = document.getElementById('loader-text');
    fill.style.width = percent + '%';
    if (text) loaderText.innerText = text;
}

function hideLoader() {
    const loader = document.getElementById('ai-loader');
    const fill = document.getElementById('loader-fill');
    const loaderText = document.getElementById('loader-text');
    loader.style.display = 'none';
    fill.style.width = '0%';
    loaderText.innerText = 'AI 분석 중...';
}

// AI Sim (클라이언트 분석용 - 레거시)
function startAiSimulation() {
    // 클라이언트 분석 페이지로 바로 이동
    window.location.href = 'kinematic_analysis.html';
}

// Global Event for Escape key
// Team Badge Logic
function selectTeam() {
    alert("나의 응원팀 설정 (준비중)\n\n" +
        "좋아하는 구단을 선택하면\n" +
        "메인 화면이 해당 구단의 테마로 바뀝니다! 🎨");
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('div[style*="display: flex"]').forEach(el => el.style.display = 'none');
    }
});
