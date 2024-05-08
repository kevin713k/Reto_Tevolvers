Feature: Consult API Restful-booker for Create, Update* and Get

  Scenario: Creates a new booking in the API
    Given Send the API url
    When Consume Create request services in the booking API
    Then Validate status code 200
    And Validate response information

  Scenario: Updates a current booking
    Given Obtain token and send the update API url
    When Change data and update in the booking API
    Then Validate updates status code 200
    And Validate new data in response information

  Scenario: Get booking Returns a specific booking based upon the booking id provided
    Given Send Get booking url
    When Consult specific booking whit id provided
    Then Validate Get status code 200
    And Validate Get response data
