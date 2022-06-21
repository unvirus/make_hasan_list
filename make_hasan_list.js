/*
使い方 
Microsoft Edgeでhttp://www.hasanmap.orgを開く 
Microsoft Edgeの開発モードを開く 
コンソールタブに移動する 
コンソールに、本javascriptをコピペ（jsファイルで無く,ソースコードをコピペ）してエンター 
データ取得完了まで待つ 
 
javascriptの勉強のために作成、非同期と癖があって難しい 
ライセンスフリー 
2022/06/22 unvirus 
*/


//破産者リストどれか一つ選ぶ
//jsonの構造は、破産者のユニークID、緯度、経度を1単位として複数並んでいる
//const hasan_list = "/data/2009.json";
//const hasan_list = "/data/2010.json";
//const hasan_list = "/data/2011.json";
//const hasan_list = "/data/2012.json";
//const hasan_list = "/data/2013.json";
//const hasan_list = "/data/2014.json";
//const hasan_list = "/data/2015.json";
//const hasan_list = "/data/2016.json";
//const hasan_list = "/data/2017.json";
const hasan_list = "/data/2018.json";
//const hasan_list = "/data/2019.json";
const method = "POST";
const headers = {
    'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
};

//最大10まで、増やす場合はhasan_data要素数を増やすこと
const max_loop = 10;
var hasan_data = new Array("","","","","","","","","","","");


//破産者詳細情報を得る、1レコード毎に取得する
function hasan_detaile_get(json, record, end, data) {
    return new Promise(function(resolve, reject) {
        var a;
        var b;

        //recordは0から開始する
        const obj = { hasan_id: json[record][0] };
        const body = Object.keys(obj).map((key) =>key + "=" + encodeURIComponent(obj[key])).join("&");

        fetch("/api/detail.php", { method, headers, body })
            .then(res => res.text())
            .then((place) => {
            //詳細情報を取得できた
            //console.log(place);

            console.log("processing=" + record + "/" + end);

            a = 0;
            b = place.indexOf('</br>', a);
            add_date = place.substring(a, b);
            //console.log(add_date);

            a = b + 5 + 1;  //</br> + space
            b = place.indexOf('</br>', a);
            addr = place.substring(a, b);
            //console.log(addr);

            a = b + 5;
            b = place.indexOf('</br>', a);

            a = b + 5 + 1;  //</br> + space
            b = place.indexOf('</br>', a);
            name = place.substring(a, b);
            //console.log(name);

            data += json[record][0] + ',' + json[record][1] + ',' + json[record][2] + ',' + add_date + ',' + addr + ',' + name + "<br>";

            if (record >= end) {
                //最後のレコードに到達した
                //結果を出力する
                document.writeln(data);
                //取得ループを終了するために、0を返す
                resolve(0);
            } else {
                //次のレコード
                record++;
                //取得ループを続行するために、1を返す
                resolve(1);
            }
        }) .catch(err => {
            //このレコードの詳細情報が取得できなかった
            console.log("processing error=" + record + "/" + end);

            if (record >= end) {
                //最後のレコードに到達した
                //結果を出力する
                document.writeln(data);
                //取得ループを終了するために、0を返す
                resolve(0);
            } else {
                //次のレコード
                record++;
                //取得ループを続行するために、1を返す
                resolve(1);
            }
        });
    }).then(function(result) {
        //hasan_detaile_get()完了で呼ばれる
        if (result == 1) {
            //取得ループを続行する
            return hasan_detaile_get(json, record, end, data);
        } else {
            //取得ループを終了する
            //alert("complete");
        }
    });
}

//破産者位置レコードを得る
fetch(hasan_list).then(res => res.json()).then((place) => {
    console.log("total=" + place.length);
    
    //クリア
    document.open();

    //テスト、取得するレコード数を制限する
    //place.length = 1002; 

    //レコード数を分割
    var x = Math.floor(place.length / max_loop);
    var y = 0;
    var z = x;
    //あまり
    var remain = place.length % max_loop; 

    //非同期で回す
    for (var i = 0; i < max_loop; i ++) {
        hasan_detaile_get(place, y, z, hasan_data[i]);
        y = z + 1;
        z += x;
    }

    //あまり分を得る
    if (remain) {
        z = place.length - 1;
        hasan_detaile_get(place, y, z, hasan_data[i]);
    }
});


