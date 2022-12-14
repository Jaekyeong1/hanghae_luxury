"use strict";

// variables
const endBtn = document.getElementById('END_BTN');
const delBtn = document.getElementById('DEL_BTN');
const leftBtn = document.getElementById('NAV_LEFT');
const rightBtn = document.getElementById('NAV_RIGHT');

// variables get from DB
let name, price, pay_per_month, start_date, img, complete, item_list, this_objectId, this_index, months;
// Global Variables
let payedMonth = 0;
let leftMonth = 0;

const searchParams = new URLSearchParams(location.search);

for (const param of searchParams) {
  this_objectId = param[1];
}

// function activates when DOMtree is organized
$(document).ready(function() {
  console.log('itempage.js called');
  $('ITEM_WRAP').fadeIn();

  get_item();
  this_index = get_item_list();
  pay_per_month = parseInt(price/months);

  calc_leftmonth(start_date);
  if (leftMonth <= 0 && complete == false){
    complete_item();
    complete == true;
  }

  to_html_img(img);
  to_html_info(name, price);
  if (complete == true){
    remove_btn();
    to_html_complete(name);
  }
  else {
    to_html_pay(leftMonth*pay_per_month, pay_per_month);
    to_html_month(leftMonth);
    to_html_drip(pay_per_month);
  }
});

function calc_leftmonth(date){
  let now = new Date();
  payedMonth = parseInt((now.getTime() - start_date.getTime())/(1000*60*60*24*30));
  if (now.getTime() - start_date.getTime() < 0){
    payedMonth = 0;
  }
  leftMonth = Math.ceil((price - payedMonth*pay_per_month) / pay_per_month);
}

// innerHTML functions
function to_html_img(img){
  let post = document.querySelector("#ITEM_IMG");
  let tmp = `<img src="${img}">`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function to_html_info(name, price){
  let post = document.querySelector("#TXT_INFO");
  let tmp = `<span style="font-size:2vh">${name}</span>
            <span style="font-size:3vh">${price}원</span>`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function to_html_pay(price, pay_per_month){
  let post = document.querySelector("#TXT_PAY");
  let tmp = `<span style="font-size:2vh">남은 금액 : ${price}원 / ${pay_per_month}원</span>`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function to_html_month(month){
  let post = document.querySelector("#TXT_MONTH");
  let tmp = `<span style="font-size:3vh">😀${month}개월😀 뒤면 내꺼!</span>`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function to_html_drip(pay_per_month){
  let post = document.querySelector("#TXT_DRIP");
  let dripSample1 = [
    '<span style="font-size:2vh"><em><del>이 돈이면 한 달에 치킨이 ',
    '<span style="font-size:2vh"><em><del>이 돈이면 한 달에 국밥이 ',
    '<span style="font-size:2vh"><em><del>이 돈이면 한 달에 짜장면이 ',
    '<span style="font-size:2vh"><em><del>이 돈이면 한 달에 쌀이 ',
    '<span style="font-size:2vh"><em><del>이 돈이면 한 달에 라면이 '
  ];
  let dripSample2 = [
    '개......</del></em></span>',
    '개......</del></em></span>',
    '개......</del></em></span>',
    '포대......</del></em></span>',
    '개......</del></em></span>'
  ];
  let dripPrice = [
    10000, 6000, 5000, 40000, 1000
  ];

  let num = Math.floor(Math.random() * (4 - 0 + 1)) + 0; // 0~4의 난수 발생
  let count = Math.floor(parseFloat(pay_per_month / dripPrice[num])*10)/10;
  let tmp = `${dripSample1[num]} ${count}${dripSample2[num]}`;

  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function to_html_complete(name){
  let post = document.querySelector("#TXT_MONTH");
  let tmp = `<span style="font-size:1.7vh">이제 이 ${name}은 제껍니다.</span>`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;

  post = document.querySelector("#TXT_DRIP");
  tmp = `<span style="font-size:2vh">힘든 시간을 이겨낸 스스로에게 박수를!!👏</span>`;
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
  post.innerHTML += tmp;
}
function remove_btn(){
  let post = document.querySelector("#ITEM_BTN");
  while(post.firstChild){
      post.removeChild(post.firstChild);
  }
}

// function to control data in DB
function get_item(){
  $.ajax({
       type: 'GET',
       url: '/itempage/getitem',
       data: {},
       async: false,
       success: function(response) {
         console.log("Item info");
         console.log(response);
         name = response['title'];
         price = response['price'];
         months = response['months'];
         start_date = new Date(response['date']);
         img = response['image'];
         complete = response['complete'];
       }
   });
}
function get_item_list(){
  $.ajax({
       type: 'GET',
       url: '/itempage/getitemlist',
       data: {},
       async: false,
       success: function(response) {
         console.log("Item list");
         console.log(response);
         item_list = response;
       }
   });
   for (let i = 0; i<item_list.length; i++){
     if (item_list[i]['_id'] == this_objectId){
       return i;
     }
   }
}
function complete_item(){
  $.ajax({
    type: "POST",
    url: "/itempage/complete",
    data: {},
    success: function(response) {
      alert(response["msg"])
      window.location.reload()
    }
  });
}
function delitem(){
  console.log('DEL ITEM called');
  $.ajax({
    type: "POST",
    url: "/itempage/delete",
    data: {},
    success: function(response) {
      alert(response["msg"])
    }
  });
  window.location.href = "/mainpage";
}

// function to browse other item
function to_left_item(){
  if (this_index - 1 < 0){
    alert("첫번째 아이템입니다.");
    return;
  }
  console.log("To left item");
  var url = "/itempage?name=" + item_list[this_index-1]['_id'];
  window.location.href = url;
}
function to_right_item(){
  if (this_index + 1 > item_list.length - 1){
    alert("마지막 아이템입니다.");
    return;
  }
  console.log("To right item");
  var url = "/itempage?name=" + item_list[this_index+1]['_id'];
  window.location.href = url;
}

// event Listeners
endBtn.addEventListener('click', complete_item);
delBtn.addEventListener('click', delitem);
leftBtn.addEventListener('click', to_left_item);
rightBtn.addEventListener('click', to_right_item);
