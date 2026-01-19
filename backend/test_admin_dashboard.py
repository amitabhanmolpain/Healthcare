import requests
import json

# Base URL
BASE_URL = "http://localhost:5000"

def test_admin_login():
    """Test admin login"""
    print("=" * 50)
    print("Testing Admin Login")
    print("=" * 50)
    
    url = f"{BASE_URL}/admin/login"
    data = {
        "email": "admin@healthcare.com",
        "password": "admin123"
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        token = response.json().get('token')
        print(f"\nToken: {token[:50]}..." if token else "No token received")
        return token
    return None

def test_admin_dashboard(token):
    """Test admin dashboard endpoint"""
    print("\n" + "=" * 50)
    print("Testing Admin Dashboard")
    print("=" * 50)
    
    url = f"{BASE_URL}/admin/dashboard"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Dashboard data retrieved successfully!")
            print(f"Total Users: {data.get('stats', {}).get('total_users', 0)}")
            print(f"Total Doctors: {data.get('stats', {}).get('total_doctors', 0)}")
            print(f"Total Appointments: {data.get('stats', {}).get('total_appointments', 0)}")
        else:
            print(f"\n❌ Dashboard request failed!")
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

def main():
    print("\n🚀 Starting Admin Dashboard Tests\n")
    
    # Test login
    token = test_admin_login()
    
    if not token:
        print("\n❌ Login failed. Cannot proceed with dashboard test.")
        return
    
    # Test dashboard
    test_admin_dashboard(token)
    
    print("\n" + "=" * 50)
    print("Tests Completed")
    print("=" * 50)

if __name__ == "__main__":
    main()
