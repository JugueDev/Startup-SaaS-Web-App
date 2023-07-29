import json
import utils
import logger
import sale_dal
from decimal import Decimal
from types import SimpleNamespace

def get_sale(event, context):
    logger.info("Request received to get a sale")
    params = event['pathParameters']
    saleId = params['id']
    sale = sale_dal.get_sale(event, saleId)
    logger.info("Request completed to get a sale")    
    return utils.generate_response(sale)
    
def create_sale(event, context):    
    logger.info("Request received to create a sale")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    logger.info(payload)
    sale = sale_dal.create_sale(event, payload)
    logger.info("Request completed to create a sale")
    return utils.generate_response(sale)
    
def update_sale(event, context):
    logger.info("Request received to update a sale")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d), parse_float=Decimal)
    params = event['pathParameters']
    key = params['id']
    sale = sale_dal.update_sale(event, payload, key)
    logger.info("Request completed to update a sale") 
    return utils.generate_response(sale)

def delete_sale(event, context):
    logger.info("Request received to delete a sale")
    params = event['pathParameters']
    key = params['id']
    response = sale_dal.delete_sale(event, key)
    logger.info("Request completed to delete a sale")
    return utils.create_success_response("Successfully deleted the sale")

def get_sales(event, context):
    logger.info("Request received to get all sales")
    response = sale_dal.get_sales(event)
    logger.info("Request completed to get all sales")
    return utils.generate_response(response)

  