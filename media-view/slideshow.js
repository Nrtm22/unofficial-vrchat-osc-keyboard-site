const slideImg = document.getElementById('slideshow-image');
const maxSlideImages = 128; // 上限枚数
let slideImages = [];
let currentIndex = 0;

// ★ 追加: 指定したミリ秒だけ待機する便利な関数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 画像を順番に取得する関数
async function loadSlideshowImages() {
    const folderPath = '../fake_img_360p/'; // フォルダパスを指定
    
    for (let i = 1; i <= maxSlideImages; i++) {
        const url = `${folderPath}${i}.webp`;
        let isSuccess = false;

        // ★ 修正: 最大2回試行（初回 + 1回のリトライ）するループ
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    slideImages.push(url);
                    isSuccess = true;
                    break; // 成功したらリトライ用のループを抜ける
                }
            } catch (e) {
                console.warn(`[${url}] 取得失敗 (${attempt}回目)`);
            }

            // 1回目で失敗した場合は、少し（200ms）待ってから2回目の再試行へ
            if (attempt === 1 && !isSuccess) {
                await delay(200);
            }
        }

        // 2回試してもダメだった場合は、ファイルが無いと判断して連番取得を終了
        if (!isSuccess) {
            break; 
        }

        // ★ 成功した場合でも、次の画像を取得しに行く前に最低200msの遅延を入れる
        await delay(200);
    }
    
    // 画像が1枚以上見つかればスライドショー開始
    if (slideImages.length > 0) {
        startSlideshow();
    } else {
        console.warn("スライドショー用の画像が見つかりませんでした！");
    }
}

// 2. スライドショーを開始する関数
function startSlideshow() {
    // まず最初の1枚目を表示
    showImage(0);

    setInterval(() => {
        // 次のインデックスを計算（最後まで行ったら 0 に戻る）
        currentIndex = (currentIndex + 1) % slideImages.length;
        showImage(currentIndex);
    }, 200); 
}

// 3. 画像をふわっと切り替える関数
function showImage(index) {
    // 一度透明にする（フェードアウト）
    slideImg.classList.remove('active');

    // CSSのフェードアウトが完了する頃に画像を差し替える
    setTimeout(() => {
        slideImg.src = slideImages[index];
        
        // 新しい画像がブラウザに読み込まれたら透明度を戻す（フェードイン）
        slideImg.onload = () => {
            slideImg.classList.add('active');
        };
    }, 100);
}

// 実行！
loadSlideshowImages();
