*** Settings ***
Library           SeleniumLibrary
Library           Collections

*** Variables ***
${BROWSER}        Chrome
${URLREG}         http://localhost:3000/register.html
${URLLOGIN}       http://localhost:3000/login.html
${EMAIL}          testrobot@gmail.com
${PASSWORD}       testrobot
${USERNAME}       testrobot

*** Keywords ***
Open Browser To Blog
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage
    Create Webdriver    Chrome    chrome_options=${options}
    Maximize Browser Window

*** Test Cases ***
Register With Admin Credentials
    Go To    ${URLREG}
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text    id=email       ${EMAIL}
    Input Text    id=password    ${PASSWORD}
    Input Text    id=username    ${USERNAME}
    Click Button    xpath=//button[text()='Register']
    Sleep    2s
    Wait Until Page Contains Element    xpath=//h1[contains(text(), 'Login')]

Login With Admin Credentials
    Go To    ${URLLOGIN}
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text    id=email    ${EMAIL}
    Input Text    id=password    ${PASSWORD}
    Click Button    xpath=//button[text()='Login']
    Sleep    2s
