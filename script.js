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
