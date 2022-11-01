import requests

import requests
import json 
res = requests.get('https://pokeapi.co/api/v2/pokemon/')
response = json.loads(res.text)
print(response)