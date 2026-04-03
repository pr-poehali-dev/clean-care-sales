import json
import os
import urllib.request
import urllib.parse

CHAT_ID = "-4641407660"  # https://t.me/+hTjJS5XakaQzODNi

def send_telegram(text: str):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())

def handler(event: dict, context) -> dict:
    """Отправка сообщения из формы контактов в Telegram-чат."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = (body.get("name") or "").strip()
    contact = (body.get("contact") or "").strip()
    delivery = (body.get("delivery") or "").strip()
    message = (body.get("message") or "").strip()

    if not name or not message:
        return {"statusCode": 400, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "Имя и сообщение обязательны"})}

    text = (
        f"📩 <b>Новое сообщение с сайта</b>\n\n"
        f"👤 <b>Имя:</b> {name}\n"
        f"📞 <b>Контакт:</b> {contact or 'не указан'}\n"
        f"🚚 <b>Доставка:</b> {delivery or 'не выбрана'}\n"
        f"💬 <b>Сообщение:</b>\n{message}"
    )

    result = send_telegram(text)
    if result.get("ok"):
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"success": True})}
    return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "Ошибка отправки"})}
