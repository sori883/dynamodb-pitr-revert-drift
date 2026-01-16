import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';

import type { ParameterType } from '../parameter';
import { Ec2 } from './constructs/ec2/ec2';

interface StackProps extends cdk.StackProps {
  readonly parameter: ParameterType;
  readonly vpc: ec2.IVpc;
  readonly sgEc2: ec2.ISecurityGroup;
}

/**
 * アプリ、ワークロード
 */
export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const { parameter, vpc, sgEc2 } = props;

    new Ec2(this, 'Ec2', {
      vpc,
      securityGroup: sgEc2,
      subnet: vpc.selectSubnets({
        subnetGroupName: parameter.diffEnv.vpc.subnets.Private.name,
      }).subnets[0],
      instanceType: parameter.diffEnv.ec2.instanceType,
    });
  }
}
