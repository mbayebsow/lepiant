from http.client import HTTPSConnection
from urllib.parse import urljoin
from urllib.parse import urlparse

from requests import status_codes


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

        if reason and reason == 'OK':
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