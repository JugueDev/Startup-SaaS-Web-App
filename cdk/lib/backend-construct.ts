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
    saleTable: dynamodb.Table,
    commentTable: dynamodb.Table,
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
            resources: [props.userTable.tableArn, props.saleTable.tableArn, props.commentTable.tableArn],
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

    
      
    // Se define la Lambda para get sales
    const getSaleLambda = new lambda.Function(this, 'backend-get-sale', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'sale_service.get_sale',
      functionName: "backend-get-sale",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/sales")), 
      role: lambdaRole,
      environment: { ["SALE_TABLE_NAME"]: props.saleTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para create sales
    const createSaleLambda = new lambda.Function(this, 'backend-create-sale', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'sale_service.create_sale',
      functionName: "backend-create-sale",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/sales")), 
      role: lambdaRole,
      environment: { ["SALE_TABLE_NAME"]: props.saleTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para eliminar sales
    const deleteSaleLambda = new lambda.Function(this, 'backend-delete-sale', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'sale_service.delete_sale',
      functionName: "backend-delete-sale",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/sales")), 
      role: lambdaRole,
      environment: { ["SALE_TABLE_NAME"]: props.saleTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para actualizar sales
    const updateSaleLambda = new lambda.Function(this, 'backend-update-sale', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'sale_service.update_sale',
      functionName: "backend-update-sale",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/sales")), 
      role: lambdaRole,
      environment: { ["SALE_TABLE_NAME"]: props.saleTable.tableName},
      layers: [utils]
    });


    
      
    // Se define la Lambda para get comments
    const getCommentLambda = new lambda.Function(this, 'backend-get-comment', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'comment_service.get_comment',
      functionName: "backend-get-comment",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/comments")), 
      role: lambdaRole,
      environment: { ["COMMENT_TABLE_NAME"]: props.commentTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para create comments
    const createCommentLambda = new lambda.Function(this, 'backend-create-comment', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'comment_service.create_comment',
      functionName: "backend-create-comment",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/comments")), 
      role: lambdaRole,
      environment: { ["COMMENT_TABLE_NAME"]: props.commentTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para eliminar comments
    const deleteCommentLambda = new lambda.Function(this, 'backend-delete-comment', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'comment_service.delete_comment',
      functionName: "backend-delete-comment",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/comments")), 
      role: lambdaRole,
      environment: { ["COMMENT_TABLE_NAME"]: props.commentTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para actualizar comments
    const updateCommentLambda = new lambda.Function(this, 'backend-update-comment', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'comment_service.update_comment',
      functionName: "backend-update-comment",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/comments")), 
      role: lambdaRole,
      environment: { ["COMMENT_TABLE_NAME"]: props.commentTable.tableName},
      layers: [utils]
    });

    // Se define la Lambda para get ALL comments
    const getCommentsLambda = new lambda.Function(this, 'backend-get-comments', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'comment_service.get_comments',
      functionName: "backend-get-comments",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/comments")), 
      role: lambdaRole,
      environment: { ["COMMENT_TABLE_NAME"]: props.commentTable.tableName},
      layers: [utils]
    });




    // Se crea un api gateway que recibirá las peticiones al backend
    this.api = new apigw.RestApi(this, "RestApi", {
      deploy: true
    });
    const api_resource =  this.api.root
    .addResource("api");
    
    // USER methods
    const user =  api_resource
        .addResource("user");
        user.addMethod("POST", new apigw.LambdaIntegration(createUserLambda))
    const user_id =  user.addResource("{id}");
    user_id.addMethod("GET", new apigw.LambdaIntegration(getUserLambda));
    user_id.addMethod("DELETE", new apigw.LambdaIntegration(deleteUserLambda));
    user_id.addMethod("POST", new apigw.LambdaIntegration(updateUserLambda));
    
    // SALE methods
    const sale = api_resource
        .addResource("sale");
        sale.addMethod("POST", new apigw.LambdaIntegration(createSaleLambda))
    const sale_id =  sale.addResource("{id}");
    sale_id.addMethod("GET", new apigw.LambdaIntegration(getSaleLambda));
    sale_id.addMethod("DELETE", new apigw.LambdaIntegration(deleteSaleLambda));
    sale_id.addMethod("POST", new apigw.LambdaIntegration(updateSaleLambda));
   
    // COMMENT methods
    const comment =  api_resource
        .addResource("comment");
        comment.addMethod("POST", new apigw.LambdaIntegration(createCommentLambda))
    const comment_id =  comment.addResource("{id}");
    comment_id.addMethod("GET", new apigw.LambdaIntegration(getCommentLambda));
    comment_id.addMethod("DELETE", new apigw.LambdaIntegration(deleteCommentLambda));
    comment_id.addMethod("POST", new apigw.LambdaIntegration(updateCommentLambda));

    api_resource.addResource("comments")
    .addMethod("GET", new apigw.LambdaIntegration(getCommentsLambda));



    new CfnOutput(this, "ApiUrl", { value: this.api.url });
  }
}