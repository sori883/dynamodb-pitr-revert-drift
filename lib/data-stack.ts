import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';

import type { ParameterType } from '../parameter';
import { Rds } from './constructs/rds/rds';

interface StackProps extends cdk.StackProps {
  readonly parameter: ParameterType;
  readonly vpc: ec2.IVpc;
  readonly sgRds: ec2.ISecurityGroup;
}

/**
 * データ
 */
export class DataStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const { parameter, vpc, sgRds } = props;

    new Rds(this, 'Rds', {
      vpc,
      securityGroup: sgRds,
      subnetGroup: vpc.selectSubnets({
        subnetGroupName: parameter.diffEnv.vpc.subnets.Private.name,
      }),
      version: parameter.diffEnv.rds.version,
      instanceType: parameter.diffEnv.rds.instanceType,
      removalPolicy: parameter.diffEnv.rds.removalPolicy,
      deletionProtection: parameter.diffEnv.rds.deletionProtection,
      backupDays: parameter.diffEnv.rds.backupDays,
    });
  }
}
