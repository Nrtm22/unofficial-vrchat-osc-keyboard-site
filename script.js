const jsonUrl = 'https://raw.githubusercontent.com/fuku2019/VRChat-OSC-Keyboard/refs/heads/main/release.json';

fetch(jsonUrl)
  .then(res => res.json())
  .then(data => {
    // バージョンタグを取得
    document.getElementById('v-tag').innerText = data.tag_name;

    // リリース日時を取得（日本時間でフォーマット）
    if (data.published_at) {
        const date = new Date(data.published_at);
        const formattedDate = date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        document.getElementById('release-date').innerText = formattedDate;
    }

    // リリースノートページへのリンクを取得
    document.getElementById('release-page').href = data.html_url;

    // assets配列から .exe ファイルを探してリンクを取得
    const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
    if (exeAsset) {
      document.getElementById('download-exe').href = exeAsset.browser_download_url;
      document.getElementById('file-name-display').innerText = exeAsset.name;
    }
    
    // リリースノート（body）の反映
    const mdElement = document.getElementById('release-body-md');
    if (data.body) {
        mdElement.innerHTML = `<script type="text/markdown">${data.body}<\/script>`;
    }
    
  })
  .catch(err => {
    console.error("JSONの読み込みに失敗しました:", err);
    document.getElementById('v-tag').innerText = "取得エラー";
  });
  
// ロード画面
window.addEventListener('load', () => {
	/*
	const el = document.getElementById("load-title");
	const text = new ShuffleText(el);
	text.start()
	*/
	setTimeout(() => {
	    const loader = document.getElementById('loader');
	    loader.classList.add('loaded');
	    const mainC = document.getElementById('mainC');
	    mainC.classList.add('loaded');
	    // テキストシャッフル
		const el = document.getElementById("shuffle-pls");
		const text = new ShuffleText(el);
		text.duration = 2000; 
		text.sourceRandomCharacter = el.innerText;
		text.emptyCharacter = "";
		text.start();
		}, 500);
});

const video = document.querySelector('.video-background video');

if (video) {
    // 動画が再生可能な状態になったら実行
    video.addEventListener('canplay', () => {
        video.classList.add('is-playing');
    });

    // 万が一エラーで読み込めない場合の処理
    video.addEventListener('error', () => {
        console.warn("Background Video failed to load.");
        video.style.display = 'none'; // 完全に非表示にする
    });
}





// 回転
const polygonBg = document.getElementById('polygon-background');
const polygon = document.getElementById('polygon-container');
const scene = document.getElementById('scene-container');
const maxImages = 128;   // 念のための無限ループ防止上限
let images = [];

// ★追加: 配列の中身をランダムに並び替える関数（Fisher-Yatesシャッフル）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 要素を入れ替える
    }
}

// 1. 画像を順番に取得する関数
async function loadImages() {
    // フォルダのパスを指定
    const folderPath = './fake_img_360p/'; 
    
    for (let i = 1; i <= maxImages; i++) {
        const url = `${folderPath}${i}.webp`;
        try {
            // fetchのHEADメソッドでファイルが存在するか確認
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                images.push(url);
            } else {
                break; // 404エラーなどが出たら連番終了とみなす
            }
        } catch (e) {
            break;
        }
    }
    
    // ★修正: 画像が集まったら、組み立てる「前」にシャッフルを実行する
    shuffleArray(images);
    
    // 多角形を組み立てる
    buildPolygon();
}

// 2. 多角形を組み立てる関数
function buildPolygon() {
    if (!polygon || !scene) return; // sceneの存在確認も追加
    const n = images.length;
    if (n < 3) return;

    // ★修正1: 最初にサイズなどの変数を適用する
    const dynamicPadding = 360 / n;
    polygonBg.style.setProperty('--dypad', `${dynamicPadding}dvw`);
    
    const dynamicSize = 256 / n; 
    scene.style.setProperty('--dysize', `${dynamicSize}dvw`);
    
    const dynamicPers = n * 100; 
    scene.style.setProperty('--pers', `${dynamicPers}px`);

    const dynamicRotateX = 180 / n; 
    polygon.style.setProperty('--rx', `${dynamicRotateX}deg`);

    // ★修正2: サイズを変更した「後」に、実際のピクセル幅を取得して計算する
    const imageWidth = polygon.clientWidth;
    const radius = Math.round((imageWidth / 2) / Math.tan(Math.PI / n));

    // ★修正3: scene.innerHTML = ''; は絶対に書かない！
    polygon.innerHTML = '';

    images.forEach((url, index) => {
        const face = document.createElement('div');
        face.className = 'face';
        face.style.backgroundImage = `url(${url})`;
        
        const angle = (360 / n) * index;
        // 各面を配置
        face.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        
        polygon.appendChild(face);
    });
}

// 実行！
loadImages();

// 画面サイズが変わった時に多角形の形を崩さないための処理（任意）
window.addEventListener('resize', buildPolygon);
