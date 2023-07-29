import os
import boto3
from botocore.exceptions import ClientError
import uuid
import logger
from user_model import User

table_name = os.environ['USER_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def get_user(event, userId):
    try:
        response = table.get_item(Key={'userId': userId})
        item = response['Item']
        user = User(item['userId'], item['name'], item['email'], item['edad'], item['prod_favorito'], item['interaccion'])
        logger.info("GetItem succeeded:"+ str(user))
        return user
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting a user', e)

def delete_user(event, userId):
    try:
        response = table.delete_item(Key={'userId': userId})
        logger.info("DeleteUser succeeded:")
        return response
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error deleting a user', e)


def create_user(event, payload):
    user = User(str(uuid.uuid4()), payload.name, payload.email, payload.edad, payload.prod_favorito, payload.interaccion)
    try:
        response = table.put_item(
            Item =
                {
                    'userId': user.userId,
                    'name': user.name,
                    'email': user.email,
                    'edad': user.edad,
                    'prod_favorito': user.prod_favorito,
                    'interaccion': user.interaccion,
                }
        )
        logger.info("PutItem succeeded:")
        return user
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error adding a user', e)

def update_user(event, payload, userId):
    try:
        user = User(userId, payload.name, payload.email, payload.edad, payload.prod_favorito, payload.interaccion)

        response = table.update_item(Key={'userId': user.userId},
        UpdateExpression="set #n=:name, email=:email, edad=:edad, prod_favorito=:prod_favorito, interaccion=:interaccion",
        ExpressionAttributeNames= {'#n':'name'},
        ExpressionAttributeValues={
            ':name': user.name,
            ':email': user.email,
            ':edad': user.edad,
            ':prod_favorito': user.prod_favorito,
            ':interaccion': user.interaccion,
        },
        ReturnValues="UPDATED_NEW")
        logger.info("UpdateItem succeeded:")
        return user        
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error updating a user', e)

def get_users(event):    
    users =[]
    try:
        response = table.scan()    
        if (len(response['Items']) > 0):
            for item in response['Items']:
                user = User(item['userId'], item['name'], item['email'], item['edad'], item['prod_favorito'], item['interaccion'])
                users.append(user)
                    
        logger.info("Get users succeeded")
        return users
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting all users', e)


