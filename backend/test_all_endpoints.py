import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoints():
    # Login first
    print("=== Testing Admin Login ===")
    login_response = requests.post(f"{BASE_URL}/admin/login", json={
        "email": "admin@healthcare.com",
        "password": "admin123"
    })
    print(f"Status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print("Login failed!")
        return
    
    token = login_response.json()['token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test dashboard
    print("\n=== Testing Dashboard ===")
    dash_response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
    print(f"Status: {dash_response.status_code}")
    if dash_response.status_code == 200:
        data = dash_response.json()
        print(f"Stats: {json.dumps(data['stats'], indent=2)}")
        print(f"Recent appointments: {len(data.get('recent_appointments', []))}")
    
    # Test doctors
    print("\n=== Testing Doctors ===")
    doctors_response = requests.get(f"{BASE_URL}/admin/doctors", headers=headers)
    print(f"Status: {doctors_response.status_code}")
    if doctors_response.status_code == 200:
        data = doctors_response.json()
        print(f"Total doctors: {data['count']}")
        if data['doctors']:
            print(f"First doctor: {data['doctors'][0]['name']}")
            print(f"Image URL: {data['doctors'][0]['image']}")
    
    # Test users
    print("\n=== Testing Users ===")
    users_response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
    print(f"Status: {users_response.status_code}")
    if users_response.status_code == 200:
        data = users_response.json()
        print(f"Total users: {data['count']}")
        if data['users']:
            print(f"First user: {data['users'][0]['name']}")
    
    # Test appointments
    print("\n=== Testing Appointments ===")
    appts_response = requests.get(f"{BASE_URL}/admin/appointments", headers=headers)
    print(f"Status: {appts_response.status_code}")
    if appts_response.status_code == 200:
        data = appts_response.json()
        print(f"Total appointments: {len(data['appointments'])}")
        if data['appointments']:
            print(f"First appointment: {data['appointments'][0]['user']['name']} with {data['appointments'][0]['doctor']['name']}")

if __name__ == "__main__":
    test_endpoints()
