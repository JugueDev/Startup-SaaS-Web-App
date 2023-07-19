/* En este construct se crearán todos los recursos asociados al frontend de la aplicación */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

export class FrontendConstruct extends Construct {
  public readonly frontendBucket: s3.Bucket; 

  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    // Bucket donde se almacenarán los archivos 
    this.frontendBucket = new s3.Bucket(this, "frontend-bucket-id", {
        bucketName: "serverless-web-app-test-jagr",
        accessControl: s3.BucketAccessControl.PRIVATE,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        });

    // Se copian los archivos frontend al bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3deploy.Source.asset('../assets/landing-frontend/build')],
        destinationBucket: this.frontendBucket,
        destinationKeyPrefix: '', 
      });


  }
}