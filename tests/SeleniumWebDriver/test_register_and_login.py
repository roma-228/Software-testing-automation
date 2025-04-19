from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import random
import string

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

random_suffix = generate_random_string()
email = f"test_{random_suffix}@example.com"
password = f"pass_{random_suffix}"
username = f"user_{random_suffix}"

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)

try:
    driver.get("http://localhost:3000/register.html")
    time.sleep(1)

    driver.find_element(By.ID, "email").send_keys(email)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.ID, "username").send_keys(username)
    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    time.sleep(2)
    assert "Login" in driver.page_source
    print(f"Registered with email: {email} and password: {password}")

    driver.get("http://localhost:3000/login.html")
    time.sleep(1)

    driver.find_element(By.ID, "email").send_keys(email)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Login']").click()

    time.sleep(2)
    assert "Welcome" in driver.page_source or "Logout" in driver.page_source
    print(f"Successfully logged in as: {email}")

finally:
    driver.quit()
