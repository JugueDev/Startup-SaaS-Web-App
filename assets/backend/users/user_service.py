import json
import utils
import logger
import user_dal
from decimal import Decimal
from types import SimpleNamespace

def get_user(event, context):
    logger.info("Request received to get a user")
    params = event['pathParameters']
    userId = params['id']
    user = user_dal.get_user(event, userId)
    logger.info("Request completed to get a user")    
    return utils.generate_response(user)
    
def create_user(event, context):    
    logger.info("Request received to create a user")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    logger.info(payload)
    user = user_dal.create_user(event, payload)
    logger.info("Request completed to create a user")
    return utils.generate_response(user)
    
def update_user(event, context):
    logger.info("Request received to update a user")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    params = event['pathParameters']
    key = params['id']
    user = user_dal.update_user(event, payload, key)
    logger.info("Request completed to update a user") 
    return utils.generate_response(user)

def delete_user(event, context):
    logger.info("Request received to delete a user")
    params = event['pathParameters']
    key = params['id']
    response = user_dal.delete_user(event, key)
    logger.info("Request completed to delete a user")
    return utils.create_success_response("Successfully deleted the user")

def get_users(event, context):
    logger.info("Request received to get all users")
    response = user_dal.get_users(event)
    logger.info("Request completed to get all users")
    return utils.generate_response(response)

  