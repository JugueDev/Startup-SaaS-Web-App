/* En este construct se crearán todos los recursos asociados a la entrega de contenido */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import { OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { Stack,CfnOutput } from 'aws-cdk-lib';
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";

export interface ContentDeliveryConstructProps {
    /** props needed to work **/
    frontendBucket: s3.Bucket,
    backendApi: apigw.RestApi; 

  }

export class ContentDeliveryConstruct extends Construct {

  constructor(scope: Construct, id: string, props: ContentDeliveryConstructProps) {
    super(scope, id);

    // Se crear un OAI que otorga acceso de lectura
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    props.frontendBucket.grantRead(originAccessIdentity);

    const apiOrigin = new cloudfront_origins.HttpOrigin(
      `${props.backendApi.restApiId}.execute-api.${Stack.of(this).region}.amazonaws.com`,
      {
        customHeaders: {
        },
        originPath: `/${props.backendApi.deploymentStage.stageName}`,
        originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      }
    );

    const s3Origin = new cloudfront_origins.S3Origin(
      props.frontendBucket,
      {
        originAccessIdentity: originAccessIdentity,
      });

    
    const cloudFrontDistribution = new cloudfront.Distribution(
      this,
      "CloudFrontDistribution",
      {
        defaultBehavior: {
          origin: s3Origin,
          allowedMethods:
            cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          "/api*": {
            origin: apiOrigin,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
            cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
      }
    );

    new CfnOutput(this, 'website-url', {
      value: cloudFrontDistribution.distributionDomainName,
      description: 'The URL of our website',
      exportName: 'websiteUrl',
  });



  }
}