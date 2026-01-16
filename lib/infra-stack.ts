import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';

import type { ParameterType } from '../parameter';
import { Vpc } from './constructs/network/vpc';
import { VpcEndpoint } from './constructs/network/vpce';
import { SgApp } from './constructs/security-group/sg-app';
import { SgVpce } from './constructs/security-group/sg-vpce';

interface StackProps extends cdk.StackProps {
  readonly parameter: ParameterType;
}

/**
 * インフラ
 */
export class InfraStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly sgEc2: ec2.ISecurityGroup;
  public readonly sgRds: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const { parameter } = props;

    const vpc = new Vpc(this, 'VPC', {
      publicNats: parameter.diffEnv.vpc.publicNats,
      cidr: parameter.diffEnv.vpc.cidr,
      maxAzs: parameter.diffEnv.vpc.maxAzs,
      subnetConfigs: Object.values(parameter.diffEnv.vpc.subnets),
    });
    this.vpc = vpc.vpc;

    const sgVpce = new SgVpce(this, 'SgVpce', {
      vpc: vpc.vpc,
    });
    const sgApp = new SgApp(this, 'SgApp', {
      vpc: vpc.vpc,
    });
    this.sgEc2 = sgApp.sgEc2;
    this.sgRds = sgApp.sgRds;

    new VpcEndpoint(this, 'VpcEndpoint', {
      vpc: vpc.vpc,
      SgVpce: sgVpce.sgVpce,
      vpceSubnets: vpc.vpc.selectSubnets({
        subnetGroupName: parameter.diffEnv.vpc.subnets.Private.name,
      }),
    });
  }
}
