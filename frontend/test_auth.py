import requests

BASE_URL = "http://localhost:8001/api/v1"

# 1. Register
reg_data = {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
}
r1 = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
print("Register:", r1.status_code, r1.text)

# 2. Login
login_data = {
    "username": "test@example.com",
    "password": "password123"
}
r2 = requests.post(f"{BASE_URL}/auth/login", data=login_data)
print("Login:", r2.status_code, r2.text)
