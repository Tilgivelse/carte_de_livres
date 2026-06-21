import hashlib
import hmac
import json
from dataclasses import asdict
from pathlib import Path
from urllib.parse import parse_qsl

from flask import Flask, jsonify, request, abort, send_from_directory

DATAFILE = Path('books_db.json')
BOT_TOKEN = "8748018270:AAGjH_NjhQeYyN27QVBYHlmS8tI4JoGZZgg"

app = Flask(__name__)
@app.get('/')
def serve_miniapp():
    return send_from_directory('.', 'miniapp.html')


def load_db():
    if not DATAFILE.exists():
        return {}
    with DATAFILE.open('r', encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        return {'legacy_user': data}
    return data


def verify_telegram_init_data(init_data: str, bot_token: str) -> dict:
    if not init_data:
        abort(401, description='Missing Telegram init data')

    parsed = dict(parse_qsl(init_data, strict_parsing=True))
    received_hash = parsed.pop('hash', None)
    if not received_hash:
        abort(401, description='Missing Telegram hash')

    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(parsed.items()))
    secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        abort(401, description='Invalid Telegram init data')

    user_raw = parsed.get('user')
    if not user_raw:
        abort(401, description='Missing Telegram user')

    return json.loads(user_raw)


@app.get('/api/miniapp/books')
def get_books():
    init_data = request.headers.get('X-Telegram-Init-Data', '')
    print('INIT_DATA length =', len(init_data))
    print('INIT_DATA preview =', init_data[:200])
    user = verify_telegram_init_data(init_data, BOT_TOKEN)
    user_id = str(user['id'])

    db = load_db()
    books = db.get(user_id, [])

    normalized = []
    for item in books:
        item.setdefault('country_code', '')
        item.setdefault('country_ru', '')
        item.setdefault('comment', '')
        item.setdefault('score', 0)
        normalized.append(item)

    return jsonify({
        'user': {
            'id': user['id'],
            'first_name': user.get('first_name', ''),
            'username': user.get('username', '')
        },
        'books': normalized
    })


@app.get('/api/miniapp/countries-summary')
def get_countries_summary():
    init_data = request.headers.get('X-Telegram-Init-Data', '')
    user = verify_telegram_init_data(init_data, BOT_TOKEN)
    user_id = str(user['id'])

    db = load_db()
    books = db.get(user_id, [])

    summary = {}
    for item in books:
        code = item.get('country_code', '')
        name = item.get('country_ru', '')
        if not code:
            continue
        if code not in summary:
            summary[code] = {'country_code': code, 'country_ru': name, 'count': 0}
        summary[code]['count'] += 1

    ordered = sorted(summary.values(), key=lambda row: (-row['count'], row['country_ru']))
    return jsonify({'countries': ordered})


@app.get('/health')
def health():
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
