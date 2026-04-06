Feature: Examples

  Scenario Outline: Data driven test
    Given Log "executing test for data record - <name>"

    Examples:
      | name |
      | foo  |
      | bar  |
      | qaz  |

  Scenario: Example of suppressing failures with try-catch
    Given Open the login page
    When Enter username "standard_user" and password "invalid pass"
    And Press the login button
    Then Try to assert login success and suppress the failure

  Scenario: Example of setting failure reason
    Given Open the login page
    When Enter username "standard_user" and password "invalid pass"
    And Press the login button
    Then Try to assert login success and set failure reason on failure

  Scenario: Example of setting test attribute and output data
    Given Open the login page
    Then Add test attribute "someTestAttributeName" with value "test attribute value"
    And Add output data "someOutputDataName" with value "output data value"

  Scenario: Example of intercepting browser console logs
    Given Start intercepting browser console logs
    And Open the login page
    When Enter username "standard_user" and password "secret_sauce"
    And Press the login button
    Then Login should be successful

  Scenario: Example of throwing an error outside a step
    Given Open the login page
    Then Throw an error "Error thrown outside a step"
