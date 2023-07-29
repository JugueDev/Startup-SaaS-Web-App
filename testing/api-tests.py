import requests
import json
import sys

def test_requests(json_file, json_file_updated, micro, microId):
    print("****  Testing POST method    ****")
    r = requests.post(url + micro, data=json_file, headers=headers)
    print("post result: " + r.text)
    user_id = json.loads(r.text)[microId]
    print("POST method succesfully passed.")

    print("\n****   Testing GET method   ****")
    r = requests.get(url + micro + "/"+user_id)
    print("GET result: " + r.text)
    print("GET method succesfully passed.")

    print("\n****   Testing UPDATE method   ****")
    r = requests.post(url + micro + "/" + user_id, data=json_file_updated, headers=headers)
    print("UPDATE result: " + r.text)
    print("UPDATE method succesfully passed.")

    print("\n****   Testing DELETE method   ****")
    r = requests.delete(url + micro + "/" + user_id)
    print("DELETE result: " + r.text)
    print("DELETE method succesfully passed.")


if __name__ == "__main__":

    # General Variables
    headers = {'Content-Type' : 'application/json'}
    url =  sys.argv[1]
    print("URL: " + url)

    # Testing user microservices
    user = '{"name": "April", "email": "qwe@gmail.com", "edad": "15", "prod_favorito": "miel", "interaccion": "1"}'
    user_updated = '{"name": "Jan", "email": "asbdc@gmail.com", "edad": "27", "prod_favorito": "helados", "interaccion": "9"}'
    print("\n\n******** Testing USER ********")
    test_requests(user, user_updated, "user", "userId")

    # Testing Sale microservices
    print("\n\n******** Testing USER ********")
    sale = '{"date": "23-07-2012", "price": "12"}'
    sale_updated = '{"date": "12-02-2000", "price": "16"}'
    test_requests(sale, sale_updated, "sale", "saleId")

    print("Everything passed")