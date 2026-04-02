const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

canvas.width = 400;
canvas.height = 600;

// 게임 설정
let score = 0;
let gameActive = true;
const gravity = 0.4;
const moveSpeed = 5;

// 캐릭터 객체
const player = {
    x: 200,
    y: 100,
    width: 30,
    height: 30,
    dy: 0,
    color: '#00d2ff'
};

// 발판 설정
let platforms = [];
const platformWidth = 80;
const platformHeight = 15;
const platformCount = 7;

// 키 입력 상태
const keys = {};

// 발판 초기 생성
function initPlatforms() {
    platforms = [];
    for (let i = 0; i < platformCount; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - platformWidth),
            y: i * (canvas.height / platformCount),
        });
    }
}

// 조작 이벤트
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function update() {
    if (!gameActive) return;

    // 1. 중력 적용
    player.dy += gravity;
    player.y += player.dy;

    // 2. 키보드 이동
    if (keys['ArrowLeft'] && player.x > 0) player.x -= moveSpeed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += moveSpeed;

    // 3. 발판 로직 (위로 이동시켜 낙하 효과 구현)
    platforms.forEach(plat => {
        plat.y -= 2; // 발판이 위로 올라감 (캐릭터가 떨어지는 느낌)

        // 캐릭터가 발판 위에 닿았을 때 (내려오는 중일 때만)
        if (player.dy > 0 &&
            player.x < plat.x + platformWidth &&
            player.x + player.width > plat.x &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + platformHeight + player.dy) {
            
            player.y = plat.y - player.height;
            player.dy = 0;
        }

        // 발판이 화면 위로 사라지면 아래에서 새로 생성
        if (plat.y < -platformHeight) {
            plat.y = canvas.height;
            plat.x = Math.random() * (canvas.width - platformWidth);
            score++;
            scoreElement.innerText = `Score: ${score}`;
        }
    });

    // 4. 게임 오버 조건
    // 천장에 닿거나 바닥으로 완전히 떨어졌을 때
    if (player.y < 0 || player.y > canvas.height) {
        endGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 캐릭터 그리기
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 발판 그리기
    ctx.fillStyle = '#ff4b2b';
    platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, platformWidth, platformHeight);
    });

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

function endGame() {
    gameActive = false;
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.innerText = `최종 점수: ${score}`;
}

function resetGame() {
    score = 0;
    scoreElement.innerText = `Score: 0`;
    player.x = 200;
    player.y = 100;
    player.dy = 0;
    gameActive = true;
    gameOverScreen.classList.add('hidden');
    initPlatforms();
}

// 게임 시작
initPlatforms();
draw();