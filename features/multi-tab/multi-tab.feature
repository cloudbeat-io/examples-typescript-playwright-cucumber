Feature: Multi-tab

  Scenario: Opening a second tab during a test
    Given Open the login page
    When Enter username "standard_user" and password "secret_sauce"
    And Press the login button
    Then Login should be successful
    When Open a second tab and navigate to the login page
    Then The login page should be open on the second tab
    Then Throw an error "Error thrown to trigger attachment of test artifacts (video/trace) for the multi-tab repro"
