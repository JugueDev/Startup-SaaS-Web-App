import os
import boto3
from botocore.exceptions import ClientError
import uuid
import logger
from comment_model import Comment

table_name = os.environ['COMMENT_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def get_comment(event, commentId):
    try:
        response = table.get_item(Key={'commentId': commentId})
        item = response['Item']
        comment = Comment(item['commentId'], item['userName'], item['platform'])
        logger.info("GetItem succeeded:"+ str(comment))
        return comment
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting a comment', e)

def delete_comment(event, commentId):
    try:
        response = table.delete_item(Key={'commentId': commentId})
        logger.info("DeleteComment succeeded:")
        return response
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error deleting a comment', e)


def create_comment(event, payload):
    comment = Comment(str(uuid.uuid4()), payload.userName, payload.platform)
    try:
        response = table.put_item(
            Item =
                {
                    'commentId': comment.commentId,
                    'userName': comment.userName,
                    'platform': comment.platform,
                }
        )
        logger.info("PutItem succeeded:")
        return comment
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error adding a comment', e)


def update_comment(event, payload, commentId):
    try:
        comment = Comment(commentId, payload.userName, payload.platform)

        response = table.update_item(Key={'commentId': comment.commentId},
        UpdateExpression="set userName=:userName, platform=:platform",
        ExpressionAttributeValues={
            ':userName': comment.userName,
            ':platform': comment.platform
        },
        ReturnValues="UPDATED_NEW")
        logger.info("UpdateItem succeeded:")
        return comment        
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error updating a comment', e)

def get_comments(event):    
    comments =[]
    try:
        response = table.scan()    
        if (len(response['Items']) > 0):
            for item in response['Items']:
                comment = Comment(item['commentId'], item['date'], item['price'])
                comments.append(comment)
        logger.info("Get comment succeeded")
        return comment            
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting all comment', e)


