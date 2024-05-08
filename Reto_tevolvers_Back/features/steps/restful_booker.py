from behave import *
import requests
import json

id_global = None

def set_id(new_id):
    global id_global
    id_global = new_id

def get_id():
    return id_global

@given('Send the API url')
def step_impl(context):
    context.url = 'https://restful-booker.herokuapp.com/booking'
    context.headers = {'Content-Type': 'application/json'}
    context.body_create = {
        "firstname" : "Juan",
        "lastname" : "Arias",
        "totalprice" : 987,
        "depositpaid" : True,
        "bookingdates" : {
            "checkin" : "2024-01-01",
            "checkout" : "2024-05-01"
        },
        "additionalneeds" : "Breakfast"
    }

@when('Consume Create request services in the booking API')
def step_impl(context):
    context.res = requests.post(
        context.url,
        data = json.dumps(context.body_create),
        headers = context.headers
    )

@then('Validate status code {code}')
def step_impl(context, code):
    assert context.res.status_code == int(code)

@then('Validate response information')
def step_impl(context):
    set_id(context.res.json()['bookingid'])
    assert context.res.json()['booking'] == context.body_create

@given('Obtain token and send the update API url')
def step_impl(context):
    context.url_token = 'https://restful-booker.herokuapp.com/auth'
    context.headers = {'Content-Type': 'application/json'}
    context.body_token = {
        "username" : "admin",
        "password" : "password123"
    }
    context.res_token = requests.post(
        context.url_token,
        data = json.dumps(context.body_token),
        headers = context.headers
    )

    token = context.res_token.json()['token']

    context.url_updates = f'https://restful-booker.herokuapp.com/booking/{get_id()}'
    context.headers_updates = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': f'token={token}'
        }
    context.body_updates = {
        "firstname" : "Jose",
        "lastname" : "Perez",
        "totalprice" : 987,
        "depositpaid" : True,
        "bookingdates" : {
            "checkin" : "2024-01-15",
            "checkout" : "2024-04-20"
        },
        "additionalneeds" : "Breakfast"
    }

@when('Change data and update in the booking API')
def step_impl(context):
    context.res = requests.put(
        context.url_updates,
        data = json.dumps(context.body_updates),
        headers = context.headers_updates
    )

@then('Validate updates status code {code}')
def step_impl(context, code):
    print('resp: ', context.res.status_code)
    assert context.res.status_code == int(code)

@then('Validate new data in response information')
def step_impl(context):
    assert context.res.json() == context.body_updates


@given('Send Get booking url')
def step_impl(context):
    context.url_get = f'https://restful-booker.herokuapp.com/booking/{get_id()}'
    context.body_get = {
        "firstname" : "Jose",
        "lastname" : "Perez",
        "totalprice" : 987,
        "depositpaid" : True,
        "bookingdates" : {
            "checkin" : "2024-01-15",
            "checkout" : "2024-04-20"
        },
        "additionalneeds" : "Breakfast"
    }

@when('Consult specific booking whit id provided')
def step_impl(context):
    context.res = requests.get(context.url_get)

@then('Validate Get status code {code}')
def step_impl(context, code):
    assert context.res.status_code == int(code)

@then('Validate Get response data')
def step_impl(context):
    assert context.res.json() == context.body_get