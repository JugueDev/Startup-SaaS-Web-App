/* En este construct se crearán todos los recursos asociados a la entrega de contenido */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import { OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";

export interface ContentDeliveryConstructProps {
    /** props needed to work **/
    frontendBucket: s3.Bucket,
  }

export class ContentDeliveryConstruct extends Construct {

  constructor(scope: Construct, id: string, props: ContentDeliveryConstructProps) {
    super(scope, id);

    // Se crear un OAI que otorga acceso de lectura
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    props.frontendBucket.grantRead(originAccessIdentity);

    // Se crea una distribución en Cloudfront para el acceso a S3
    const cloudfrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: props.frontendBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [
              {
                compress: true,
                isDefaultBehavior: true,
                defaultTtl: Duration.seconds(0),
                allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              },
            ],
          },
        ]
      })

  }
}