// 남은달 구하는 함수
const remainMonthCalculate = (nowYear, nowMonth, startYear, startMonth, payMonth) => {
    let remain
    // 나중에 시작 하고 싶을 경우
    if ((nowYear < startYear) || ((nowYear === startYear) && (nowMonth < startMonth))) {
        remain = payMonth
    } else {
        if (nowYear === startYear) {
            remain = payMonth - (nowMonth - startMonth)
        } else {
            remain = payMonth - ((nowYear - startYear) * 12 + startMonth - nowMonth)
        }
    }
    return remain
}

const onclickmypage = (id)=>{
    // console.log(id)
    location.href = "/itempage/?name=" + id
 }



const buttonClick = (select)=>{
    select === 1 && $('.tags').text('#결국 #다내꾸')
    select === 2 && $('.tags').text('#아주 #잠시 #은행꺼')
    select === 3 && $('.tags').text('#넌 #내꺼야!')
        $('.image-container').empty();
         $('.text-container').empty();
            $.ajax({
                type: "GET",
                url: "/mainpage/getitems",
                data: {},
                success: function (response) {
                    let items = response["items"];
                    if (items === undefined) {
                        let temp_html
                        temp_html = `
                <h5 class="add-text">[+]<br><br>추가 버튼으로<br>내 사치템을 추가해 보세요<br><br>⬊ ⬊ ⬊ ⬊ ⬊</h5>
            `
                        $('.text-container').append(temp_html)
                    } else {
                    for (let i = 0; i < items.length; i++) {
                        let img = items[i]['image'];
                        let itemId = items[i]['_id']

                        // 남은 달 구하기
                        let startDate = new Date(items[i]['date'])
                        let startYear = startDate.getFullYear()
                        let startMonth = startDate.getMonth()+1
                        let date = new Date
                        let nowMonth = date.getMonth()+1
                        let nowYear = date.getFullYear()
                        let payMonth = +(items[i]["months"])
                        let remainMonth = remainMonthCalculate(nowYear, nowMonth, startYear, startMonth, payMonth)

                        let textRemainMonth = remainMonth <= 0? '✔' : remainMonth

                        let temp_html
                        if(select === 1){temp_html = `<div class="image">
                                              <img
                                                id=${itemId}
                                                src=${img}
                                                alt="사고싶은 물건"
                                              
                                              />
                                              <div class="circle">${textRemainMonth}</div>
                                           </div>`
                        $('.image-container').append(temp_html)}

                        else if(select === 2 && remainMonth > 0){temp_html = `<div class="image">
                                              <img
                                                id=${itemId}
                                                src=${img}
                                                alt="사고싶은 물건"
                                               
                                              />
                                              <div class="circle">${textRemainMonth}</div>
                                           </div>`
                        $('.image-container').append(temp_html)}

                        else if(select === 3 && remainMonth <= 0){temp_html = `<div class="image">
                                              <img
                                                 id=${itemId}
                                                src=${img}
                                                alt="사고싶은 물건"
                                               
                                              />
                                              <div class="circle">${textRemainMonth}</div>
                                           </div>`
                        $('.image-container').append(temp_html)}
                        $(`#${itemId}`).click(()=>{onclickmypage(`${itemId}`)})
                    }}
                },
                error: function (response) {
                        console(response['responseJSON']['msg'])

                }
            })}

$(function() {
    $('.tags').text('#결국 #다내꾸')
    $('.image-container').empty();
    $('.text-container').empty();
    $.ajax({
        type: "GET",
        url: "/mainpage/getitems",
        data: {},

        success: function (response) {
            let items = response["items"];
            if (items === undefined) {
                let temp_html
                temp_html = `
                    <h5 class="add-text">[+]<br><br>추가 버튼으로<br>내 사치템을 추가해 보세요<br><br>⬊ ⬊ ⬊ ⬊ ⬊</h5>
                `
                $('.text-container').append(temp_html)
            }else{
                for (let i = 0; i < items.length; i++) {
                let img = items[i]['image'];
                let itemId = items[i]['_id']

                // 남은 달 구하기
                let startDate = new Date(items[i]['date'])
                let startYear = startDate.getFullYear()
                let startMonth = startDate.getMonth() + 1
                let date = new Date
                let nowMonth = date.getMonth() + 1
                let nowYear = date.getFullYear()
                let payMonth = +(items[i]["months"])
                let remainMonth = remainMonthCalculate(nowYear, nowMonth, startYear, startMonth, payMonth)

                let textRemainMonth = remainMonth <= 0 ? '✔' : remainMonth

                let temp_html

                    temp_html = `<div class="image">
                                              <img
                                                id=${itemId}
                                                src=${img}
                                                alt="사고싶은 물건"
                                              />
                                              <div class="circle">${textRemainMonth}</div>
                                           </div>`
                    $('.image-container').append(temp_html)
                $(`#${itemId}`).click(()=>{onclickmypage(`${itemId}`)})
            }
            }

        },
        error: function (response) {
            console(response['responseJSON']['msg'])

        }
    })
})

$(function(){
    $('.all-list-button').click(()=>{buttonClick(1)})
})

$(function(){
    $('.bank-list-button').click(()=>{buttonClick(2)})
})

$(function(){
    $('.my-list-button').click(()=>{buttonClick(3)})
})

$(function() {
    $('.add-button').click(()=>{location.href = '/addpage'})
})

function logout() {
    $.removeCookie('mytoken', { path: '/' });
    alert('로그아웃!')
    window.location.href = '/'
}



