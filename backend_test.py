#!/usr/bin/env python3
import requests
import json
import sys
import os
from dotenv import load_dotenv
import time

# Load environment variables from frontend/.env to get the backend URL
load_dotenv("/app/frontend/.env")

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BACKEND_URL:
    print("Error: REACT_APP_BACKEND_URL not found in environment variables")
    sys.exit(1)

# Ensure the URL doesn't end with a slash
if BACKEND_URL.endswith("/"):
    BACKEND_URL = BACKEND_URL[:-1]

# Add the /api prefix
API_URL = f"{BACKEND_URL}/api"

print(f"Using API URL: {API_URL}")

# Test results tracking
tests_passed = 0
tests_failed = 0
test_results = []

def run_test(test_name, test_func):
    """Run a test function and track the result"""
    global tests_passed, tests_failed
    
    print(f"\n{'=' * 80}")
    print(f"Running test: {test_name}")
    print(f"{'-' * 80}")
    
    try:
        start_time = time.time()
        result = test_func()
        end_time = time.time()
        
        if result:
            tests_passed += 1
            status = "PASSED"
        else:
            tests_failed += 1
            status = "FAILED"
            
        duration = end_time - start_time
        test_results.append({
            "name": test_name,
            "status": status,
            "duration": duration
        })
        
        print(f"{'-' * 80}")
        print(f"Test {status} in {duration:.2f} seconds")
        
        return result
    except Exception as e:
        tests_failed += 1
        print(f"Test FAILED with exception: {str(e)}")
        test_results.append({
            "name": test_name,
            "status": "FAILED",
            "error": str(e)
        })
        return False

def test_init_data():
    """Test POST /api/init-data to populate snake and emergency data"""
    response = requests.post(f"{API_URL}/init-data")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    
    # Check if the response contains the expected message
    if "message" not in data:
        print("Error: Response does not contain 'message' field")
        return False
    
    # Check if the message indicates successful initialization
    if "Initialized" not in data["message"]:
        print("Error: Response does not indicate successful initialization")
        return False
    
    # Extract the number of snakes and emergency info items
    message = data["message"]
    print(f"Database initialized with: {message}")
    
    return True

def test_get_all_snakes():
    """Test GET /api/snakes to retrieve all snakes"""
    response = requests.get(f"{API_URL}/snakes")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    snakes = response.json()
    print(f"Retrieved {len(snakes)} snakes")
    
    # Check if we have the expected number of snakes (11 from the sample data)
    if len(snakes) != 11:
        print(f"Error: Expected 11 snakes, got {len(snakes)}")
        return False
    
    # Print the first snake as an example
    print(f"Example snake: {json.dumps(snakes[0], indent=2)}")
    
    # Verify that each snake has the required fields
    required_fields = [
        "id", "name", "scientific_name", "continent", "countries", 
        "danger_level", "is_venomous", "image_url", "description", 
        "habitat", "size_range", "identification_features", "behavior", 
        "diet", "what_to_do", "what_not_to_do", "first_aid", "interesting_facts"
    ]
    
    for snake in snakes:
        for field in required_fields:
            if field not in snake:
                print(f"Error: Snake missing required field '{field}'")
                return False
    
    return True

def test_filter_snakes_by_continent():
    """Test GET /api/snakes with continent filter"""
    # Test each continent
    continents = [
        "North America", "South America", "Europe", 
        "Africa", "Asia", "Australia"
    ]
    
    for continent in continents:
        print(f"\nTesting continent filter: {continent}")
        response = requests.get(f"{API_URL}/snakes", params={"continent": continent})
        
        if response.status_code != 200:
            print(f"Error: Unexpected status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        snakes = response.json()
        print(f"Retrieved {len(snakes)} snakes for continent {continent}")
        
        # Check that all snakes are from the specified continent
        for snake in snakes:
            if snake["continent"] != continent:
                print(f"Error: Snake {snake['name']} has continent {snake['continent']}, expected {continent}")
                return False
    
    return True

def test_filter_snakes_by_danger_level():
    """Test GET /api/snakes with danger_level filter"""
    # Test each danger level
    danger_levels = [
        "Harmless", "Mildly Venomous", "Venomous", 
        "Highly Venomous", "Deadly"
    ]
    
    for danger_level in danger_levels:
        print(f"\nTesting danger_level filter: {danger_level}")
        response = requests.get(f"{API_URL}/snakes", params={"danger_level": danger_level})
        
        if response.status_code != 200:
            print(f"Error: Unexpected status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        snakes = response.json()
        print(f"Retrieved {len(snakes)} snakes with danger level {danger_level}")
        
        # Check that all snakes have the specified danger level
        for snake in snakes:
            if snake["danger_level"] != danger_level:
                print(f"Error: Snake {snake['name']} has danger level {snake['danger_level']}, expected {danger_level}")
                return False
    
    return True

def test_search_snakes():
    """Test GET /api/snakes with search parameter"""
    # Test searching by name
    search_terms = [
        {"term": "cobra", "field": "name"},
        {"term": "rattlesnake", "field": "name"},
        {"term": "crotalus", "field": "scientific_name"},
        {"term": "australia", "field": "countries"}
    ]
    
    for search in search_terms:
        term = search["term"]
        field = search["field"]
        
        print(f"\nTesting search for '{term}' in {field}")
        response = requests.get(f"{API_URL}/snakes", params={"search": term})
        
        if response.status_code != 200:
            print(f"Error: Unexpected status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        snakes = response.json()
        print(f"Retrieved {len(snakes)} snakes matching search term '{term}'")
        
        if len(snakes) == 0:
            print(f"Warning: No snakes found for search term '{term}'")
            # This might not be an error if the term is not expected to match anything
        
        # Verify that the search term appears in the expected field for each snake
        for snake in snakes:
            if field == "name":
                if term.lower() not in snake["name"].lower():
                    print(f"Error: Search term '{term}' not found in snake name '{snake['name']}'")
                    return False
            elif field == "scientific_name":
                if term.lower() not in snake["scientific_name"].lower():
                    print(f"Error: Search term '{term}' not found in scientific name '{snake['scientific_name']}'")
                    return False
            elif field == "countries":
                found = False
                for country in snake["countries"]:
                    if term.lower() in country.lower():
                        found = True
                        break
                if not found:
                    print(f"Error: Search term '{term}' not found in countries {snake['countries']}")
                    return False
    
    return True

def test_get_snake_by_id():
    """Test GET /api/snakes/{id} to retrieve a specific snake"""
    # First, get all snakes to get an ID
    response = requests.get(f"{API_URL}/snakes")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    snakes = response.json()
    if not snakes:
        print("Error: No snakes found")
        return False
    
    # Get the ID of the first snake
    snake_id = snakes[0]["id"]
    print(f"Testing retrieval of snake with ID: {snake_id}")
    
    # Get the snake by ID
    response = requests.get(f"{API_URL}/snakes/{snake_id}")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    snake = response.json()
    print(f"Retrieved snake: {snake['name']}")
    
    # Verify that the snake has the expected ID
    if snake["id"] != snake_id:
        print(f"Error: Retrieved snake has ID {snake['id']}, expected {snake_id}")
        return False
    
    # Test with an invalid ID
    invalid_id = "invalid-id"
    print(f"\nTesting retrieval with invalid ID: {invalid_id}")
    response = requests.get(f"{API_URL}/snakes/{invalid_id}")
    
    # Should return 404 Not Found
    if response.status_code != 404:
        print(f"Error: Expected status code 404, got {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    print("Correctly received 404 for invalid ID")
    
    return True

def test_get_continents():
    """Test GET /api/continents to verify continent counts"""
    response = requests.get(f"{API_URL}/continents")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    continents = response.json()
    print(f"Retrieved {len(continents)} continents")
    print(f"Continents: {json.dumps(continents, indent=2)}")
    
    # Check if we have the expected number of continents (6)
    if len(continents) != 6:
        print(f"Error: Expected 6 continents, got {len(continents)}")
        return False
    
    # Check that each continent has a name and count
    for continent in continents:
        if "continent" not in continent or "count" not in continent:
            print(f"Error: Continent missing required fields: {continent}")
            return False
    
    # Verify that the counts match the expected values
    expected_counts = {
        "North America": 2,
        "South America": 1,
        "Europe": 2,
        "Africa": 2,
        "Asia": 2,
        "Australia": 2
    }
    
    for continent in continents:
        name = continent["continent"]
        count = continent["count"]
        
        if name in expected_counts:
            expected = expected_counts[name]
            if count != expected:
                print(f"Error: Continent {name} has count {count}, expected {expected}")
                return False
        else:
            print(f"Warning: Unexpected continent {name}")
    
    return True

def test_get_emergency_info():
    """Test GET /api/emergency for first aid data"""
    response = requests.get(f"{API_URL}/emergency")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    emergency_info = response.json()
    print(f"Retrieved {len(emergency_info)} emergency info items")
    
    # Check if we have the expected number of emergency info items (3)
    if len(emergency_info) != 3:
        print(f"Error: Expected 3 emergency info items, got {len(emergency_info)}")
        return False
    
    # Print the first emergency info item as an example
    print(f"Example emergency info: {json.dumps(emergency_info[0], indent=2)}")
    
    # Verify that each emergency info item has the required fields
    required_fields = ["id", "title", "icon", "priority", "quick_steps", "emergency_numbers"]
    
    for info in emergency_info:
        for field in required_fields:
            if field not in info:
                print(f"Error: Emergency info missing required field '{field}'")
                return False
    
    # Check that the items are sorted by priority
    for i in range(1, len(emergency_info)):
        if emergency_info[i]["priority"] < emergency_info[i-1]["priority"]:
            print(f"Error: Emergency info items not sorted by priority")
            return False
    
    return True

def test_get_stats():
    """Test GET /api/stats for database statistics"""
    response = requests.get(f"{API_URL}/stats")
    
    if response.status_code != 200:
        print(f"Error: Unexpected status code {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    stats = response.json()
    print(f"Retrieved stats: {json.dumps(stats, indent=2)}")
    
    # Check if the stats have the expected fields
    required_fields = ["total_snakes", "venomous_snakes", "deadly_snakes", "continents"]
    
    for field in required_fields:
        if field not in stats:
            print(f"Error: Stats missing required field '{field}'")
            return False
    
    # Verify that the stats match the expected values
    if stats["total_snakes"] != 12:
        print(f"Error: Expected 12 total snakes, got {stats['total_snakes']}")
        return False
    
    # Most snakes in the sample data are venomous
    if stats["venomous_snakes"] < 10:
        print(f"Error: Expected at least 10 venomous snakes, got {stats['venomous_snakes']}")
        return False
    
    # Several snakes in the sample data are deadly
    if stats["deadly_snakes"] < 5:
        print(f"Error: Expected at least 5 deadly snakes, got {stats['deadly_snakes']}")
        return False
    
    # Check that the continent stats match the expected values
    expected_continents = ["North America", "South America", "Europe", "Africa", "Asia", "Australia"]
    for continent in expected_continents:
        if continent not in stats["continents"]:
            print(f"Error: Continent {continent} not found in stats")
            return False
    
    return True

def run_all_tests():
    """Run all tests and print a summary"""
    print("\n" + "=" * 80)
    print("STARTING SERPENTAWARE BACKEND API TESTS")
    print("=" * 80)
    
    # First, initialize the database
    if not run_test("Initialize Database", test_init_data):
        print("Database initialization failed, skipping remaining tests")
        return
    
    # Run all other tests
    run_test("Get All Snakes", test_get_all_snakes)
    run_test("Filter Snakes by Continent", test_filter_snakes_by_continent)
    run_test("Filter Snakes by Danger Level", test_filter_snakes_by_danger_level)
    run_test("Search Snakes", test_search_snakes)
    run_test("Get Snake by ID", test_get_snake_by_id)
    run_test("Get Continents", test_get_continents)
    run_test("Get Emergency Info", test_get_emergency_info)
    run_test("Get Stats", test_get_stats)
    
    # Print summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total tests: {tests_passed + tests_failed}")
    print(f"Tests passed: {tests_passed}")
    print(f"Tests failed: {tests_failed}")
    print("=" * 80)
    
    # Print detailed results
    print("\nDETAILED RESULTS:")
    for result in test_results:
        status = result["status"]
        name = result["name"]
        
        if status == "PASSED":
            duration = result.get("duration", 0)
            print(f"✅ {name} - {duration:.2f}s")
        else:
            error = result.get("error", "")
            print(f"❌ {name} - {error}")
    
    return tests_failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)