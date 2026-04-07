@sanity
Feature: Login

  Scenario: Standard user login behaviour
    Given Open the login page
    When Enter username "standard_user" and password "secret_sauce"
    And Press the login button
    Then Login should be successful

  @loginLockedOut
  Scenario: Locked out user login behaviour
    Given Open the login page
    When Enter username "locked_out_user" and password "secret_sauce"
    And Press the login button
    Then Login error "Epic sadface: Sorry, this user has been locked out." should be displayed

  Scenario: Invalid user login behaviour
    Given Open the login page
    When Enter username "invalid_user" and password "invalid_password"
    And Press the login button
    Then Login error "Epic sadface: Username and password do not match any user in this service" should be displayed
