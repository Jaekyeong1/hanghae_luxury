from datetime import datetime
from flask import Blueprint, Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import certifi
from bson.objectid import ObjectId

client = MongoClient('mongodb+srv://Luxury:hanghae99@luxury.uhfyrvo.mongodb.net/Luxury?retryWrites=true&w=majority',tlsCAFile=certifi.where())
db = client.Luxury
# client = MongoClient('mongodb+srv://mugyeol:spartan@cluster0.n9bnorv.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=certifi.where())
# db = client.dbsparta

addpage = Blueprint("addpage", __name__, template_folder="templates")

@addpage.route('/')
def home():
    return render_template('addpage.html')

@addpage.route('/url', methods=["POST"])
def get_url():
    url_receive = request.form.get('url_give')

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    
    # price=""
    price = soup.select_one('#content > div > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div._1ziwSSdAv8 > div.WrkQhIlUY0 > div > strong > span._1LY7DqCnwR').text
    title = soup.select_one('meta[property="og:title"]')['content']
    image = soup.select_one('meta[property="og:image"]')['content']

    return jsonify({ 'title': title,
        'image': image,
        'price': price})
        
@addpage.route('/adding', methods=["POST"])
def item_post():
    img_receive = request.form.get('img_give')
    title_receive = request.form.get('title_give')
    price_receive  = int(request.form.get('price_give'))
    date_receive = datetime.strptime(request.form.get('date_give'),'%Y-%m-%d')
    months_receive = request.form.get('months_give')
    
    doc = {'email':"abc@naver.com",
        'title': title_receive,
        'image': img_receive,
        'price': price_receive,
        'date': date_receive,
        'months':months_receive
    }
    db.items.insert_one(doc)
    # return jsonify({'title': title,'image':image})
    return jsonify({ 'msg': "success"})

    