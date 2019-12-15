module.exports = function(app, fs, path, getIP, axios, async, time, cheerio) {
    app.get('/', (req, res) => {
        console.log('main access');
        axios.get('/album')
        .then(({data}) => {
            console.log('rendered');
            res.render("index", {
                data,
                length: Object.keys(data).length
            });
        })
    });
    app.get('/album', (req, res) => {
        console.log("album access");
        let list = new Array();

        // axios.get('https://namu.wiki/w/AKMU/%EC%9D%8C%EB%B0%98?from=%EC%95%85%EB%8F%99%EB%AE%A4%EC%A7%80%EC%85%98%2F%EC%9D%8C%EB%B0%98')
        // .then(({data}) => {
        //     console.log(data);
        //     res.json(data);
        // })

        const req_link = "https://namu.wiki/w/AKMU/%EC%9D%8C%EB%B0%98?from=%EC%95%85%EB%8F%99%EB%AE%A4%EC%A7%80%EC%85%98%2F%EC%9D%8C%EB%B0%98";

        const html_data = async () => {
            try {
                return await axios.get(req_link);
            } catch(e) {
                console.log("Error occured while taking album information");
                console.log(e);
                res.end("Error");
            }
        }


        html_data()
        .then(({data}) => {

            var arr = {
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: []
            };

            const $ = cheerio.load(data);
            const $contIndentList = $("div#toc div.toc-indent").children("span.toc-item");
            
            $contIndentList.each(function(i, elmt) {
                var parseString = require('xml2js').parseString;
                var xml = $(this).text();
                // console.log(xml);
                var xml_href = $(this).find("a").attr('href');
                for (var i = 1; i <= 8; i++) {
                    const split_data = xml.split("");
                    if (split_data[0] == i && split_data[3] == ".") {
                        // console.log("pushed: " + i);
                        // 앞 번호 삭제
                        for (var p = 0; p < split_data.length; p++) {
                            if (split_data[p] == " ") {
                                xml = xml.replace(" ", "");
                                break;
                            } else {
                                // console.log(split_data[p]);
                                xml = xml.replace(split_data[p], "");
                                // console.log(xml);
                            }
                        }

                        // 앨범 개별 페이지 구분

                        // const $album_data = $('div.w').children("div.wiki-heading-content");
                        // const $album_data_head = $('div.w').children("div.wiki-heading a");
                        // // $album_data_head.each((l, elmt_l) => {
                        // //     if ($(this).attr("id") == xml_href.replace("#", "")) {
                        // //     }
                        // // })
                        // let indiv_yn;

                        // for (var q = 0; q < $album_data_head.length; q++) {
                        //     console.log($album_data_head[q]);
                        //     if ($($album_data_head[q]).attr("id") == xml_href.replace("#", "")) {
                        //         if ($($album_data[q+2]).find("div.wiki-paragraph").text().includes("자세한") == true) {
                        //             indiv_yn = true;
                        //         } else {
                        //             indiv_yn = false;
                        //         }
                        //     }
                        // }
                        // if ($album_data_head)

                        
                        arr[i].push({
                            title: xml,
                            href: req_link + xml_href,
                            // individual: indiv_yn,
                            playlist: [],
                            opendate: ""
                        });
                    } else {
                        continue;
                    }
                }
            })

            console.log(arr);


            const $test = $('title');
            // console.log($test.text());
            // console.log(data);
            // console.log(iconv.convert($contIndentList.html()).toString());



            // 배열에 정보 추가: playlist & opendate

            


            res.json(arr);
        })
    })
}