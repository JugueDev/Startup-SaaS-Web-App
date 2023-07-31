import os
import boto3
from botocore.exceptions import ClientError
import uuid
import logger
from sale_model import Sale

table_name = os.environ['SALE_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def get_sale(event, saleId):
    try:
        response = table.get_item(Key={'saleId': saleId})
        item = response['Item']
        sale = Sale(item['saleId'], item['date'], item['price'])
        logger.info("GetItem succeeded:"+ str(sale))
        return sale
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting a sale', e)

def delete_sale(event, saleId):
    try:
        response = table.delete_item(Key={'saleId': saleId})
        logger.info("DeleteSale succeeded:")
        return response
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error deleting a sale', e)


def create_sale(event, payload):
    sale = Sale(str(uuid.uuid4()), payload.date, payload.price)
    try:
        response = table.put_item(
            Item =
                {
                    'saleId': sale.saleId,
                    'date': sale.date,
                    'price': sale.price,
                }
        )
        logger.info("PutItem succeeded:")
        return sale
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error adding a sale', e)


def update_sale(event, payload, saleId):
    try:
        sale = Sale(saleId, payload.date, payload.price)

        response = table.update_item(Key={'saleId': sale.saleId},
        UpdateExpression="set #d=:date, price=:price",
        ExpressionAttributeNames= {'#d':'date'},
        ExpressionAttributeValues={
            ':date': sale.date,
            ':price': sale.price
        },
        ReturnValues="UPDATED_NEW")
        logger.info("UpdateItem succeeded:")
        return sale        
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error updating a sale', e)

def get_sales(event):    
    sales =[]
    try:
        response = table.scan()    
        if (len(response['Items']) > 0):
            for item in response['Items']:
                sale = sale(item['saleId'], item['date'], item['price'])
                sales.append(sale)
        logger.info("Get sale succeeded")
        return sales            
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting all sale', e)


