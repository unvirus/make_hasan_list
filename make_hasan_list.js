/*
�g���� 
Microsoft Edge��http://www.hasanmap.org���J�� 
Microsoft Edge�̊J�����[�h���J�� 
�R���\�[���^�u�Ɉړ����� 
�R���\�[���ɁA�{javascript���R�s�y�ijs�t�@�C���Ŗ���,�\�[�X�R�[�h���R�s�y�j���ăG���^�[ 
�f�[�^�擾�����܂ő҂� 
 
javascript�̕׋��̂��߂ɍ쐬�A�񓯊��ƕȂ������ē�� 
���C�Z���X�t���[ 
2022/06/22 unvirus 
*/


//�j�Y�҃��X�g�ǂꂩ��I��
//json�̍\���́A�j�Y�҂̃��j�[�NID�A�ܓx�A�o�x��1�P�ʂƂ��ĕ�������ł���
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

//�ő�10�܂ŁA���₷�ꍇ��hasan_data�v�f���𑝂₷����
const max_loop = 10;
var hasan_data = new Array("","","","","","","","","","","");


//�j�Y�ҏڍ׏��𓾂�A1���R�[�h���Ɏ擾����
function hasan_detaile_get(json, record, end, data) {
    return new Promise(function(resolve, reject) {
        var a;
        var b;

        //record��0����J�n����
        const obj = { hasan_id: json[record][0] };
        const body = Object.keys(obj).map((key) =>key + "=" + encodeURIComponent(obj[key])).join("&");

        fetch("/api/detail.php", { method, headers, body })
            .then(res => res.text())
            .then((place) => {
            //�ڍ׏����擾�ł���
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
                //�Ō�̃��R�[�h�ɓ��B����
                //���ʂ��o�͂���
                document.writeln(data);
                //�擾���[�v���I�����邽�߂ɁA0��Ԃ�
                resolve(0);
            } else {
                //���̃��R�[�h
                record++;
                //�擾���[�v�𑱍s���邽�߂ɁA1��Ԃ�
                resolve(1);
            }
        }) .catch(err => {
            //���̃��R�[�h�̏ڍ׏�񂪎擾�ł��Ȃ�����
            console.log("processing error=" + record + "/" + end);

            if (record >= end) {
                //�Ō�̃��R�[�h�ɓ��B����
                //���ʂ��o�͂���
                document.writeln(data);
                //�擾���[�v���I�����邽�߂ɁA0��Ԃ�
                resolve(0);
            } else {
                //���̃��R�[�h
                record++;
                //�擾���[�v�𑱍s���邽�߂ɁA1��Ԃ�
                resolve(1);
            }
        });
    }).then(function(result) {
        //hasan_detaile_get()�����ŌĂ΂��
        if (result == 1) {
            //�擾���[�v�𑱍s����
            return hasan_detaile_get(json, record, end, data);
        } else {
            //�擾���[�v���I������
            //alert("complete");
        }
    });
}

//�j�Y�҈ʒu���R�[�h�𓾂�
fetch(hasan_list).then(res => res.json()).then((place) => {
    console.log("total=" + place.length);
    
    //�N���A
    document.open();

    //�e�X�g�A�擾���郌�R�[�h���𐧌�����
    //place.length = 1002; 

    //���R�[�h���𕪊�
    var x = Math.floor(place.length / max_loop);
    var y = 0;
    var z = x;
    //���܂�
    var remain = place.length % max_loop; 

    //�񓯊��ŉ�
    for (var i = 0; i < max_loop; i ++) {
        hasan_detaile_get(place, y, z, hasan_data[i]);
        y = z + 1;
        z += x;
    }

    //���܂蕪�𓾂�
    if (remain) {
        z = place.length - 1;
        hasan_detaile_get(place, y, z, hasan_data[i]);
    }
});


