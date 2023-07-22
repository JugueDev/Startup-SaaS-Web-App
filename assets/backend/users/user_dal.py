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
        print(userId)
        response = table.get_item(Key={'userId': userId})
        print(response)
        item = response['Item']
        user = User(item['userId'], item['name'], item['email'])
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting a user', e)
    else:
        logger.info("GetItem succeeded:"+ str(user))
        return user

def delete_user(event, userId):
    try:
        response = table.delete_item(Key={'userId': userId})
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error deleting a user', e)
    else:
        logger.info("DeleteUser succeeded:")
        return response


def create_user(event, payload):
    user = User(str(uuid.uuid4()), payload.name, payload.email)
    try:
        response = table.put_item(
            Item =
                {
                    'userId': user.userId,
                    'name': user.name,
                    'email': user.email,
                }
        )
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error adding a user', e)
    else:
        logger.info("PutItem succeeded:")
        return user

def update_user(event, payload, userId):
    try:
        user = User(userId, payload.name, payload.email)

        response = table.update_item(Key={'userId': user.userId},
        UpdateExpression="set #n=:name, email=:email",
        ExpressionAttributeNames= {'#n':'name'},
        ExpressionAttributeValues={
            ':name': user.name,
            ':email': user.email
        },
        ReturnValues="UPDATED_NEW")
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error updating a user', e)
    else:
        logger.info("UpdateItem succeeded:")
        return user        

def get_users(event):    
    users =[]
    try:
        response = table.scan()    
        if (len(response['Items']) > 0):
            for item in response['Items']:
                user = user(item['userId'], item['name'], item['email'])
                users.append(user)
                    
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting all users', e)
    else:
        logger.info("Get users succeeded")
        return users


