(function() {
    var jsonUrl = 'https://raw.githubusercontent.com/fuku2019/VRChat-OSC-Keyboard/main/release.json';

    // 古い環境互換の XMLHttpRequest 作成
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xhr) {
        xhr.open('GET', jsonUrl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        // ブラウザ標準の JSON パーサー、なければ eval を使用（ES3当時の標準的な手法）
                        var data;
                        if (window.JSON && window.JSON.parse) {
                            data = window.JSON.parse(xhr.responseText);
                        } else {
                            data = eval('(' + xhr.responseText + ')');
                        }
                        
                        // バージョンタグの挿入
                        if (document.getElementById('v-tag')) {
                            document.getElementById('v-tag').innerHTML = data.tag_name;
                        }

                        // リリース日時の取得と手動フォーマット (toLocaleDateStringのオプションはCSS2.1世代ではバグるため)
                        if (data.published_at) {
                            var date = new Date(data.published_at);
                            if (!isNaN(date.getTime())) {
                                var year = date.getFullYear();
                                var month = date.getMonth() + 1;
                                var day = date.getDate();
                                if (month < 10) month = '0' + month;
                                if (day < 10) day = '0' + day;
                                var formattedDate = year + '/' + month + '/' + day;
                                if (document.getElementById('release-date')) {
                                    document.getElementById('release-date').innerHTML = formattedDate;
                                }
                            }
                        }

                        // リリースノートページへのリンク
                        if (document.getElementById('release-page')) {
                            document.getElementById('release-page').href = data.html_url;
                        }

                        // assets配列から .exe ファイルをループで探索 (Array.find / endsWith の代替)
                        if (data.assets) {
                            var exeAsset = null;
                            for (var i = 0; i < data.assets.length; i++) {
                                var asset = data.assets[i];
                                if (asset.name && asset.name.indexOf('.exe') !== -1 && asset.name.indexOf('.exe') === asset.name.length - 4) {
                                    exeAsset = asset;
                                    break;
                                }
                            }
                            if (exeAsset) {
                                if (document.getElementById('download-exe')) {
                                    document.getElementById('download-exe').href = exeAsset.browser_download_url;
                                }
                                if (document.getElementById('file-name-display')) {
                                    document.getElementById('file-name-display').innerHTML = exeAsset.name;
                                }
                            }
                        }

                    } catch (e) {
                        if (document.getElementById('v-tag')) {
                            document.getElementById('v-tag').innerHTML = "解析エラー";
                        }
                    }
                } else {
                    if (document.getElementById('v-tag')) {
                        document.getElementById('v-tag').innerHTML = "取得エラー";
                    }
                }
            }
        };
        xhr.send(null);
    }
})();