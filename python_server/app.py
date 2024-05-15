from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'

def elo_change(u_elo, q_elo, is_correct, diff=1):
    ex_u = 1 / (1 + pow(10, (q_elo - u_elo) / 400))  # user chance of correct
    ex_q = 1 / (1 + pow(10, (u_elo - q_elo) / 400))  # user chance of incorrect
    k = 32 * diff  # scale factor

    if is_correct == 1:
        # correct
        u_elo = round(u_elo + k * (1 - ex_u))
        q_elo = round(q_elo + k * (0 - ex_q))
        # print(ex_u, ex_q, sep=' ')
        # print("Correct", u_elo, q_elo, sep=' ')
        return u_elo, q_elo, True
    else:
        # incorrect
        u_elo = round(u_elo + k * (0 - ex_u))
        q_elo = round(q_elo + k * (1 - ex_q))
        # print(ex_u, ex_q, sep=' ')
        # print("Incorrect", u_elo, q_elo, sep=' ')
        return u_elo, q_elo, False

@app.route('/update_elo', methods=['POST'])
def handle_update_elo():
    data = request.get_json()
    u_elo = data['u_elo']
    q_elo = data['q_elo']
    is_correct = int(data['is_correct'])
    
    new_rating1, new_rating2, _ = elo_change(u_elo, q_elo, is_correct)
    return jsonify({
        'u_elo': new_rating1,
        'q_elo': new_rating2
    })

    # return jsonify({
    #     'u_elo': u_elo,
    #     'q_elo': q_elo,
    #     'is_correct': is_correct
    
    # })


if __name__ == '__main__':
    app.run(debug=True)