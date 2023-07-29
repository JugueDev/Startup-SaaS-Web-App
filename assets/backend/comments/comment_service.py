import json
import utils
import logger
import comment_dal
from decimal import Decimal
from types import SimpleNamespace

def get_comment(event, context):
    logger.info("Request received to get a comment")
    params = event['pathParameters']
    commentId = params['id']
    comment = comment_dal.get_comment(event, commentId)
    logger.info("Request completed to get a comment")    
    return utils.generate_response(comment)
    
def create_comment(event, context):    
    logger.info("Request received to create a comment")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    logger.info(payload)
    comment = comment_dal.create_comment(event, payload)
    logger.info("Request completed to create a comment")
    return utils.generate_response(comment)
    
def update_comment(event, context):
    logger.info("Request received to update a comment")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    params = event['pathParameters']
    key = params['id']
    comment = comment_dal.update_comment(event, payload, key)
    logger.info("Request completed to update a comment") 
    return utils.generate_response(comment)

def delete_comment(event, context):
    logger.info("Request received to delete a comment")
    params = event['pathParameters']
    key = params['id']
    response = comment_dal.delete_comment(event, key)
    logger.info("Request completed to delete a comment")
    return utils.create_success_response("Successfully deleted the comment")

def get_comments(event, context):
    logger.info("Request received to get all comments")
    response = comment_dal.get_comments(event)
    logger.info("Request completed to get all comments")
    return utils.generate_response(response)

  