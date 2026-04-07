@sanity
Feature: Products

  Background:
    Given Logged in as "standard_user" with password "secret_sauce"

  Scenario: Add and remove products from cart
    Then Product listing should show 6 products
    When Add product at index 0 to cart
    Then Price bar at index 0 should show button "Remove"
    When Remove product at index 0 from cart
    Then Price bar at index 0 should show button "Add to cart"
