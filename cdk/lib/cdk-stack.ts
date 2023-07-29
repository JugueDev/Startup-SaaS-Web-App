import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontendConstruct } from './frontend-construct';
import { DatabaseConstruct } from './database-construct';
import { BackendConstruct } from './backend-construct';
import { ContentDeliveryConstruct } from './content-delivery-construct';

export class CdkStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const frontendConstruct = new FrontendConstruct(this, 'frontendConstruct');
    const databaseConstruct = new DatabaseConstruct(this, 'databaseConstruct');
    const backendConstruct = new BackendConstruct(this, 'backendConstruct', 
    {
      userTable: databaseConstruct.userTable,
      saleTable: databaseConstruct.saleTable,
      commentTable: databaseConstruct.commentTable
    });
    const contentDeliveryConstruct = new ContentDeliveryConstruct(
      this,
      'contentDeliveryConstruct', 
      {
        frontendBucket: frontendConstruct.frontendBucket,
        backendApi: backendConstruct.api
      })
      

  }
}