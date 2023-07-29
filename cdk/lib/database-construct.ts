/* En este construct se crearán todos los recursos asociados a la capa de datos de la aplicación */

import { Construct,  } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from "aws-cdk-lib";

export class DatabaseConstruct extends Construct {
  public readonly userTable: dynamodb.Table; 
  public readonly saleTable: dynamodb.Table; 
  public readonly commentTable: dynamodb.Table; 

  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    // Tabla de Proyectos
    this.saleTable = new dynamodb.Table(this, 'SalesTable', { 
      partitionKey: { name: 'saleId', type: dynamodb.AttributeType.STRING, },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      tableName: 'SalesTable',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Tabla de Usuarios
    this.userTable = new dynamodb.Table(this, 'UserTable', { 
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING, },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      tableName: 'UserTable',
      removalPolicy: RemovalPolicy.DESTROY,
    });
 
    // Tabla de Usuarios
    this.commentTable = new dynamodb.Table(this, 'CommentTable', { 
      partitionKey: { name: 'commentId', type: dynamodb.AttributeType.STRING, },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      tableName: 'CommentTable',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    
   

  }
}
