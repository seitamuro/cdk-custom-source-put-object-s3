import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cr from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkCustomSourcePutObjectS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cr.AwsCustomResource(this, "CustomResource", {
      onCreate: {
        service: "S3",
        action: "putObject",
        parameters: {
          Bucket: bucket.bucketName,
          Key: "hello.txt",
          Body: "Hello, CDK!",
        },
        physicalResourceId: cr.PhysicalResourceId.of("HelloWorld"),
      },
      onDelete: {
        service: "S3",
        action: "deleteObject",
        parameters: {
          Bucket: bucket.bucketName,
          Key: "hello.txt",
        },
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}
