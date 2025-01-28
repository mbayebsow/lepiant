from locust import HttpUser, task, between
import json


class ApiUser(HttpUser):
    wait_time = between(1, 3)
    api_version = "v1"
    user_count = 0
    token = None  # Store the token

    def on_start(self):
        # Login to get access token
        self.client.headers = {"Content-Type": "application/x-www-form-urlencoded"}
        self.base_url = f"/{self.api_version}"

        # Login credentials as form data
        credentials = {
            "username": "demo",
            "password": "demo",
            "grant_type": "password",
        }

        try:
            response = self.client.post(
                f"{self.base_url}/auth/login",
                data=credentials,  # Using data instead of json
                name="/auth/login",
            )

            if response.status_code == 200:
                self.token = response.json()["access_token"]
                # Reset content type to JSON for subsequent requests
                self.client.headers.update(
                    {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.token}",
                    }
                )
            else:
                print(f"Login failed with status code: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Login error: {str(e)}")

    # Example of using the helper method
    @task(1)
    def get_profile(self):
        self.client.get(
            f"{self.base_url}/auth/me",
        )

    @task(1)
    def update_profile(self):
        profile_data = {"firstName": "Updated", "lastName": "User", "language": "en"}
        self.client.put(f"{self.base_url}/auth/profile", json=profile_data)

    # Articles endpoints
    @task(2)
    def get_articles(self):
        self.client.get(f"{self.base_url}/articles/subscribed")

    @task(1)
    def get_article_by_id(self):
        self.client.get(f"{self.base_url}/articles/1")

    @task(1)
    def save_article(self):
        self.client.post(f"{self.base_url}/articles/1/toggle-save")

    # Channels endpoints
    @task(2)
    def get_channels(self):
        self.client.get(f"{self.base_url}/channels")

    @task(1)
    def get_channel_by_id(self):
        self.client.get(f"{self.base_url}/channels/1")

    @task(1)
    def subscribe_channel(self):
        self.client.post(f"{self.base_url}/channels/1/toggle-subscribe")

    # Radios endpoints
    @task(2)
    def get_radios(self):
        self.client.get(f"{self.base_url}/radios")

    @task(1)
    def get_radio_by_id(self):
        self.client.get(f"{self.base_url}/radios/liked")

    @task(1)
    def like_radio(self):
        self.client.post(f"{self.base_url}/radios/1/toggle-like")

    # Newspapers endpoints
    @task(1)
    def get_newspapers(self):
        self.client.get(f"{self.base_url}/newspapers?date=2024-12-24")

    # Press Reviews endpoints
    @task(1)
    def get_press_reviews(self):
        self.client.get(f"{self.base_url}/press-reviews?date=2024-12-11")
