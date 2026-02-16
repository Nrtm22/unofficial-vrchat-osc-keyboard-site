const jsonUrl = 'https://raw.githubusercontent.com/fuku2019/VRChat-OSC-Keyboard/refs/heads/main/release.json';

fetch(jsonUrl)
  .then(res => res.json())
  .then(data => {
    // 1. バージョンタグを表示
    document.getElementById('v-tag').innerText = data.tag_name;

    // リリース日時を表示（日本時間でフォーマット）
    if (data.published_at) {
        const date = new Date(data.published_at);
        const formattedDate = date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        document.getElementById('release-date').innerText = formattedDate;
    }

    // 2. リリースノートページへのリンクを設定
    document.getElementById('release-page').href = data.html_url;

    // 3. assets配列から .exe ファイルを探してリンクを設定
    const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
    if (exeAsset) {
      document.getElementById('download-exe').href = exeAsset.browser_download_url;
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

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 250);
});
