from http.client import HTTPSConnection
from urllib.parse import urljoin
from urllib.parse import urlparse

from urllib.parse import urlparse, urljoin
from http.client import HTTPSConnection
import time
from typing import Optional, Union
import socket
import ssl

def get_html(url):
    parsed_url = urlparse(url)
    hostname = parsed_url.netloc
    path = parsed_url.path

    headers = {
        'Cache-Control': 'no-cache',
        'Cookie':'qub_anonymous_id=ee79584d-61c3-4c39-8e22-88b36dd26f83; silent-authentication=2',
        'Postman-Token':'49711f38-56de-4866-b6e0-cc7d36f9d1ee',
        'Host':hostname,
        'User-Agent':'PostmanRuntime/7.43.0',
        'Accept':'*/*',
        'Connection':'keep-alive',
    }

    try:
        connection = HTTPSConnection(hostname)
        connection.request('GET', path, '', headers)

        response = connection.getresponse()

        status_code = response.status
        reason = response.reason

        print(f"status_code: {status_code}")
        print(f"reason: {reason}")
        print(f"url: {url}")

        if status_code == 200 or status_code == 201 or status_code == 301 or status_code == 302:
            location_header = response.getheader('location')

            if location_header is None:
                return response.read()
            else:
                location = urljoin(url, location_header)
                return get_html(urljoin(hostname, location))
        else:
            return get_html(f"https://thingproxy.freeboard.io/fetch/{url}")
    except Exception as e:
        return get_html(f"https://thingproxy.freeboard.io/fetch/{url}")
    

# response = get_html('https://fr.allafrica.com/stories/202412280268.html')
# print(response)

class HTTPClientWithRetryAndRedirect:
    def __init__(
        self,
        max_retries: int = 3,
        initial_delay: float = 1.0,
        max_delay: float = 10.0,
        backoff_factor: float = 2.0
    ):
        self.max_retries = max_retries
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.backoff_factor = backoff_factor
        
    def get_html(self, url: str, current_retry: int = 0) -> Union[bytes, None]:

        parsed_url = urlparse(url)
        hostname = parsed_url.netloc
        path = parsed_url.path or "/"
        
        headers = {
            'Cache-Control': 'no-cache',
            'Cookie': 'qub_anonymous_id=ee79584d-61c3-4c39-8e22-88b36dd26f83; silent-authentication=2',
            'Postman-Token': '49711f38-56de-4866-b6e0-cc7d36f9d1ee',
            'Host': hostname,
            'User-Agent': 'PostmanRuntime/7.43.0',
            'Accept': '*/*',
            'Connection': 'keep-alive',
        }
        
        delay = self.initial_delay
        
        for attempt in range(self.max_retries):
            try:
                connection = HTTPSConnection(hostname)
                connection.request('GET', path, '', headers)
                response = connection.getresponse()
                
                status_code = response.status
                reason = response.reason
                
                print(f"Tentative {attempt + 1}/{self.max_retries}")
                print(f"status_code: {status_code}")
                print(f"reason: {reason}")
                print(f"url: {url}")
                
                # Gérer les codes de succès et redirection
                if status_code in [200, 201, 301, 302]:
                    location_header = response.getheader('location')
                    
                    if location_header is None:
                        return response.read()
                    else:
                        location = urljoin(url, location_header)
                        return self.get_html(location, current_retry)
                        
                # Si échec, utiliser le proxy
                else:
                    proxy_url = f"https://thingproxy.freeboard.io/fetch/{url}"
                    return self.get_html(proxy_url, current_retry)
                    
            except (socket.error, ssl.SSLError) as e:
                print(f"Erreur réseau: {str(e)}")
                if attempt == self.max_retries - 1:
                    # Dernière tentative : essayer avec le proxy
                    proxy_url = f"https://thingproxy.freeboard.io/fetch/{url}"
                    return self.get_html(proxy_url, current_retry)
                
                time.sleep(delay)
                delay = min(delay * self.backoff_factor, self.max_delay)
                
            finally:
                connection.close()
                
        # Si toutes les tentatives échouent
        return None
