/* En este construct se crearán todos los recursos asociados al backend de la aplicación */

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct,  } from 'constructs';
import * as path from 'path';
import { CfnOutput } from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface BackendConstructProps {
    /** props needed to work **/
    userTable: dynamodb.Table,
  }

export class BackendConstruct extends Construct {
  public readonly api: apigw.RestApi; 

  constructor(scope: Construct, id: string, props: BackendConstructProps) {
    super(scope, id);


    // Creamos un rol para asignarlo a la función lambda
    const lambdaRole = new iam.Role(this, "lambda-invoke-role-id", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        roleName: "Lambda-Backend-Role",
        description: "Rol de IAM para que las funciones lambda puedan ejecutarse.",
      });

    // Añademos Managed Policies al rol de IAM
    lambdaRole.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
        'CloudWatchLambdaInsightsExecutionRolePolicy', 
        )
    );
    lambdaRole.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole', 
        )
    );
    lambdaRole.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole',
        )
    );

    // Añademos un User Policy al rol de IAM
    lambdaRole.addToPolicy(
        new iam.PolicyStatement({
            resources: [props.userTable.tableArn],
            actions: ["dynamodb:GetItem","dynamodb:UpdateItem","dynamodb:PutItem","dynamodb:DeleteItem","dynamodb:Query","dynamodb:Scan"],
        })
    );
      
    // Layer
    const utils = new lambda.LayerVersion(this, 'utils', {
        compatibleRuntimes: [
            lambda.Runtime.PYTHON_3_9,
        ],
        code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/layers")),
        description: 'Utils',
        });
      
    // Se define la Lambda para get users
    const getUserLambda = new lambda.Function(this, 'backend-get-user', {
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: 'user_service.get_user',
        functionName: "backend-get-user",
        code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/users")), 
        role: lambdaRole,
        environment: { ["USER_TABLE_NAME"]: props.userTable.tableName},
        layers: [utils]
      });

    // Se define la Lambda para create users
    const createUserLambda = new lambda.Function(this, 'backend-create-user', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'user_service.create_user',
      functionName: "backend-create-user",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/users")), 
      role: lambdaRole,
      environment: { ["USER_TABLE_NAME"]: props.userTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para eliminar users
    const deleteUserLambda = new lambda.Function(this, 'backend-delete-user', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'user_service.delete_user',
      functionName: "backend-delete-user",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/users")), 
      role: lambdaRole,
      environment: { ["USER_TABLE_NAME"]: props.userTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para actualizar users
    const updateUserLambda = new lambda.Function(this, 'backend-update-user', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'user_service.update_user',
      functionName: "backend-update-user",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/users")), 
      role: lambdaRole,
      environment: { ["USER_TABLE_NAME"]: props.userTable.tableName},
      layers: [utils]
    });

    // Se crea un api gateway que recibirá las peticiones al backend
    this.api = new apigw.RestApi(this, "RestApi", {
      deploy: true
    });
    
    const user =  this.api.root
        .addResource("user");
        user.addMethod("POST", new apigw.LambdaIntegration(createUserLambda))
    const user_id =  user.addResource("{id}");
    user_id.addMethod("GET", new apigw.LambdaIntegration(getUserLambda));
    user_id.addMethod("DELETE", new apigw.LambdaIntegration(deleteUserLambda));
    user_id.addMethod("POST", new apigw.LambdaIntegration(updateUserLambda));


    new CfnOutput(this, "ApiUrl", { value: this.api.url });
 
  }
}