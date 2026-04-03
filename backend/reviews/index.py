import json
import os
import psycopg2

SCHEMA = "t_p63186686_clean_care_sales"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """Получение и добавление отзывов покупателей."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, text, rating, created_at FROM {SCHEMA}.reviews ORDER BY created_at DESC LIMIT 50")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        reviews = [{"id": r[0], "name": r[1], "text": r[2], "rating": r[3], "avatar": r[1][0].upper()} for r in rows]
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"reviews": reviews}, ensure_ascii=False)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        name = (body.get("name") or "").strip()[:100]
        text = (body.get("text") or "").strip()
        rating = int(body.get("rating") or 5)
        if not name or not text:
            return {"statusCode": 400, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "Имя и текст обязательны"})}
        if rating < 1 or rating > 5:
            rating = 5
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.reviews (name, text, rating) VALUES (%s, %s, %s) RETURNING id", (name, text, rating))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"id": new_id, "name": name, "text": text, "rating": rating, "avatar": name[0].upper()}, ensure_ascii=False)}

    return {"statusCode": 405, "headers": {"Access-Control-Allow-Origin": "*"}, "body": ""}
