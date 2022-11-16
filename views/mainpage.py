from flask import Blueprint, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import certifi

import jwt

SECRET_KEY = 'SPARTA'


ca = certifi.where()

client = MongoClient('mongodb+srv://Luxury:hanghae99@luxury.uhfyrvo.mongodb.net/Luxury?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.Luxury

mainpage = Blueprint("mainpage", __name__, template_folder="templates")

@mainpage.route('/')
def question():

    return render_template("mainpage.html")

@mainpage.route("/getitems", methods=["GET"])
def all_items_get():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        print(payload)

        # payload 안에 id가 들어있습니다. 이 id로 유저정보를 찾습니다.
        # 여기에선 그 예로 닉네임을 보내주겠습니다.

        items = list(db.items.find({'userid': payload['id']}))
        for i in items:
            i['_id'] = str(i['_id'])
        return jsonify({'result': 'success', 'items': items})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

